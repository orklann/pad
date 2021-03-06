var {ipcRenderer, remote} = require('electron');

var coords;

function main() {
  console.log("main() loaded...");
  document.body.style.backgroundColor="rgb(44, 37, 65)";
  window.addEventListener('keydown', onKeydown, false);
  var addressDiv = document.querySelector('#url-div');
  addressDiv.style.display = "none";

  var address = document.querySelector('#url-address');
  address.addEventListener('keydown', onInputKeydown, false);

  var webview = document.querySelector("#web-content");
  webview.addEventListener('did-navigate', function(event) {
    var address = document.querySelector('#url-address');
    address.value = webview.getURL();
    var title = webview.getTitle();
    document.title = title;
  });

  webview.addEventListener('load-commit', function(event) {
    document.body.removeAttribute("style");
  });

  webview.addEventListener('did-finish-load', function(event) {
    var address = document.querySelector('#url-address');
    address.value = webview.getURL();
    var title = webview.getTitle();
    document.title = title;
  });

  webview.addEventListener('did-navigate-in-page', function(event) {
    var address = document.querySelector('#url-address');
    address.value = webview.getURL();
    var title = webview.getTitle();
    document.title = title;
  });

  var getMouseCoordinates = function (e) {
      'use strict';
      return {
          x: e.clientX,
          y: e.clientY
      };
  };

  document.addEventListener('mousemove', function (e) {
      coords = getMouseCoordinates(e);
  }, false);

  window.addEventListener('mousedown', onMousedown, false);

  require('electron-context-menu')({
    window: webview,
  	prepend: (params, browserWindow) => [{
  		label: 'Refresh',
  		visible: true,
        click: function(){
            webview.loadURL(webview.getURL());
        }
  	},{
        label: 'Show URL',
  		visible: true,
        click: function(){
            var addressDiv = document.querySelector('#url-div');
            addressDiv.style.display = "inline-block";
            var address = document.querySelector('#url-address');
            address.focus();
            address.setSelectionRange(0, address.value.length);
        }
    },{
        label: 'Go Back',
  		visible: true,
        click: function(){
            document.querySelector("#web-content").goBack();
        }
    },{
        label: 'Go Forward',
  		visible: true,
        click: function(){
            document.querySelector("#web-content").goForward();
        }
    }]
  });
}

function onMousedown(e) {
  var address = document.querySelector('#url-address');
  var divCoords = address.getBoundingClientRect();

  if (coords.x >= divCoords.left && coords.x <= divCoords.right && coords.y >= divCoords.top && coords.y <= divCoords.bottom) {
    // mouse on address input
  } else {
    var addressDiv = document.querySelector('#url-div');
    addressDiv.style.display = "none";
  }
}

function onKeydown(e) {
  var charCode = e.charCode || e.keyCode,
      character = String.fromCharCode(charCode);
  if (character == 'D' && e.metaKey) {
    var addressDiv = document.querySelector('#url-div');
    addressDiv.style.display = "inline-block";
    var address = document.querySelector('#url-address');
    address.focus();
    address.setSelectionRange(0, address.value.length);
  } else if (character == 'Z' && e.metaKey){
    var addressDiv = document.querySelector('#url-div');
    addressDiv.style.display = "inline-block";
    var webview = document.querySelector("#web-content");
    var address = document.querySelector('#url-address');
    address.value = webview.getURL();
    address.focus();
    address.setSelectionRange(0, address.value.length);
  } else if(e.keyCode == 27) {
    var addressDiv = document.querySelector('#url-div');
    addressDiv.style.display = "none";
  } else if(e.keyCode == 37) {
    document.querySelector("#web-content").goBack();
  } else if(e.keyCode == 39) {
    document.querySelector("#web-content").goForward();
  }
  console.log("Window keydown detected.");
}

function onInputKeydown(e) {
  if (e.keyCode == 13) {
    var address = document.querySelector('#url-address');
    var iframe = document.querySelector("#web-content");
    var url = address.value;
    url = url.replace("http://", '');
    url = url.replace("https://", '');
    iframe.loadURL("http://" + url);
    var addressDiv = document.querySelector('#url-div');
    addressDiv.style.display = "none";
  }
}

main();
