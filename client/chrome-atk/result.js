document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('back');
  const logo = document.getElementById("logo");
  const resultMsg = document.getElementById("resultMsg");

  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  backButton.onclick = () => {window.location.href="popup.html"};

  const urlParams = new URLSearchParams(window.location.search);
  const total = urlParams.get('total');
  const correct = urlParams.get('correct');

  resultMsg.innerHTML = correct + " out of " + total + " correct";
});