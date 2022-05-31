//initial display for popup menu when opened
document.addEventListener('DOMContentLoaded', function() {
  const heading = document.getElementById('heading');
  const startButton = document.getElementById('start');
  const logOutButton= document.getElementById('logout');
  const logo = document.getElementById("logo");
  const total = document.getElementById('total');
  const inProgress = document.getElementById('inProgress');
  const completed = document.getElementById("completed");
  const totalPanel = document.getElementById('totalPanel');
  const inProgressPanel = document.getElementById('inProgressPanel');
  const completedPanel = document.getElementById("completedPanel");
  const progressBar = document.getElementById("progressBar");
  const dashboard = document.getElementById("dashboard");
  const progressContainer = document.getElementById("progressContainer");

  const loading = document.getElementById("loading");

  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  totalPanel.onclick= () => {window.location.href="lecture.html?filter=total"};
  inProgressPanel.onclick= () => {window.location.href="lecture.html?filter=inProgress"};
  completedPanel.onclick= () => {window.location.href="lecture.html?filter=completed"};
  
  const showList = function() {
    loading.style.display = 'block';
    dashboard.style.display = 'none';
    progressContainer.style.display = 'none';
    startButton.style.display = 'none';
    logOutButton.style.display = 'none';
    chrome.runtime.sendMessage({name: "getList"});
  }

  showList();

  const startProcess = function() {  
    chrome.runtime.sendMessage("startCapture");
    window.location.href="stt.html";
  }

  const setPercentage = function() {
    var perc = completed.innerText / total.innerText;
    progressBar.setAttribute("style","width:" + perc * 100 + "%");
  }

  startButton.onclick = () => {startProcess();};
  logOutButton.onclick = () => {logOut()};

  chrome.extension.sendMessage({name: 'getLoginCookie'}, function(response) {
    heading.textContent="Hello " + response.username + "!";
  })
  displayStatus();
  setPercentage();

  chrome.runtime.onMessage.addListener((request, sender) => {
    if(request.name === 'printLectureList') {
      loading.style.display = 'none';
      dashboard.style.display = 'flex';
      progressContainer.style.display = 'block';
      startButton.style.display = 'block';
      logOutButton.style.display = 'block';
      var lectures = request.lectureList.lectures;
      total.innerHTML = lectures.length;
      for(var i=0; i<lectures.length; i++) {
        if(lectures[i].score > 0) {
          var cnt = parseInt(completed.innerText);
          completed.innerText = (cnt += 1).toString();
        } else {
          var cnt = parseInt(inProgress.innerText);
          inProgress.innerText = (cnt += 1).toString();
        }
      }
      
      setPercentage();
    } 
  });
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