let interval;
let auth; 
let serverUrl = "http://ec2-3-39-9-10.ap-northeast-2.compute.amazonaws.com/";
let inProgress = false;
let lectureId;

chrome.browserAction.onClicked.addListener(function(tab){
  chrome.tabs.sendMessage(tab.id,"toggle");
  checkUrl();
});

const extend = function() { //helper function to merge objects
  let target = arguments[0],
      sources = [].slice.call(arguments, 1);
  for (let i = 0; i < sources.length; ++i) {
    let src = sources[i];
    for (key in src) {
      let val = src[key];
      target[key] = typeof val === "object"
        ? extend(typeof target[key] === "object" ? target[key] : {}, val)
        : val;
    }
  }
  return target;
};

const WORKER_FILE = {
  wav: "WavWorker.js"
};

// default configs
const CONFIGS = {
  numChannels: 1,     // number of channels
  encoding: "wav",    // encoding (can be changed at runtime)

  // runtime options
  options: {
    timeLimit: 10,           // recording time limit (sec)
    encodeAfterRecord: true, // process encoding after recording
    progressInterval: 1000,   // encoding progress report interval (millisec)
    bufferSize: undefined,    // buffer size (use browser default)

    // encoding-specific options
    wav: {
      mimeType: "audio/wav"
    }
  }
};

class Recorder {

  constructor(source, configs) { //creates audio context from the source and connects it to the worker
    extend(this, CONFIGS, configs || {});
    this.context = source.context;
    if (this.context.createScriptProcessor == null)
      this.context.createScriptProcessor = this.context.createJavaScriptNode;
    this.input = this.context.createGain();
    source.connect(this.input);
    this.buffer = [];
    this.initWorker();
  }

  isRecording() {
    return this.processor != null;
  }

  setEncoding(encoding) {
    if(!this.isRecording() && this.encoding !== encoding) {
        this.encoding = encoding;
        this.initWorker();
    }
  }

  setOptions(options) {
    if (!this.isRecording()) {
      extend(this.options, options);
      this.worker.postMessage({ command: "options", options: this.options});
    }
  }

  startRecording() {
    if(!this.isRecording()) {
      let numChannels = this.numChannels;
      let buffer = this.buffer;
      let worker = this.worker;
      this.processor = this.context.createScriptProcessor(
        this.options.bufferSize,
        this.numChannels, this.numChannels);
      this.input.connect(this.processor);
      this.processor.connect(this.context.destination);
      this.processor.onaudioprocess = function(event) {
        for (var ch = 0; ch < numChannels; ++ch)
          buffer[ch] = event.inputBuffer.getChannelData(ch);
        worker.postMessage({ command: "record", buffer: buffer });
      };
      this.worker.postMessage({
        command: "start",
        bufferSize: this.processor.bufferSize
      });
      this.startTime = Date.now();
    }
  }

  cancelRecording() {
    if(this.isRecording()) {
      inProgress = false;
      this.input.disconnect();
      this.processor.disconnect();
      delete this.processor;
      this.worker.postMessage({ command: "cancel" });
      // var subtitlesArr = [];
      // chrome.storage.local.set({subtitles: subtitlesArr}, function () {
      //   console.log("subtitles reinitialized");
      // });
    }
  }

  finishRecording() {
    if (this.isRecording()) {
      this.input.disconnect();
      this.processor.disconnect();
      delete this.processor;
      this.worker.postMessage({ command: "finish" });
    }
  }

  cancelEncoding() {
    if (this.options.encodeAfterRecord)
      if (!this.isRecording()) {
        this.onEncodingCanceled(this);
        this.initWorker();
      }
  }

  initWorker() {
    if (this.worker != null)
      this.worker.terminate();
    this.onEncoderLoading(this, this.encoding);
    this.worker = new Worker(WORKER_FILE[this.encoding]);
    let _this = this;
    this.worker.onmessage = function(event) {
      let data = event.data;
      switch (data.command) {
        case "loaded":
          _this.onEncoderLoaded(_this, _this.encoding);
          break;
        case "timeout":
          _this.onTimeout(_this);
          break;
        case "progress":
          _this.onEncodingProgress(_this, data.progress);
          break;
        case "complete":
          _this.onComplete(_this, data.blob);
      }
    }
    this.worker.postMessage({
      command: "init",
      config: {
        sampleRate: this.context.sampleRate,
        numChannels: this.numChannels
      },
      options: this.options
    });
  }

