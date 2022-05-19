document.addEventListener('DOMContentLoaded', function() {
    const tbodyRef = document.getElementById('keywordTable').getElementsByTagName('tbody')[0];
    const backButton = document.getElementById('back');
    const loading = document.getElementById('loading');
    const heading = document.getElementById('heading');
    const container = document.getElementById('container');
    const logo = document.getElementById("logo");
    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    
    heading.style.display = 'block';
    container.style.display = 'block';
    backButton.style.display = 'block';
    loading.style.display = 'none';
    backButton.onclick = () => {window.location.href="popup.html"};
    
    const showKeywords = function() {
      loading.style.display = 'block';
      chrome.runtime.sendMessage({name: "getKeywords"});
    }

    // heading.style.display = 'none';
    // container.style.display = 'none';
    // backButton.style.display = 'none';
    // loading.style.display = 'block';

    //showKeywords();

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