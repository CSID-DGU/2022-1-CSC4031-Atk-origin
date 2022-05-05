document.addEventListener('DOMContentLoaded', function() {
  const finishButton = document.getElementById('finish');
  const subtitleBox = document.getElementById('subtitleBox');
  finishButton.onclick = () => {stopProcess()};
  subtitleBox.innerHTML = "";
  const stopProcess = function() {  
    chrome.runtime.sendMessage("cancelCapture");
    window.location.href="popup.html";
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

  chrome.extension.sendMessage({name: 'getSubtitles'}, function(response) {
    setSubtitles(response.subtitles);
  })

  chrome.runtime.onMessage.addListener((request, sender) => {
    setSubtitles(request.text); 
  });  
});