  onEncoderLoading(recorder, encoding) {}
  onEncoderLoaded(recorder, encoding) {}
  onTimeout(recorder) {}
  onEncodingProgress(recorder, progress) {}
  onEncodingCanceled(recorder) {}
  onComplete(recorder, blob) {}

}

const audioCapture = (timeLimit, muteTab, format, quality, limitRemoved) => {
  chrome.tabCapture.capture({audio: true}, (stream) => { // sets up stream for capture
    let startTabId; //tab when the capture is started
    let timeout;
    timeLeft = 10000;
    let audioURL = null; //resulting object when encoding is completed
    chrome.tabs.query({active:true, currentWindow: true}, (tabs) => startTabId = tabs[0].id) //saves start tab
    const liveStream = stream;
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    let mediaRecorder = new Recorder(source); //initiates the recorder based on the current stream
    mediaRecorder.setEncoding(format); //sets encoding based on options
    if(limitRemoved) { //removes time limit
      mediaRecorder.setOptions({timeLimit: 10800});
    } else {
      mediaRecorder.setOptions({timeLimit: timeLimit/1000});
    }
    mediaRecorder.startRecording();

    interval = setInterval(() => {
      timeLeft = timeLeft - 1000;
      console.log("Recording in progress: " + timeLeft/1000 + " seconds left");
      if(timeLeft <= 0){
        stopCapture();
      }
    }, 1000);

    function onStopCommand(command) { //keypress
      if (command === "stop") {
        stopCapture();
      }
    }
    function onStopClick(request) { //click on popup
      if(request === "stopCapture") {
        stopCapture();
      } else if (request === "cancelCapture") {
        cancelCapture();
      } else if (request.cancelEncodeID) {
        if(request.cancelEncodeID === startTabId && mediaRecorder) {
          mediaRecorder.cancelEncoding();
        }
      }
    }
    function generateSave(url) { //saves file 
      const currentDate = new Date(Date.now()).toDateString();
      chrome.downloads.download({url: url, filename: `${currentDate}.${format}`, saveAs: false});
    }
    chrome.commands.onCommand.addListener(onStopCommand);
    chrome.runtime.onMessage.addListener(onStopClick);
    mediaRecorder.onComplete = (recorder, blob) => {
      audioURL = window.URL.createObjectURL(blob);
      //generateSave(audioURL);
      postAudio(blob);
      mediaRecorder = null;
    }
    mediaRecorder.onEncodingProgress = (recorder, progress) => {
    }

    const stopCapture = function() {
      let endTabId;

      console.log("[LOG] stopping current capture");
      //check to make sure the current tab is the tab being captured
      clearInterval(interval);
      mediaRecorder.finishRecording();  
      closeStream(startTabId);
      restartCapture(startTabId);
    }

    const cancelCapture = function() {
      let endTabId;
      clearInterval(interval);
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        endTabId = tabs[0].id;
        if(mediaRecorder && startTabId === endTabId){
          mediaRecorder.cancelRecording();
          closeStream(endTabId);
        }
      })
    }

//removes the audio context and closes recorder to save memory
    const closeStream = function(endTabId) {
      chrome.commands.onCommand.removeListener(onStopCommand);
      chrome.runtime.onMessage.removeListener(onStopClick);
      mediaRecorder.onTimeout = () => {};
      audioCtx.close();
      liveStream.getAudioTracks()[0].stop();
      sessionStorage.removeItem(endTabId);
      chrome.runtime.sendMessage({captureStopped: endTabId});
    }

    mediaRecorder.onTimeout = stopCapture;

    if(!muteTab) {
      let audio = new Audio();
      audio.srcObject = liveStream;
      audio.play();
    }
  });
}

