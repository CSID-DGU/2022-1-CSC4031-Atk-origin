document.addEventListener('DOMContentLoaded', function() {
    const transcriptContent = document.getElementById('transcriptContent');
    const translatedContent = document.getElementById('translatedContent');
    const studyButton = document.getElementById('study');
    const backButton = document.getElementById('back');
    const transcriptHeading = document.getElementById('transcriptHeading');
    const translatedHeading = document.getElementById('translatedHeading');
    const loading = document.getElementById('loading');
    const logo = document.getElementById("logo");
    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    
    studyButton.style.display = 'block';
    studyButton.onclick = () => {window.location.href="keyword.html"};
    backButton.onclick = () => {window.location.href="popup.html"};
    transcriptContent.innerHTML = "";
    translatedContent.innerHTML = "";
    transcriptHeading.style.display = 'block';
    translatedHeading.style.display = 'block';
    transcriptContent.style.display = 'block';
    translatedContent.style.display = 'block';
    loading.style.display = 'none';

    // transcriptHeading.style.display = 'none';
    // translatedHeading.style.display = 'none';
    // transcriptContent.style.display = 'none';
    // translatedContent.style.display = 'none';
    // loading.style.display = 'block';
    
    //chrome.extension.sendMessage({name: 'getTranscript'});

    chrome.runtime.onMessage.addListener((request, sender) => {
      if(request.name === 'printTranslated') {
        loading.style.display = 'none';
        transcriptContent.style.display = 'block';
        translatedContent.style.display = 'block';
        transcriptHeading.style.display = 'block';
        translatedHeading.style.display = 'block';
        transcriptContent.innerHTML = request.transcript;
        translatedContent.innerHTML = request.translated;
        studyButton.style.display = 'block';
      } 
    });  
  });