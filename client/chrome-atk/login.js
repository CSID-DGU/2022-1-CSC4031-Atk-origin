//initial display for popup menu when opened
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('login');
  const signupButton = document.getElementById('signupButton');
  const cancelButton = document.getElementById('cancelButton');
  const version = document.getElementById("version");
  const signUpLink = document.getElementById("signUpLink");
  const loginTitle = document.getElementById("title");
  const signUpTitle = document.getElementById("signUpTitle");
  const nameInput = document.getElementById("name");
  const pwInput = document.getElementById("pw");
  const msg = document.getElementById("msg");
  const loginFailMsg = document.getElementById("loginFailMsg");
  const emptyMsg = document.getElementById("emptyMsg");

  loginButton.onclick = () => {chrome.runtime.sendMessage({type:"login", name:nameInput.value, pw:pwInput.value})};
  signupButton.onclick = () => {chrome.runtime.sendMessage({type:"join", name:nameInput.value, pw:pwInput.value})};
  cancelButton.onclick = () => {showLogin()};
  version.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  signUpLink.onclick = () => {showSignUp()};

  const showSignUp = function() {
    signUpTitle.style.display="block";
    signupButton.style.display="block";
    cancelButton.style.display="block";
    loginTitle.style.display="none";
    loginButton.style.display="none";
    msg.style.display="none";
    signUpLink.style.display="none";  
    if(loginFailMsg.style.display==="block"){
      loginFailMsg.style.display="none";
    }
    if(emptyMsg.style.display==="block"){
      emptyMsg.style.display="none";
    }
  }

  const showLogin = function() {
    signUpTitle.style.display="none";
    signupButton.style.display="none";
    cancelButton.style.display="none";
    emptyMsg.style.display="none";
    loginTitle.style.display="block";
    loginButton.style.display="block";
    loginFailMsg.style.display="none";
    msg.style.display="block";
    signUpLink.style.display="block";
  }

  function setCookie(name, pwd){
    chrome.extension.sendMessage({name: 'setLoginCookie', username:name, password:pwd}, function(otherResponse) {
        console.log(otherResponse)
    })
  }

  function getCookie(){
    chrome.extension.sendMessage({name: 'getLoginCookie'}, function(response) {
      if(response.username){
        chrome.extension.sendMessage({name: 'getStatus'}, function(response) {
          if(response.status === true) {
            window.location.href="stt.html";
          } else {
            window.location.href="popup.html";
            if(loginFailMsg.style.display==="block"){
              loginFailMsg.style.display="none";
            }
            if(emptyMsg.style.display==="block"){
              emptyMsg.style.display="none";
            }
          }
        })
      }
    })
  }

  showLogin();
  getCookie();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === "loginSuccess") {
      setCookie(nameInput.value, pwInput.value);
      window.location.href="popup.html";
      if(loginFailMsg.style.display==="block"){
        loginFailMsg.style.display="none";
      }
      if(emptyMsg.style.display==="block"){
        emptyMsg.style.display="none";
      }
    }
    if (request === "loginFail") {
      loginFailMsg.style.display="block";
      if(emptyMsg.style.display==="block"){
        emptyMsg.style.display="none";
      }
    }
    if (request === "signUpSuccess") {
      showLogin();
      if(emptyMsg.style.display==="block"){
        emptyMsg.style.display="none";
      }
    }
    if (request === "stringEmpty") {
      emptyMsg.style.display="block";
      if(loginFailMsg.style.display==="block"){
        loginFailMsg.style.display="none";
      }
    }
  });
});

