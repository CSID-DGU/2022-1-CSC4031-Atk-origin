chrome.runtime.onMessage.addListener(function(msg, sender){
    if(msg == "toggle"){
        toggle();
        console.log("toggle");
    }
});

var iframe = document.createElement('iframe'); 
iframe.style.background = "white";
iframe.style.height = "100%";
iframe.style.width = "0px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "50";
iframe.frameBorder = "none";
iframe.src = chrome.extension.getURL("login.html");

document.body.appendChild(iframe);

function toggle(){
    if(iframe.style.width == "0px"){
        iframe.style.width="400px";
    }
    else{
        iframe.style.width="0px";
    }
}