//sends reponses to and from the popup menu
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.currentTab && sessionStorage.getItem(request.currentTab)) {
    sendResponse(sessionStorage.getItem(request.currentTab));
  } else if (request.currentTab){
    sendResponse(false);
  } else if (request === "startCapture") {
    var subtitlesArr = [];
    chrome.storage.sync.set({subtitles: subtitlesArr}, function () {
      console.log("subtitles reinitialized");
    });
    inProgress = true;
    const api = "api/stt/";
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let splitArr = tabs[0].url.split('/');
      const num = splitArr.length;
      let url = splitArr[num-1].split('?');
      var data = JSON.stringify({title: url[0]});
      if(url[0] != "") {
        console.log("강연 제목: "+ url[0]);
        sendJson(api, data);
      } else {
        console.log("강연을 선택해주세요.");
        inProgress = false;
      }
    });
  }
});

const startCapture = function() {
  console.log("[LOG] starting audio capture");
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if(!sessionStorage.getItem(tabs[0].id)) {
      sessionStorage.setItem(tabs[0].id, Date.now());
      chrome.storage.sync.get({
        maxTime: 10000,
        muteTab: false,
        format: "wav",
        quality: 96,
        limitRemoved: false
      }, (options) => {
        let time = options.maxTime;
        if(time > 10000) {
          time = 10000
        }
        audioCapture(time, options.muteTab, options.format, options.quality, options.limitRemoved);
      });
      chrome.runtime.sendMessage({captureStarted: tabs[0].id, startTime: Date.now()});
    }
  });
};

const restartCapture = function(id) {
  console.log("[LOG] restarting audio capture");
  if(!sessionStorage.getItem(id)) {
    sessionStorage.setItem(id, Date.now());
    chrome.storage.sync.get({
      maxTime: 10000,
      muteTab: false,
      format: "wav",
      quality: 96,
      limitRemoved: false
    }, (options) => {
      let time = options.maxTime;
      if(time > 10000) {
        time = 10000
      }
      audioCapture(time, options.muteTab, options.format, options.quality, options.limitRemoved);
    });
    chrome.runtime.sendMessage({captureStarted: id, startTime: Date.now()});
  }
};

chrome.commands.onCommand.addListener((command) => {
  if (command === "start") {
    startCapture();
  }
});

// Handles login/logout/join messages from login.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "login" || request.type === "join") {
    if(request.name === "" || request.pw === ""){
      chrome.runtime.sendMessage("stringEmpty");
      return;
    }
    const url = "api/user/" + request.type;
    var data = JSON.stringify({username: request.name, password: request.pw});
    sendJson(url, data);
  } else if (request.type === "logOut") {
    logOut();
  } 
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.name == 'setLoginCookie') {
    var obj = {username:request.username, password:request.password, authorization:auth}    
    chrome.storage.sync.set(obj, function() {
    });           
  } else if (request.name == 'getLoginCookie') {
    chrome.storage.sync.get(function(data) {
      sendResponse({ username: data.username, password: data.password, authorization: data.authorization });
      console.log("Login Cookie loaded - username: " + data.username + " password: "+ data.password + " authorization: " + data.authorization);
    })       
  } else if(request.name === 'getStatus') {
    sendResponse({status: inProgress});
  } else if(request.name === 'getSubtitles') {
    console.log("loading subtitles");
    chrome.storage.sync.get('subtitles', function (result) {
      sendResponse({subtitles: result.subtitles});
    });
  } else if(request.name === 'getTranscript') {
    var url = "api/lecture/" + lectureId + "/translate";
    getJson(url);
  } else if(request.name === 'getKeywords') {
    var url = "api/lecture/" + lectureId + "/keyword";
    getJson(url);
  }
  return true;
});

