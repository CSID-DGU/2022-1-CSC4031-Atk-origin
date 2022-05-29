document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.getElementById('next');
    const backButton = document.getElementById('back');
    const submitButton = document.getElementById('submit');
    const loading = document.getElementById('loading');
    const inputBox = document.getElementById("inputBox");
    const question = document.getElementById("question");
    const logo = document.getElementById("logo");
    const vocabForm = document.getElementById("vocabForm");
    const multipleForm = document.getElementById("multipleForm");
    const blankForm = document.getElementById("blankForm");
    const inputArr = document.getElementsByName("radio");
    const labelArr = document.getElementsByTagName("label");

    const urlParams = new URLSearchParams(window.location.search);
    const word = urlParams.get('word')
    const num = urlParams.get('num');
    const idx = parseInt(num);

    const processAnswer = function() {
        arrQuiz = [];
        chrome.storage.sync.get('quiz', function (result) {
            arrQuiz = result.quiz;
            arrQuiz[idx].type = quiztype;
            if(arrQuiz[idx].type === "multiple") {
                
            } else if(arrQuiz[idx].type === "blank") {
                if(inputBox.value === word){
                    arrQuiz[idx].isCorrect = true;
                    arrQuiz[idx].answer =inputBox.value;
                    console.log(arrQuiz[idx].answer);
                }
            } else {
                if(inputBox.value === word){
                    arrQuiz[idx].isCorrect = true;
                    arrQuiz[idx].answer =inputBox.value;
                    console.log(arrQuiz[idx].answer);
                }
            }
            chrome.storage.sync.set({quiz, arrQuiz});
        });
    }

    const lastQuestion = function() {
        var lastIdx = idx - 1;
        window.location.href="quiz.html?num=" + lastIdx.toString();
    }

    const nextQuestion = function() {
        processAnswer();
        var nextIdx = idx + 1;
        window.location.href="quiz.html?num=" + nextIdx.toString();
    }
    loading.style.display = 'none';

    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    nextButton.onclick = () => {nextQuestion()};
    backButton.onclick = () => {lastQuestion()};
    submitButton.onclick = () => {window.location.href="result.html"};
    question.innerHTML="Q"+(idx+1).toString()+": ";

    chrome.storage.sync.get('words', function (result) {
        let item = result.words[idx];
        console.log(item.word);
        const cnt = result.words.length * 0.3;

        if(idx < result.words.length-1) {
            nextButton.style.display = 'block';
            submitButton.style.display = "none";
        } else {
            nextButton.style.display = "none";
            submitButton.style.display = "block";
        }

        let synonymArr = item.synonym.split('|');

        let multipleCnt = 0;
        let blankCnt = 0;
        let vocabCnt = 0;

        chrome.storage.sync.get('quiz', function (result) {
            
            for(var i=0; i<result.quiz.length; i++) {
                if(result.quiz[i].type === "multiple") {
                    multipleCnt += 1;
                } else if(result.quiz[i].type === "blank") {
                    blankCnt += 1;
                } else {
                    vocabCnt += 1;
                }
            }
            if(synonymArr.length >= 3 && item.antonym && multipleCnt < cnt) {
                let multipleChoice = synonymArr.sort(() => Math.random() - 0.5).slice(0, 3);
                multipleChoice.push(item.antonym);
                const shuffledArray = multipleChoice.sort(() => Math.random() - 0.5);

                vocabForm.style.display="none";
                multipleForm.style.display="block";
                blankForm.style.display="none";

                for(var i=0; i<inputArr.length; i++){
                    labelArr[i].innerHTML += shuffledArray[i];
                    inputArr[i].value = shuffledArray[i];
                }
                question.innerHTML += item.word + "의 유의어가 아닌 것은?";

                let tempArr = result.quiz;
                tempArr[idx].type = "multiple";
                tempArr[idx].multipleChoice = shuffledArray;
                chrome.storage.sync.set({quiz: tempArr});
            } else if(item.example && blankCnt < cnt) {
                vocabForm.style.display="flex";
                multipleForm.style.display="none";
                blankForm.style.display="block";
                blankForm.innerHTML = item.example.replace(item.word, "______");;
                question.innerHTML+="빈칸에 들어갈 말은?";

                let tempArr = result.quiz;
                tempArr[idx].type = "blank";
                chrome.storage.sync.set({quiz: tempArr});
            } else {
                vocabForm.style.display="flex";
                multipleForm.style.display="none";
                blankForm.style.display="block";
                question.innerHTML+="다음 정의에 맞는 단어는?";
                blankForm.innerHTML = item.definition;

                let tempArr = result.quiz;
                tempArr[idx].type = "vocab";
                chrome.storage.sync.set({quiz: tempArr});
            }
        });
    });



    chrome.runtime.onMessage.addListener((request, sender) => {
       
    });  
  });