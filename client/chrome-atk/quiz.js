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
    
    blankForm.innerHTML = "";
    
    const processAnswer = function() {
        chrome.storage.sync.get('quiz', function (result) {
            let arrQuiz = result.quiz;

            if(arrQuiz[idx].type === "multiple") {
                for(var i = 0; i<inputArr.length; i++) {
                    if(inputArr[i].checked) {
                        arrQuiz[idx].answer = inputArr[i].value;
                        break;
                    }
                }
            } else {
                arrQuiz[idx].answer = inputBox.value;
            }
            
            if(arrQuiz[idx].answer === arrQuiz[idx].correctAns) {
                arrQuiz[idx].isCorrect = true;
            } else {
                if(arrQuiz[idx].type === "blank") {
                    exampleArr = item.example.split('|');
                    if(exampleArr.length > 1) {
                        let seq = 0;
                        var exampleOriginal = exampleArr[1];
                        var exampleLemma = exampleArr[0];
                        
                        if (exampleOriginal[exampleOriginal.length-1] === ".")
                            exampleOriginal = exampleOriginal.slice(0,-1);
                        if (exampleLemma[exampleLemma.length-1] === ".")
                            exampleLemma = exampleLemma.slice(0,-1);
                        
                        let str = exampleOriginal.split(' ');
                        let lemma = exampleLemma.split(' ');
                        for(var i=0; i<str.length; i++) {
                            if(str[i] === item.word){
                                seq = i;
                            }
                        }
                        if(arrQuiz[idx].answer === lemma[seq]) {
                            arrQuiz[idx].isCorrect = true;
                        } else{
                            arrQuiz[idx].isCorrect = false;
                        }
                    } 
                } else {
                    arrQuiz[idx].isCorrect = false;
                }
            }
            chrome.storage.sync.set({quiz: arrQuiz}, function () { 
                console.log("[LOG] saved answer");
            });
        });
    }

    const showQuestion = function(nextIdx) {
        processAnswer();
        window.location.href="quiz.html?num=" + nextIdx.toString();
    }

    const updateScore = function() {
        processAnswer();
        chrome.storage.sync.get('quiz', function (result) {
            let correctCnt = 0;
            for(var i=0; i<result.quiz.length; i++) {
                if(result.quiz[i].isCorrect) {
                    correctCnt += 1;
                }
            }
            var percentage = correctCnt / result.quiz.length; 
            percentage = Math.round(percentage * 100) / 100;
            chrome.storage.sync.get('lectureId', function (data) {
                chrome.extension.sendMessage({name: 'updateScore', lectureId: data.lectureId, score: percentage * 100});
            });
        });
    }

    const showMultipleChoice = function(word, choices) {
        vocabForm.style.display="none";
        multipleForm.style.display="block";
        blankForm.style.display="none";
        for(var i=0; i<inputArr.length; i++) {
            labelArr[i].innerHTML += choices[i];
            inputArr[i].value = choices[i];
        }
        question.innerHTML += word + "의 유의어가 아닌 것은?";
    }

    const showFillBlank = function(word, example) {
        vocabForm.style.display="flex";
        multipleForm.style.display="none";
        blankForm.style.display="block";
        exampleArr = example.split('|');
        if(exampleArr.length > 1) {
            blankForm.innerHTML = exampleArr[1].replace(word, "______");
        }
        question.innerHTML += "빈칸에 들어갈 말은?";
    }

    const showVocab = function(definition) {
        vocabForm.style.display="flex";
        multipleForm.style.display="none";
        blankForm.style.display="block";
        question.innerHTML += "다음 정의에 맞는 단어는?";
        blankForm.innerHTML = definition;
    }

    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    nextButton.onclick = () => {showQuestion(idx + 1)};
    backButton.onclick = () => {showQuestion(idx - 1)};
    submitButton.onclick = () => {updateScore()};
    question.innerHTML="Q"+(idx+1).toString()+": ";
    loading.style.display = 'none';

    chrome.storage.sync.get('words', function (data) {
        item = data.words[idx];
        const cnt = data.words.length * 0.3;
        inputBox.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
              if(idx < data.words.length-1) {
                nextButton.click();
              } else {
                submitButton.click();
              }
            }
          });

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

            if(result.quiz[idx].type === "") {
                if(synonymArr.length >= 3 && item.antonym && multipleCnt < cnt) {
                    let choices = synonymArr.sort(() => Math.random() - 0.5).slice(0, 3);
                    choices.push(item.antonym);
                    const shuffledArr = choices.sort(() => Math.random() - 0.5);
                    showMultipleChoice(item.word, shuffledArr);
                    let tempArr = result.quiz;
                    tempArr[idx].type = "multiple";
                    tempArr[idx].correctAns = item.antonym;
                    tempArr[idx].multipleChoice = shuffledArr;
                    chrome.storage.sync.set({quiz: tempArr});
                } else if(item.example && blankCnt < cnt) {
                    showFillBlank(item.word, item.example);
                    let tempArr = result.quiz;
                    tempArr[idx].correctAns = item.word;
                    tempArr[idx].type = "blank";
                    chrome.storage.sync.set({quiz: tempArr});
                } else {
                    showVocab(item.definition);
                    let tempArr = result.quiz;
                    tempArr[idx].correctAns = item.word;
                    tempArr[idx].type = "vocab";
                    chrome.storage.sync.set({quiz: tempArr});
                }
            } else {
                if(result.quiz[idx].type === "multiple") {
                    const shuffledArr = result.quiz[idx].multipleChoice;
                    showMultipleChoice(item.word, shuffledArr);
                    for(var i=0; i<inputArr.length; i++){
                        if(shuffledArr[i] === result.quiz[idx].answer) {
                            inputArr[i].checked = true;
                        }
                    }
                } else if(result.quiz[idx].type === "blank") {
                    showFillBlank(item.word, item.example);
                    inputBox.value = result.quiz[idx].answer;
                } else {
                    showVocab(item.definition);
                    inputBox.value = result.quiz[idx].answer;
                }
            }
        });
    });

    chrome.runtime.onMessage.addListener((request, sender) => {
        if(request === 'scoreUpdated') {
            chrome.storage.sync.get('quiz', function (result) {
                let correctCnt = 0;
                for(var i=0; i<result.quiz.length; i++) {
                    if(result.quiz[i].isCorrect) {
                        correctCnt += 1;
                    }
                }
                window.location.href="result.html?total=" + result.quiz.length.toString() + "&correct=" + correctCnt;
            });
        } 
      });  
});