function postAudio(blob){
  let fileName = 'stt_audio.wav';
  const baseUrl = serverUrl;
  var formData = new FormData();
  formData.append("file", blob, fileName);
  const reqUrl = baseUrl + "api/stt/" + lectureId;
  var request = new XMLHttpRequest();
  request.open("POST", reqUrl, true);
  request.setRequestHeader("Authorization", auth);
  request.onreadystatechange = function() { 
    if (this.readyState === XMLHttpRequest.DONE ) {
      if(this.status === 200) {
        const obj = JSON.parse(this.responseText);
        processSubtitles(obj.text);
        console.log(obj.text);
      } 
    }
  }
  request.send(formData);
}

const processSubtitles = function(data) {
  chrome.storage.sync.get({subtitles: []}, function (result) {
    var subtitlesArr = result.subtitles;
    subtitlesArr.push({subtitles: data});
    chrome.storage.sync.set({subtitles: subtitlesArr}, function () {
      chrome.storage.sync.get('subtitles', function (result) {
        console.log(result.subtitles);
        chrome.runtime.sendMessage({name:"subtitle", text:result.subtitles }); 
      });
    });
});
}

const sendJson = function(url, data) {
  console.log("[LOG] sending request to " + url);
  const req = new XMLHttpRequest();
  const reqUrl = serverUrl + url;
  req.open("POST", reqUrl, true);
  if(url.toLowerCase().includes("stt")){
    req.setRequestHeader("Authorization", auth);
  }
  req.setRequestHeader("Content-type", "application/json;charset=utf-8");
  req.send(data);
  req.onreadystatechange = function() { 
    if (this.readyState === XMLHttpRequest.DONE ) {
      console.log("[LOG] received response from " + url + ": " + this.responseText);
      onResponse(this, url);
    }
  }
}

const getJson = function(url) {
  console.log("[LOG] sending request to " + url);
  const req = new XMLHttpRequest();
  const reqUrl = serverUrl + url;
  req.open("GET", reqUrl, true);
  req.setRequestHeader("Authorization", auth);
  req.send();
  req.onreadystatechange = function() { 
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log("[LOG] received response from " + url + ": " + this.responseText);
      onResponse(this, url);
    }
  }
}

const onResponse = function(req, url) {
  if(url.toLowerCase().includes("login") === true){
    if(req.status === 200) {
      auth = req.getResponseHeader("Authorization");
      chrome.runtime.sendMessage("loginSuccess"); 
    } else {
      chrome.runtime.sendMessage("loginFail"); 
    }
  } else if(url.toLowerCase().includes("join") === true){
    if(req.status === 200) {
      chrome.runtime.sendMessage("signUpSuccess");
    } else {
      chrome.runtime.sendMessage("signupFail");
    }
  } else if(url.toLowerCase().includes("stt") === true){
    if(req.status === 200) {
      const obj = JSON.parse(req.responseText);
      console.log(obj.id);
      lectureId = obj.id;
      startCapture();
    }
  } else if(url.toLowerCase().includes("translate") === true){
    const obj = JSON.parse(req.responseText);
    printTranscript(obj.translatedText);
  } else if(url.toLowerCase().includes("keyword") === true) {
    const obj = JSON.parse(req.responseText);
    printKeywords(obj.keywordList);
  }
}

const printTranscript = function(translated) {
  chrome.storage.sync.get('subtitles', function (result) {
    var transcript;
    for (var i = 0; i < result.subtitles.length; i++) {
      transcript += result.subtitles[i].subtitles + " ";
    }
    chrome.runtime.sendMessage({name: "printTranslated", transcript: transcript, translated: translated});
  });
}

const printKeywords = function(list) {
  chrome.runtime.sendMessage({name: "printKeywords", keywordList: list});
}

const logOut = function() {
  console.log("[LOG] clear login cookies");
  var toRemove = ["username","password","authorization"];
  chrome.storage.sync.remove(toRemove);
  var subtitlesArr = [];
  chrome.storage.sync.set({subtitles: subtitlesArr}, function () {
    console.log("subtitles reinitialized");
  });
}

// Open new tab if url doesn't contain ted.com
const checkUrl = function() {
  console.log("[LOG] verify url");
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    if(url.toLowerCase().includes("ted.com") === false) {
      chrome.tabs.create({url: "https://ted.com"});
    }
  });
};