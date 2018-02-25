'use strict';
const electron = require('electron');
const {session} = require('electron');
const ipcMain = require('electron').ipcMain;
const window = require('electron').BrowserWindow;
const fs = require('fs');
const {dialog} = require('electron');

const app = electron.app;
const globalShortcut = require('electron').globalShortcut;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
var imageWindows = [];
let screen;

function createMainWindow(w, h) {
  const win = new electron.BrowserWindow({
  	width: w,
  	height: h,
    show: false,
    'use-content-size': true,
    webPreferences: {
            plugins: true,
        webSecurity: false
    },
    titleBarStyle: 'hidden'
  });

  // Set content size of a window
  win.setContentSize(w, h);

  win.loadURL(`file://${__dirname}/app/index.html`);

  win.on('ready-to-show', function(event){
    win.show();
    win.focus();
  });

  return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {

	}
});

app.on('activate', () => {

});

app.on('ready', () => {
  buildMenu();
  const win = createMainWindow(1380, 780);
  win.setTitle("Pad");
  imageWindows.push(win);
});

function showWindowAtCenterTop(w) {
  screen = electron.screen;
  var mainScreen = screen.getPrimaryDisplay();
  var screenSize = mainScreen.size;
  let windowSize = w.getSize()

  const y = 200;
  const x = (screenSize.width / 2) - (windowSize[0] / 2);

  w.setPosition(x, y);
  w.show();
}

function newWindow() {
  const win = createMainWindow(1380, 780);
  win.setTitle("Pad");
  imageWindows.push(win);
}

function buildMenu(){
	const {app, Menu} = require('electron')

	const template = [
  	{
      label: 'File',
      submenu: [
      {
        label: 'New Window',
        accelerator: 'Cmd+N',
        click: function() { newWindow();}
      },
      {role: 'quit'}
      ]
  	},
    {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]},
	 {
	    label: 'View',
	    submenu: [
  			{role: 'reload'},
  			{role: 'forcereload'},
  			{role: 'toggledevtools'},
  			{type: 'separator'},
  			{role: 'resetzoom'},
  			{role: 'zoomin'},
  			{role: 'zoomout'},
        {
          label: 'Resize to Fit',
          click () { },
          accelerator: 'Command+F'
        },
  			{type: 'separator'},
  			{role: 'togglefullscreen'}
	    ]
	  },
	  {
  		role: 'window',
  		submenu: [
  			{role: 'minimize'},
  			{role: 'close'}
  		]
	  },
	  {
      role: 'help',
  		submenu: [
  			{
    			label: 'Learn More',
    			click () { require('electron').shell.openExternal('https://electron.atom.io') }
  			}
  		]
	  }
	]

	if (process.platform === 'darwin') {
		template.unshift({
  		label: app.getName(),
  		submenu: [
  			{role: 'about'},
  			{type: 'separator'},
  			{role: 'services', submenu: []},
  			{type: 'separator'},
  			{role: 'hide'},
  			{role: 'hideothers'},
  			{role: 'unhide'},
  			{type: 'separator'},
  			{role: 'quit'}
  		]
		})
	}

	const menu = Menu.buildFromTemplate(template)
	Menu.setApplicationMenu(menu)
}
