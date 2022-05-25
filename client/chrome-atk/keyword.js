document.addEventListener('DOMContentLoaded', function() {
    const tbodyRef = document.getElementById('keywordTable').getElementsByTagName('tbody')[0];
    const nextButton = document.getElementById('next');
    const loading = document.getElementById('loading');
    const heading = document.getElementById('heading');
    const container = document.getElementById('container');
    const logo = document.getElementById("logo");
    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    
    // heading.style.display = 'block';
    // container.style.display = 'block';
    // nextButton.style.display = 'block';
    // loading.style.display = 'none';
    nextButton.onclick = () => {window.location.href="quiz.html?quizType=vocab&num=1"};
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('lectureId')
    
    chrome.runtime.sendMessage({name: "getKeywords", lectureId: id});

    heading.style.display = 'none';
    container.style.display = 'none';
    nextButton.style.display = 'none';
    loading.style.display = 'block';
    
    chrome.runtime.onMessage.addListener((request, sender) => {
      if(request.name === 'printKeywords') {
        heading.style.display = 'block';
        container.style.display = 'block';
        nextButton.style.display = 'block';
        loading.style.display = 'none';
        let cnt = 0;
        console.log("show keywords");
        for (var i = 0; i < request.keywordList.length; i++) {
          if(request.keywordList[i].word.trim()) {
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

            newRow.onclick = function(evt) {
              var cells = this.getElementsByTagName('td');
              window.location.href="dictionary.html?lectureId="+id+"&word="+ cells[1].innerHTML;
            };
          }
        }
      }
    });  
  });