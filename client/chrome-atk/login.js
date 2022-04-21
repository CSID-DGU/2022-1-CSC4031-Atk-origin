//initial display for popup menu when opened
document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('login');
  // loginButton.onclick = () => {chrome.runtime.sendMessage("changePopup")};
  //loginButton.onclick = () => {window.location.href = "popup.html"};
  loginButton.onclick = () => {chrome.runtime.sendMessage("login")};
  const version = document.getElementById("version");
  const signup = document.getElementById("signup");
  const title = document.getElementById("title");
  version.onclick = () => {chrome.tabs.create({url: "https://github.com/CSID-DGU/2022-1-CSC4031-Atk-origin"})};
  signup.onclick = () => {title.textContent="Sign up"};
});
