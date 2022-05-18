document.addEventListener('DOMContentLoaded', function() {
  const finishButton = document.getElementById('finish');
  const studyButton = document.getElementById('study');
  const backButton = document.getElementById('back');
  const subtitleBox = document.getElementById('subtitleBox');
  const loading = document.getElementById('loading');
  finishButton.onclick = () => {stopProcess()};
  studyButton.style.display = 'none';
  backButton.style.display = 'none';
  studyButton.onclick = () => {showKeywords()};
  backButton.onclick = () => {window.location.href="popup.html";};
  subtitleBox.innerHTML = "";
  loading.style.display = 'none';
  const stopProcess = function() {  
    chrome.runtime.sendMessage("cancelCapture");
    loading.style.display = 'block';
    subtitleBox.style.display = 'none';
    studyButton.style.display = 'block';
    finishButton.style.display = 'none';
    showTranscript();
  }

  const showKeywords = function() {
    loading.style.display = 'block';
    subtitleBox.style.display = 'none';
    chrome.runtime.sendMessage({name: "getKeywords"});
  }

  const setSubtitles = function(subtitles) {
    if(subtitles){
      subtitleBox.innerHTML = "";
      console.log("set subtitle");
      for (var i = 0; i < subtitles.length; i++) {
        subtitleBox.innerHTML += subtitles[i].subtitles + "<br><br>";
      }
      subtitleBox.scrollTop = subtitleBox.scrollHeight;
    }
  }

  const showTranscript = function() {
    chrome.extension.sendMessage({name: 'getTranscript'});
  }

  chrome.extension.sendMessage({name: 'getSubtitles'}, function(response) {
    setSubtitles(response.subtitles);
  })

  chrome.runtime.onMessage.addListener((request, sender) => {
    if(request.name === 'printTranslated') {
      loading.style.display = 'none';
      subtitleBox.style.display = 'block';
      subtitleBox.innerHTML = request.text;
    } else if(request.name === 'subtitle') {
      setSubtitles(request.text);
    } else if(request.name === 'printKeywords') {
      studyButton.style.display = 'none';
      backButton.style.display = 'block';
      loading.style.display = 'none';
      subtitleBox.style.display = 'block';
      let cnt = 0;
      subtitleBox.innerHTML = "Keywords<br><br>";
      console.log("show keywords");
      for (var i = 0; i < request.keywordList.length; i++) {
        if(request.keywordList[i].word != "") {
          cnt += 1;
          subtitleBox.innerHTML += cnt + ". " + request.keywordList[i].word + "<br><br>";
        }
      }
    }
  });  
});