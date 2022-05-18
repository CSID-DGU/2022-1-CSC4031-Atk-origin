//initial display for popup menu when opened
document.addEventListener('DOMContentLoaded', function() {
  const heading = document.getElementById('heading');
  const startButton = document.getElementById('start');
  const logOutButton= document.getElementById('logout');
  const gitLink = document.getElementById("gitLink");
  const startProcess = function() {  
    chrome.runtime.sendMessage("startCapture");
    window.location.href="stt.html";
  }
  startButton.onclick = () => {startProcess();};
  logOutButton.onclick = () => {logOut()};
  gitLink.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  chrome.extension.sendMessage({name: 'getLoginCookie'}, function(response) {
    heading.textContent="Hello " + response.username + "!";
  })
  displayStatus();
});

const displayStatus = function() { //function to handle the display of time and buttons
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const startButton = document.getElementById('start');
    const logOutButton = document.getElementById('logout');
    chrome.runtime.sendMessage({currentTab: tabs[0].id}, (response) => {
      if(response) {
        chrome.storage.sync.get({
          maxTime: 10000,
          limitRemoved: false
        }, (options) => {
          if(options.maxTime > 10000) {
            chrome.storage.sync.set({
              maxTime: 10000
            });
          }
        });
        logOutButton.style.display = "block";
      } else {
        startButton.style.display = "block";
        logOutButton.style.display = "block";
      }
    });
  });
}

const logOut = function() {  
  chrome.runtime.sendMessage({type:"logOut"});
  window.location.href="login.html";
}

//manipulation of the displayed buttons upon message from background
chrome.runtime.onMessage.addListener((request, sender) => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const startButton = document.getElementById('start');
    const logOutButton = document.getElementById('logout');
    if(request.captureStarted && request.captureStarted === tabs[0].id) {
      chrome.storage.sync.get({
        maxTime: 10000,
        limitRemoved: false
      }, (options) => {
        if(options.maxTime > 10000) {
          chrome.storage.sync.set({
            maxTime: 10000
          });
        }
      });
    } else if(request.captureStopped && request.captureStopped === tabs[0].id) {
      startButton.style.display = "block";
      logOutButton.style.display = "block";
    } 
  });
});