document.addEventListener('DOMContentLoaded', function() {
  const tbodyRef = document.getElementById('keywordTable').getElementsByTagName('tbody')[0];
  const backButton = document.getElementById('back');
  const loading = document.getElementById('loading');
  const heading = document.getElementById('heading');
  const container = document.getElementById('container');
  const logo = document.getElementById("logo");
  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  heading.style.display = 'block';
  const urlParams = new URLSearchParams(window.location.search);
  const page_type = urlParams.get('filter')

  container.style.display = 'block';
  backButton.style.display = 'block';
  loading.style.display = 'none';
  backButton.onclick = () => {window.location.href="popup.html"};

  const showTranscript = function(idx) {
    chrome.storage.sync.get('lectures', function (result) {
      var sId = result.lectures[idx].id;
      chrome.storage.sync.set({lectureId: sId});
      window.location.href="transcript.html?lectureId="+sId;
    });
  }

  const addRow = function(lecture, idx) {
    var newRow = tbodyRef.insertRow();
    
    var dateCell = newRow.insertCell();
    var date = document.createTextNode(new Date(lecture.studyDate).toLocaleDateString());
    dateCell.appendChild(date);

    var titleCell = newRow.insertCell();
    var titleText = document.createTextNode(lecture.title);
    titleCell.appendChild(titleText);
    
    var scoreCell = newRow.insertCell();
    var scoreText = document.createTextNode(lecture.score);
    scoreCell.appendChild(scoreText);

    newRow.onclick = function(evt) {
      showTranscript(idx);
    };
  }

  const printList = function() {
    chrome.storage.sync.get('lectures', function (result) {
      if(page_type==="total") {
        heading.innerHTML = "Lectures Saved";
        for (var i = 0; i < result.lectures.length; i++) {
          addRow(result.lectures[i], i);
        }
      } else if(page_type==="inProgress") {
        heading.innerHTML = "Lectures To Study";
        for (var i = 0; i < result.lectures.length; i++) {
          if(result.lectures[i].score <= 0) {
            addRow(result.lectures[i], i);
          }
        }
      } else {
        heading.innerHTML = "Lectures Studied";
        for (var i = 0; i < result.lectures.length; i++) {
          if(result.lectures[i].score > 0) {
            addRow(result.lectures[i], i);
          }
        }
      }
    });
  }
  
  printList();
});