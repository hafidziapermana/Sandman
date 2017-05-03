const {app, Tray, Menu, BrowserWindow} = require('electron'); //electron application stuff
const fs = require('fs');
const path = require('path'); //allows for use of path
const filePath = path.join(__dirname, 'settings.txt');
const url = require('url'); //allows for loadURL and url.format
const iconPath = path.join(__dirname, 'icon.png'); //grab the icon
let tray = null; //set the tray to null
let win = null; //set the main window to null
let pref = null;
let abt = null;
var closeOnX = false;
var mySettings = null;


app.on('ready', function(){
  win = new BrowserWindow({width: 600, height: 450, resizable: false}); //create main window

  win.setMenu(null); //the main window had no menu
  win.loadURL(url.format({    //loads the webpage for the main window
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))



  //win.openDevTools(); //starts the application with developer tools open

  readFile();
  getCloseOnXPref();
if (!closeOnX)
{
  win.on('minimize',function(event){ //prevents standard minimize function of a main window
        event.preventDefault()
            win.hide();
    });
  win.on('close', function (event) { //prevents the closing of the aplication when the window closes
        if( !app.isQuiting){
            event.preventDefault()
            win.hide();
        }
    });
}
  tray = new Tray(iconPath); //create a new tray
  var contextMenu = Menu.buildFromTemplate([  //start buliding out the menu for the tray

          { label: 'Insomnia', click:  function(){  //makes the main window reappear
              win.show();
          } },
          { label: 'About', click:  function(){ //shows the about window
            abt = new BrowserWindow({width: 500, height: 570, resizable: false});
            abt.setMenu(null); //the about window has no menu
            abt.loadURL(url.format({  //loads the webpage for the about window
              pathname: path.join(__dirname, 'about.html'),
              protocol: 'file:',
              slashes: true
            }))

          } },
          {
            label: 'Preferences', click:  function(){ //shows the about window
              pref = new BrowserWindow({width: 400, height: 540, resizable: false});
              pref.setMenu(null); //the about window has no menu
              pref.loadURL(url.format({  //loads the webpage for the about window
                pathname: path.join(__dirname, 'preferences.html'),
                protocol: 'file:',
                slashes: true
              }))
                // pref.openDevTools();
            }
          },
          { label: 'Quit', click:  function(){ //quit the application
              app.isQuiting = true;
              app.quit(); //quit called

          } }
      ]);
  tray.setToolTip('Insomnia'); //Honestly no clue but itll make the tray say insomnia in some other place
  tray.setContextMenu(contextMenu); //attach the menu to the tray
});


function readFile()
{
  //console.log("Running readfile");
  mySettings = fs.readFileSync(filePath,'utf8'); //read in the settings file
  mySettings = (mySettings).split(" "); //split up the settings into an array (each index contains a different setting)
  return;
}

function getCloseOnXPref()
{
  if (mySettings[2]==="true")
  {
    closeOnX = true;
  }
  else {
    closeOnX = false;
  }
  return;
}
