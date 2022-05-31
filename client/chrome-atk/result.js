document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('back');
  const logo = document.getElementById("logo");
  const resultMsg = document.getElementById("resultMsg");
  const answerLink = document.getElementById("answerLink");

  const urlParams = new URLSearchParams(window.location.search);
  const total = urlParams.get('total');
  const correct = urlParams.get('correct');

  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  backButton.onclick = () => {window.location.href="popup.html"};
  answerLink.onclick = () => {window.location.href="answersheet.html?correct="+ correct + "&total=" + total};
  
  resultMsg.innerHTML = correct + " out of " + total + " correct";
});