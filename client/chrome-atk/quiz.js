document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.getElementById('next');
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
    const quizType = urlParams.get('quizType')
    const num = urlParams.get('num');
    const idx = parseInt(num);

    // test code(delete later)
    const quizArr = ["vocab","vocab","vocab", "vocab", "multiple", "multiple", "multiple", "blank","blank","blank"];
    const multipleArr = ["trajectory", "glide","departure","air journey"];

    if(idx >= quizArr.length) {
        nextButton.style.display = "none";
        submitButton.style.display = "block";
    } else {
        nextButton.style.display = 'block';
        submitButton.style.display = "none";
    }

    const nextQuestion = function() {
        var nextIdx = idx + 1;
        window.location.href="quiz.html?quizType=" + quizArr[idx] + "&num="+ nextIdx.toString();
    }
    loading.style.display = 'none';

    logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
    nextButton.onclick = () => {nextQuestion()};
    submitButton.onclick = () => {window.location.href="popup.html"};

    if(quizType==="vocab") {
        vocabForm.style.display="flex";
        multipleForm.style.display="none";
        blankForm.style.display="none";
        question.innerHTML="Q"+num+": 비행을 뜻하는 영어 단어는?";
    } else if(quizType==="multiple") {
        vocabForm.style.display="none";
        multipleForm.style.display="block";
        blankForm.style.display="none";
        for(var i=0; i<inputArr.length; i++){
            labelArr[i].innerHTML += multipleArr[i];
            inputArr[i].value = multipleArr[i];
        }
        question.innerHTML="Q"+num+": flight의 유의어가 아닌 것은?";
    } else if(quizType==="blank") {
        vocabForm.style.display="flex";
        multipleForm.style.display="none";
        blankForm.style.display="blank";
        question.innerHTML="Q"+num+": 빈칸에 들어갈 말은?";
    }

    chrome.runtime.onMessage.addListener((request, sender) => {
       
    });  
  });