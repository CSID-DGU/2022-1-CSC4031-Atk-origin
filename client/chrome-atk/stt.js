document.addEventListener('DOMContentLoaded', function() {
  const finishButton = document.getElementById('finish');
  const studyButton = document.getElementById('study');
  const subtitleBox = document.getElementById('subtitleBox');
  const loading = document.getElementById('loading');
  finishButton.onclick = () => {stopProcess()};
  studyButton.style.display = 'none';
  studyButton.onclick = () => {showKeywords()};
  subtitleBox.innerHTML = "";
  loading.style.display = 'none';
  const stopProcess = function() {  
    chrome.runtime.sendMessage("cancelCapture");
    //window.location.href="popup.html";
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
      loading.style.display = 'none';
      subtitleBox.style.display = 'block';
      subtitleBox.innerHTML = "Keywords<br><br>";
      console.log("show keywords");
      for (var i = 0; i < request.keywordList.length; i++) {
        if(request.keywordList[i].word != "") {
          subtitleBox.innerHTML += i + 1 + ". " + request.keywordList[i].word + "<br><br>";
        }
      }
    }
  });  
});

