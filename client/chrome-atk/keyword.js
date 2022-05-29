document.addEventListener('DOMContentLoaded', function() {
    const tbodyRef = document.getElementById('keywordTable').getElementsByTagName('tbody')[0];
    const nextButton = document.getElementById('next');
    const backButton = document.getElementById('back');
    const loading = document.getElementById('loading');
    const heading = document.getElementById('heading');
    const container = document.getElementById('container');
    const logo = document.getElementById("logo");
    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    
    // heading.style.display = 'block';
    // container.style.display = 'block';
    // nextButton.style.display = 'block';
    // loading.style.display = 'none';

    const startQuiz = function() {
      quizArr = [];
      chrome.storage.sync.get('words', function (result) {
        for(var i=0; i< result.words.length; i++) {
          quizArr.push({type: "", answer: "", isCorrect: false, multipleChoice: []});
        }
        chrome.storage.sync.set({quiz: quizArr});
      });
      window.location.href="quiz.html?num=0";
    }

    nextButton.onclick = () =>{startQuiz()};
    backButton.onclick = () =>{window.location.href="popup.html"};
    
    const showKeywords = function(arr) {
      let cnt = 0;
      for (var i = 0; i < arr.length; i++) {
        if(arr[i].word.trim()) {
          cnt += 1;
          var newRow = tbodyRef.insertRow();

          var newCell = newRow.insertCell();
          var numText = document.createTextNode(cnt);
          newCell.appendChild(numText);

          var wordCell = newRow.insertCell();
          var wordText = document.createTextNode(arr[i].word);
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
    };

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('lectureId')
    const reload = urlParams.get('reload')

    if(reload) {
      chrome.runtime.sendMessage({name: "getKeywords", lectureId: id});
      heading.style.display = 'none';
      container.style.display = 'none';
      nextButton.style.display = 'none';
      loading.style.display = 'block';
    } else {
      heading.style.display = 'block';
      container.style.display = 'block';
      nextButton.style.display = 'block';
      loading.style.display = 'none';
      chrome.storage.sync.get('words', function (result) {
        showKeywords(result.words);
      });
    }
    
    chrome.runtime.onMessage.addListener((request, sender) => {
      if(request.name === 'printKeywords') {
        chrome.runtime.sendMessage({name: "getQuiz", lectureId: id});
      } else if(request.name === 'printDictionary') {
        heading.style.display = 'block';
        container.style.display = 'block';
        nextButton.style.display = 'block';
        loading.style.display = 'none';
        showKeywords(request.keywordList);
      }
    });  
  });