
var app = {
   accely:0,
   accelx:0,
   accelz:0,
   timer:0,
   stageElement:0,
   stage:0,
   sensitivity:4,
   alarms:0,
   audioPath:0,
   timerElement:0,
   timerInt:0,
   started:false,

   
   
        initialize: function() {
        document.addEventListener("deviceready", app.onDeviceReady, false);
    },

    onDeviceReady: function() {
     // alert("Device is Ready");
       // alert(device.available);
        app.audioPath = window.location.pathname;
        app.timerElement = document.getElementById('timer');
        app.stageElement = document.getElementById('stage');


        
       //this.startWatch();

    },
    startPASS: function() {
    if(app.started == false) {
        app.playSound("beep");
        app.startTimer();
        app.startWatch();
        app.started = true;
    }

    },
    fullAlarm: function() {
        if(app.stage < 4) {
            app.timer = 22;
            app.stage = 3
        }
        
    },
    toggleLights: function(mode) {
      lights = document.getElementsByClassName('blink');

      if(mode == "green") {
          document.getElementById('blinks').style.display = "block";
           for (var i = 0; i < lights.length; i++) {
            lights[i].style.backgroundColor="green";
            }
      }  
      else if (mode == "red") {
         document.getElementById('blinks').style.display = "block";
         for (var i = 0; i < lights.length; i++) {
         lights[i].style.backgroundColor="red";
         }
      }
    },
    startTimer: function(reset) {
    if(reset == true) {
        clearInterval(timerInt);
        app.resetTimer(true);
        app.started = false;
        document.getElementById('blinks').style.display = "none";
        document.getElementById('startBtn').style.display = "block";
        document.getElementById('onButtons').style.display = "none";
        return;
    }
        document.getElementById('onButtons').style.display = "block";
        document.getElementById('startBtn').style.display = "none";

    app.toggleLights("green");



      timerInt = setInterval(function(){
          app.timer = app.timer + 1;
                if(app.timer > 9 && app.stage == 0) { 
                app.toggleLights("red");
               //     app.stageElement.innerHTML = 'STAGE 1';
                    app.stage = 1;
                    app.playSound(app.stage);
                }
                if(app.timer > 14 && app.stage == 1) {
                //    app.stageElement.innerHTML = 'STAGE 2';
                    app.stage = 2;
                    app.alarms.stop();
                    app.playSound(app.stage);
                }
                if(app.timer > 18 && app.stage == 2) {
                    //app.stageElement.innerHTML = 'STAGE 3';
                    app.stage = 3;
                    app.alarms.stop();
                    app.playSound(app.stage);
                }
                if(app.timer > 21 && app.stage == 3) {
                 //   app.stageElement.innerHTML = 'STAGE 4';
                   app.toggleLights("red");
                   app.stage = 4;
                   app.alarms.stop();
                   app.playSound(app.stage);
                }
          
      }, 1000);
   },
      updateStage: function() {
      
      
      
    },
    
    resetTimer: function(force) {
       // alert("reset");
        if(app.stage < 4) app.playSound("");
        if(app.started == true) {
            if(app.stage < 4 || force == true) {

                app.alarms.stop();
                app.alarms.release();
                app.toggleLights("green");
                app.timer = 0;
                app.stage = 0;
                if(force == true) {
                    app.playSound("beep");
                }
            }
        }

    },


    playSound: function(sound) {
        var path = app.audioPath;
        path = path.substr( path, path.length - 10 );
        url = 'file://' + path +"audio/" + sound+".mp3";
        
        
        var loop = function (status) { 
            if (status === Media.MEDIA_STOPPED) { 
                app.alarms.play(); 
            } 
        }; 
        if(app.alarms) app.alarms.release();
        if(sound == "beep") {
           app.alarms = new Media(url);
        }
        else {
            app.alarms = new Media(url, null, null, loop);
        }
               // Play audio
        app.alarms.play();
    },

    getAcceleration: function() {
        navigator.accelerometer.getCurrentAcceleration(app.onAccelSuccess, app.onError);
    },

    onAccelSuccess: function(acceleration) {
        if(Math.abs(acceleration.y - app.accely) > app.sensitivity ||
           Math.abs(acceleration.x - app.accelx) > app.sensitivity ||
           Math.abs(acceleration.z - app.accelz) > app.sensitivity) {                       
            app.resetTimer(false);
        }
        app.accely = acceleration.y;
        app.accelx = acceleration.x;
        app.accelz = acceleration.z;


    },
     stopAlarm: function() {
            app.alarms.stop();
            app.alarms.release();

     },

    onError: function() {
        alert('onError!');
    },

    startWatch: function() {
       // alert("started");
        // Check acceleration every half second.
        var options = { frequency: 1000 };

        watchID = navigator.accelerometer.watchAcceleration(this.onAccelSuccess, this.onError, options);
    },

    stopWatch: function() {
        if (watchID) {
            navigator.accelerometer.clearWatch(watchID);
            watchID = null;
        }
    }
    
    
};
