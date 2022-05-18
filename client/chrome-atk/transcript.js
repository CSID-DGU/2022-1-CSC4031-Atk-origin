document.addEventListener('DOMContentLoaded', function() {
    const transcript = document.getElementById('transcript');
    const translated = document.getElementById('translated');
    const studyButton = document.getElementById('study');
    const backButton = document.getElementById('back');
    const transcriptHeading = document.getElementById('transcriptHeading');
    const translatedHeading = document.getElementById('translatedHeading');
    const loading = document.getElementById('loading');
    studyButton.style.display = 'none';
    backButton.style.display = 'none';
    studyButton.onclick = () => {showKeywords()};
    backButton.onclick = () => {window.location.href="popup.html"};
    transcript.innerHTML = "";
    translated.innerHTML = "";
    transcriptHeading.style.display = 'none';
    translatedHeading.style.display = 'none';
    transcript.style.display = 'none';
    translated.style.display = 'none';
    loading.style.display = 'block';
    chrome.extension.sendMessage({name: 'getTranscript'});
  
    const showKeywords = function() {
      loading.style.display = 'block';
      transcript.style.display = 'none';
      translated.style.display = 'none';
      chrome.runtime.sendMessage({name: "getKeywords"});
    }

    chrome.runtime.onMessage.addListener((request, sender) => {
      if(request.name === 'printTranslated') {
        loading.style.display = 'none';
        transcript.style.display = 'block';
        translated.style.display = 'block';
        transcriptHeading.style.display = 'block';
        translatedHeading.style.display = 'block';
        transcript.innerHTML = request.transcript;
        translated.innerHTML = request.translated;
        studyButton.style.display = 'block';
      } else if(request.name === 'printKeywords') {
        studyButton.style.display = 'none';
        backButton.style.display = 'block';
        loading.style.display = 'none';
        transcript.style.display = 'block';
        let cnt = 0;
        transcript.innerHTML = "Keywords<br><br>";
        console.log("show keywords");
        for (var i = 0; i < request.keywordList.length; i++) {
          if(request.keywordList[i].word != "") {
            cnt += 1;
            transcript.innerHTML += cnt + ". " + request.keywordList[i].word + "<br><br>";
          }
        }
      }
    });  
  });