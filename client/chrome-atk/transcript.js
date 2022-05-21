document.addEventListener('DOMContentLoaded', function() {
    const transcriptContent = document.getElementById('transcriptContent');
    const translatedContent = document.getElementById('translatedContent');
    const container = document.getElementById('container');
    const studyButton = document.getElementById('study');
    const backButton = document.getElementById('back');
    const loading = document.getElementById('loading');
    const logo = document.getElementById("logo");
    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    
    studyButton.style.display = 'block';
    studyButton.onclick = () => {window.location.href="keyword.html"};
    backButton.onclick = () => {window.location.href="popup.html"};
    transcriptContent.innerHTML = "";
    translatedContent.innerHTML = "";

    container.style.display = 'flex';
    transcriptContent.style.display = 'block';
    translatedContent.style.display = 'block';
    loading.style.display = 'none';

    // container.style.display = 'none';
    // transcriptContent.style.display = 'none';
    // translatedContent.style.display = 'none';
    // loading.style.display = 'block';
    
    //chrome.extension.sendMessage({name: 'getTranscript'});

    const showDemo = function() {
      for(var i=0; i<100; i++) {
        transcriptContent.innerHTML += "This is an example. Please do not read into it too much. It's 7 pm right now and I'm tired.<br><br>";
        translatedContent.innerHTML += "이것은 사례일 뿐입니다. 너무 신경 쓰지 마시길 바랍니다. 지금 오후 7시인데 벌써 피곤하네요."
      }
    } 

    showDemo();

    chrome.runtime.onMessage.addListener((request, sender) => {
      if(request.name === 'printTranslated') {
        loading.style.display = 'none';
        transcriptContent.style.display = 'block';
        translatedContent.style.display = 'block';
        container.style.display = 'flex';
        transcriptContent.innerHTML = request.transcript;
        translatedContent.innerHTML = request.translated;
        studyButton.style.display = 'block';
      } 
    });  
  });