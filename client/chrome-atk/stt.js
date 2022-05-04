document.addEventListener('DOMContentLoaded', function() {
    const finishButton = document.getElementById('finish');
    finishButton.onclick = () => {stopProcess()};
    
    const stopProcess = function() {  
      chrome.runtime.sendMessage("cancelCapture");
      window.location.href="popup.html";
    }
  });
  