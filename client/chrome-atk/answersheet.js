document.addEventListener('DOMContentLoaded', function() {
    const tbodyRef = document.getElementById('answerTable').getElementsByTagName('tbody')[0];
    const backButton = document.getElementById('back');
    const loading = document.getElementById("loading");
    const logo = document.getElementById("logo");

    loading.style.display = "none";
    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    backButton.onclick = () => {window.location.href="result.html?total=" + total + "&correct=" + correct;};

    const urlParams = new URLSearchParams(window.location.search);
    const total = urlParams.get('total');
    const correct = urlParams.get('correct');

    const printAnswers = function() {
        chrome.storage.sync.get('quiz', function (result) {
            for(var i=0; i<result.quiz.length; i++) {
                var newRow = tbodyRef.insertRow();

                var newCell = newRow.insertCell();
                var numText = document.createTextNode(i+1);
                newCell.appendChild(numText);

                var wordCell = newRow.insertCell();
                var wordText = document.createTextNode(result.quiz[i].correctAns);
                wordCell.appendChild(wordText);
                
                var meaningCell = newRow.insertCell();
                var meaningText = document.createTextNode(result.quiz[i].answer);
                meaningCell.appendChild(meaningText);

                newRow.onclick = function(evt) {
                    var cells = this.getElementsByTagName('td');
                    var num = parseInt(cells[0].innerHTML) - 1;
                    window.location.href="quiz.html?num=" + num.toString();
                };
            }
        });
    }

    printAnswers();
});