document.addEventListener('DOMContentLoaded', function() {
  const transcriptContent = document.getElementById('transcriptContent');
  const translatedContent = document.getElementById('translatedContent');
  const container = document.getElementById('container');
  const studyButton = document.getElementById('study');
  const backButton = document.getElementById('back');
  const deleteButton = document.getElementById('delete');
  const loading = document.getElementById('loading');
  const logo = document.getElementById("logo");
  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  studyButton.style.display = 'block';
  deleteButton.style.display = 'block';
  backButton.onclick = () => {window.location.href="popup.html"};

  transcriptContent.innerHTML = "";
  translatedContent.innerHTML = "";

  container.style.display = 'none';
  transcriptContent.style.display = 'none';
  translatedContent.style.display = 'none';
  loading.style.display = 'block';

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('lectureId')
  chrome.extension.sendMessage({name: 'getTranscript', lectureId: id});

  studyButton.onclick = () => {window.location.href="keyword.html?lectureId=" + id + "&reload=true"};
  deleteButton.onclick = () => {chrome.extension.sendMessage({name: 'deleteLecture', lectureId: id})};

  chrome.runtime.onMessage.addListener((request, sender) => {
    if(request.name === 'printTranslated') {
      loading.style.display = 'none';
      transcriptContent.style.display = 'block';
      translatedContent.style.display = 'block';
      container.style.display = 'flex';
      translatedContent.innerHTML = request.translated;
      studyButton.style.display = 'block';
    } else if(request.name === 'printTranscript') {
      loading.style.display = 'none';
      transcriptContent.style.display = 'block';
      translatedContent.style.display = 'block';
      container.style.display = 'flex';
      transcriptContent.innerHTML = request.transcript;
      studyButton.style.display = 'block';
    } else if(request === 'deleteSuccess') {
      window.location.href="popup.html";
    } 
  });  
});