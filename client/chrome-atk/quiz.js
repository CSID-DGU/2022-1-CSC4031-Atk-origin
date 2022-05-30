let item;

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
    const num = urlParams.get('num');
    const idx = parseInt(num);

    const processAnswer = function() {
        chrome.storage.sync.get('quiz', function (result) {
            let arrQuiz = result.quiz;
            
            for(var i = 0; i<result.quiz.length; i++){
                console.log((i+1).toString() + ". answer: " + result.quiz[i].answer + " type: " + result.quiz[i].type + " correct?: " + result.quiz[i].isCorrect.toString() + " choices : " + result.quiz[i].multipleChoice);
            }
            if(arrQuiz[idx].type === "multiple") {
                arrQuiz[idx].answer = document.getElementById('rates').value; 
                if(arrQuiz[idx].answer === item.antonym) {
                    arrQuiz[idx].isCorrect = true;
                }
            } else if(arrQuiz[idx].type === "blank") {
                if(inputBox.value === item.word) {
                    arrQuiz[idx].isCorrect = true;
                }
                arrQuiz[idx].answer = inputBox.value;
            } else {
                if(inputBox.value === item.word) {
                    arrQuiz[idx].isCorrect = true;
                }
                arrQuiz[idx].answer = inputBox.value;
            }
            chrome.storage.sync.set({quiz: arrQuiz}, function () { });
        });
    }

    const showQuestion = function(nextIdx) {
        processAnswer();
        window.location.href="quiz.html?num=" + nextIdx.toString();
    }

    const showResult = function() {
        chrome.storage.sync.get('words', function (data) {
            chrome.storage.sync.get('quiz', function (result) {
                let correctCnt = 0;
                for(var i=0; i<result.quiz.length; i++) {
                    if(result.quiz[i].isCorrect) {
                        correctCnt += 1;
                    }
                }
                window.location.href="result.html?total=" + data.words.length.toString() + "&correct=" + correctCnt;
            });
        });
    }

    loading.style.display = 'none';

    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    nextButton.onclick = () => {showQuestion(idx + 1)};
    backButton.onclick = () => {showQuestion(idx - 1)};
    submitButton.onclick = () => {showResult()};
    question.innerHTML="Q"+(idx+1).toString()+": ";

    chrome.storage.sync.get('words', function (data) {
        item = data.words[idx];
        const cnt = data.words.length * 0.3;

        if(idx === 0) {
            nextButton.style.display = 'block';
            submitButton.style.display = "none";
            backButton.style.display = "none";
        } else if(idx < data.words.length-1) {
            nextButton.style.display = 'block';
            submitButton.style.display = "none";
            backButton.style.display = "block";
        } else {
            nextButton.style.display = "none";
            submitButton.style.display = "block";
            backButton.style.display = "block";
        }

        let synonymArr = [];
        if(item.synonym) {
            synonymArr = item.synonym.split('|');
        }
        
        chrome.storage.sync.get('quiz', function (result) {
            let multipleCnt = 0;
            let blankCnt = 0;

            for(var i=0; i<result.quiz.length; i++) {
                if(result.quiz[i].type === "multiple") {
                    multipleCnt += 1;
                } else if(result.quiz[i].type === "blank") {
                    blankCnt += 1;
                }
            }

            if(result.quiz[idx].answer === "") {
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
            } else {
                if(result.quiz[idx].type === "multiple") {
                    const shuffledArray = result.quiz[idx].multipleChoice;

                    vocabForm.style.display="none";
                    multipleForm.style.display="block";
                    blankForm.style.display="none";
    
                    for(var i=0; i<inputArr.length; i++){
                        labelArr[i].innerHTML += shuffledArray[i];
                        inputArr[i].value = shuffledArray[i];
                        if(shuffledArray[i] === item.antonym) {
                            inputArr[i].checked = true;
                        }
                    }
                    question.innerHTML += item.word + "의 유의어가 아닌 것은?";
                } else if(result.quiz[idx].type === "blank") {
                    vocabForm.style.display="flex";
                    multipleForm.style.display="none";
                    blankForm.style.display="block";

                    blankForm.innerHTML = item.example.replace(item.word, "______");;
                    question.innerHTML+="빈칸에 들어갈 말은?";
                    inputBox.value = result.quiz[idx].answer;
                } else {
                    vocabForm.style.display="flex";
                    multipleForm.style.display="none";
                    blankForm.style.display="block";

                    question.innerHTML+="다음 정의에 맞는 단어는?";
                    blankForm.innerHTML = item.definition;
                    inputBox.value = result.quiz[idx].answer;
                }
            }
        });
    });
});