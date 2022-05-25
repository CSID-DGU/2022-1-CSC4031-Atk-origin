document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('back');
  const subtitleBox = document.getElementById('subtitleBox');
  const logo = document.getElementById("logo");
  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('lectureId');
  const word = urlParams.get('word');

  backButton.onclick = () => {window.location.href="keyword.html?lectureId=" + id};
  console.log(word);

  subtitleBox.innerHTML=word+"<br><br>  정의: the action or process of flying<br><br>유의어: air journey, gliding, trajectory<br><br>예문: A return flight from Berlin to Seoul- The golfer’s swing is obviously critical to the ball’s flight.";
  
});