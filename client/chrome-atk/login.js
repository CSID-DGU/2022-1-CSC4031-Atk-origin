//initial display for popup menu when opened
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('loginBtn');
  const signupButton = document.getElementById('signupBtn');
  const cancelButton = document.getElementById('cancelBtn');
  const signupLink = document.getElementById("signupLink");
  const loginHeading = document.getElementById("loginHeading");
  const signupHeading = document.getElementById("signupHeading");
  const nameInput = document.getElementById("name");
  const pwInput = document.getElementById("pw");
  const signupText = document.getElementById("signupText");
  const errorMessage = document.getElementById("errorMessage");
  const logo = document.getElementById("logo");
  logo.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  
  loginButton.onclick = () => {chrome.runtime.sendMessage({type:"login", name:nameInput.value, pw:pwInput.value})};
  //loginButton.onclick = () => {window.location.href="popup.html"};
  
  signupButton.onclick = () => {chrome.runtime.sendMessage({type:"join", name:nameInput.value, pw:pwInput.value})};
  cancelButton.onclick = () => {showLogin()};
  signupLink.onclick = () => {showSignUp()};

  const showSignUp = function() {
    signupHeading.style.display="block";
    loginHeading.style.display="none";
    signupButton.style.display="block";
    cancelButton.style.display="block";
    loginButton.style.display="none";
    signupText.style.display="none";
    signupLink.style.display="none";  
    errorMessage.style.display="none";
  }

  const showLogin = function() {
    signupHeading.style.display="none";
    loginHeading.style.display="block";
    signupButton.style.display="none";
    cancelButton.style.display="none";
    loginButton.style.display="block";
    signupText.style.display="block";
    signupLink.style.display="block";
    errorMessage.style.display="none";
  }

  function setCookie(name, pwd){
    chrome.extension.sendMessage({name: 'setLoginCookie', username:name, password:pwd}, function(otherResponse) {
        console.log(otherResponse)
    })
  }

  function getCookie(){
    chrome.extension.sendMessage({name: 'getLoginCookie'}, function(response) {
      if(response.username){
        chrome.runtime.sendMessage({type:"login", name:response.username, pw:response.password});
        //window.location.href="popup.html";
        errorMessage.style.display="none";
      }
    })
  }

  showLogin();
  getCookie();

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request === "loginSuccess") {
      errorMessage.style.display="none";
      window.location.href="popup.html";
    } else if (request === "loginFail") {
      errorMessage.innerHTML="User name or password is incorrect."
      errorMessage.style.display="block";
    } else if (request === "signUpSuccess") {
      errorMessage.style.display="none";
      showLogin();
    } else if (request === "signupFail") {
      errorMessage.innerHTML="User name already exists."
      errorMessage.style.display="block";
    } else if (request === "stringEmpty") {
      errorMessage.innerHTML="Required field(s) is(are) empty."
      errorMessage.style.display="block";
    }
  });
});

