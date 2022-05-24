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

  if(page_type==="total") {
    heading.innerHTML = "Lectures Saved";
  } else if(page_type==="inProgress") {
    heading.innerHTML = "Lectures To Study";
  } else {
    heading.innerHTML = "Lectures Studied";
  }

  container.style.display = 'block';
  backButton.style.display = 'block';
  loading.style.display = 'none';
  backButton.onclick = () => {window.location.href="popup.html"};

  const showTranscript = function(idx) {
    chrome.storage.sync.get('lectures', function (result) {
      var sId = result.lectures[idx-1].id;
      window.location.href="transcript.html?lectureId="+sId;
    });
  }

  const printList = function() {
    chrome.storage.sync.get('lectures', function (result) {
      for (var i = 0; i < result.lectures.length; i++) {
        var newRow = tbodyRef.insertRow();
        var newCell = newRow.insertCell();
        var date = document.createTextNode(new Date(result.lectures[i].studyDate).toLocaleDateString());
        newCell.appendChild(date);
  
        var wordCell = newRow.insertCell();
        var wordText = document.createTextNode(result.lectures[i].title);
        wordCell.appendChild(wordText);
        
        var meaningCell = newRow.insertCell();
        var meaningText = document.createTextNode(0);
        meaningCell.appendChild(meaningText);

        newRow.onclick = function(evt) {
          console.log(this.rowIndex);
          showTranscript(this.rowIndex);
        };
      }
    });
  }

  // heading.style.display = 'none';
  // container.style.display = 'none';
  // backButton.style.display = 'none';
  // loading.style.display = 'block';

  printList();

  chrome.runtime.onMessage.addListener((request, sender) => {
    if(request.name === 'printKeywords') {
      heading.style.display = 'block';
      container.style.display = 'block';
      backButton.style.display = 'block';
      loading.style.display = 'none';
      let cnt = 0;
      console.log("show keywords");
      for (var i = 0; i < request.keywordList.length; i++) {
        if(request.keywordList[i].word != "") {
          cnt += 1;
          var newRow = tbodyRef.insertRow();

          var newCell = newRow.insertCell();
          var numText = document.createTextNode(cnt);
          newCell.appendChild(numText);

          var wordCell = newRow.insertCell();
          var wordText = document.createTextNode(request.keywordList[i].word);
          wordCell.appendChild(wordText);
          
          var meaningCell = newRow.insertCell();
          var meaningText = document.createTextNode('없음');
          meaningCell.appendChild(meaningText);
        }
      }
    }
  });     
});