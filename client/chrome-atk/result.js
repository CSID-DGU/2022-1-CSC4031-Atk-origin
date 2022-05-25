document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('back');
  const logo = document.getElementById("logo");
  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  backButton.onclick = () => {window.location.href="popup.html"};
});