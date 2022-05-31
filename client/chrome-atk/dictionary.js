document.addEventListener('DOMContentLoaded', function() {
  const backButton = document.getElementById('back');
  const scrollBox = document.getElementById('scrollBox');
  const logo = document.getElementById("logo");
  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('lectureId');
  const word = urlParams.get('word');

  backButton.onclick = () => {window.location.href="keyword.html?lectureId=" + id + "reload=false"};

  chrome.storage.sync.get('words', function (result) {
    console.log(result.words.length);
    console.log(result.words);
    for(var i=0; i<result.words.length; i++) {
      if(result.words[i].word === word) {
        let wordElement = document.createElement("b")
        wordElement.textContent = word;
        scrollBox.appendChild(wordElement);

        let defElement = document.createElement("b")
        defElement.textContent = "\u2022 Definition";
        let defText = document.createElement("p")
        defText.style.fontWeight = "lighter";
        defText.style.marginLeft = "15px";
        defText.style.marginTop = "0px";
        defText.style.marginBottom = "0px";
        defText.textContent = result.words[i].definition;
        defElement.appendChild(defText);
        scrollBox.appendChild(defElement);

        if(result.words[i].synonym) {
          let synonymArr = result.words[i].synonym.split('|');
          let synElement = document.createElement("b")
          synElement.textContent = "\u2022 Synonyms";
          let synText = document.createElement("p")
          synText.style.fontWeight = "lighter";
          synText.style.marginLeft = "15px";
          synText.style.marginTop = "0px";
          synText.style.marginBottom = "0px";
          synElement.appendChild(synText);
          for(var j=0; j<synonymArr.length; j++) {
            if(j!=0){
              synText.textContent += ", ";
            }
            synText.textContent += synonymArr[j];
          }
          scrollBox.appendChild(synElement);
        } 

        if(result.words[i].antonym) {
          let antonymArr = result.words[i].antonym.split('|');
          let antElement = document.createElement("b")
          antElement.textContent = "\u2022 Antonyms";
          let antText = document.createElement("p")
          antText.style.fontWeight = "lighter";
          antText.style.marginLeft = "15px";
          antText.style.marginTop = "0px";
          antText.style.marginBottom = "0px";
          antElement.appendChild(antText);
          for(var j=0; j<antonymArr.length; j++) {
            if(j!=0){
              antText.textContent += ", ";
            }
            antText.textContent += antonymArr[j];
          }
          scrollBox.appendChild(antElement);
        } 

        if(result.words[i].example) {
          let exampleArr = result.words[i].example.split('|');
          let exElement = document.createElement("b")
          exElement.textContent = "\u2022 Example";
          let exText = document.createElement("p")
          exText.style.fontWeight = "lighter";
          exText.style.marginLeft = "15px";
          exText.style.marginTop = "0px";
          exText.style.marginBottom = "0px";
          exText.textContent = exampleArr[0];
          exElement.appendChild(exText);
          scrollBox.appendChild(exElement); 
        }
      }
    }
  });
});