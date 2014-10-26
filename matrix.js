//http://flippinawesome.org/2014/03/31/creating-sound-with-the-web-audio-api-and-oscillators/
//http://www.softsynth.com/webaudio/tone.php
//http://noisehack.com/custom-audio-effects-javascript-web-audio-api/
// https://chromium.googlesource.com/external/WebKit_LayoutTests/+/master/webaudio/audiobuffersource-playbackrate.html
// http://www.phy.mtu.edu/~suits/notefreqs.html

// this is a C major scale 
var frequencies = [
'261.63',  // c4
'293.66',  // d4
'329.63',  // e4
'349.23',  // f4
'392.00',  // g4
'440.00',  // a4
'493.88',  // b4
'523.25',  // c5
'587.33',  // d5
'659.25',  // e5
'698.46',  // f5
'783.99',  // g5
'880.00',  // a5
'987.77',  // b5 
'1046.50', // c6
'1174.66']  // d6

frequencies.reverse();

function playSound(index) {
  time = context.currentTime;
  fadeout = 1;
  
  // generate the sound wave at specified note frequency
  var osc = context.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = frequencies[index];
  osc.start(time);
  osc.stop(time + fadeout);

  // add 'bounce' to note, and fade in/out to avoid clicks.
  var gainNode = context.createGain();
  gainNode.gain.value = 0;
  gainNode.gain.linearRampToValueAtTime(0.01, time + 0.02);
  gainNode.gain.linearRampToValueAtTime(0.5, time + 0.125);
  gainNode.gain.linearRampToValueAtTime(0.2, time + 0.130);
  gainNode.gain.exponentialRampToValueAtTime(0.01, time + fadeout);

  osc.connect(gainNode);
  gainNode.connect(context.destination);       
}

function playNotesInColumn($elem) {
  $elem.children(':checked').each(function() {
    playSound($(this).val() - 1);
  });

  // Repeat this column every 2 seconds, since there are 16 columns at 125ms intervals. 
  // This simple implementation of timeout isn't really a long term solution, it will start 
  // lagging eventually if cpu is processing other things when timeout is supposed to fire
  setTimeout(function() {
   playNotesInColumn($elem) 
  }, 2000); 

}

function loopSound() {
  // Kick off the loop. Each column represents 125ms worth of time.
  $(".grid").children().each(function(index){
    var i = $(this);
    setTimeout(function() { 
      playNotesInColumn(i)
    }, index * 125); 
  });
}

function init() {
  try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
  	console.log(e);
    alert('Web Audio API is not supported in this browser.');
  }

  loopSound();
}

window.addEventListener('load', init, false);
