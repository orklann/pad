var {ipcRenderer, remote} = require('electron');

function main() {
  console.log("main() loaded...");
  document.body.addEventListener('keydown', onKeydown, false);
  var addressDiv = document.querySelector('#url-div');
  addressDiv.style.display = "none";
}

function onKeydown(e) {
  var charCode = e.charCode || e.keyCode,
      character = String.fromCharCode(charCode);
  if (character == 'D' && e.metaKey) {
    var addressDiv = document.querySelector('#url-div');
    addressDiv.style.display = "inline-block";
  } else if (e.keyCode == 13) {
    var address = document.querySelector('#url-address');
    var iframe = document.querySelector("#web-content");
    var url = address.value;
    url = url.replace("http://", '');
    url = url.replace("https://", '');
    iframe.src = "http://" + url;
    var addressDiv = document.querySelector('#url-div');
    addressDiv.style.display = "none";
  } else if(e.keyCode == 27) {
    var addressDiv = document.querySelector('#url-div');
    addressDiv.style.display = "none";
  }
}

main();