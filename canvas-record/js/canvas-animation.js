var sun = new Image();
var moon = new Image();
var earth = new Image();

var bg = document.createElement("video");

// var {video1, video2, video3, video4, video5} = {
//     video1: document.createElement("video"),
//     video2: document.createElement("video"),
//     video3: document.createElement("video"),
//     video4: document.createElement("video"),
//     video5: document.createElement("video")
// };

init();

function init(){
  
  sun.src = 'img/canvas_sun.png';
  moon.src = 'img/canvas_moon.png';
  earth.src = 'img/canvas_earth.png';
  
  bg.src = 'vid/video.webm';
  bg.play();

  bg.onended = function(e){
    console.log(e, this);
  }
  setInterval(draw,0.01);
  
}

function draw(ctx) {
  
  var ctx = document.getElementById('canvas').getContext('2d');
  
  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0,0,300,300); // clear canvas

  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.strokeStyle = 'rgba(0,153,255,0.4)';
  ctx.save();
  ctx.translate(150,150);

  // Earth
  var time = new Date();
  ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
  ctx.translate(105,0);
  ctx.fillRect(0,-12,50,24); // Shadow
  ctx.drawImage(earth,-12,-12);

  // Moon
//   ctx.save();
//   ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
//   ctx.translate(0,28.5);
//   ctx.drawImage(bg,-3.5,-3.5, 230, 230);
//   ctx.restore();

  ctx.restore();
  
  ctx.beginPath();
  ctx.arc(150,150,105,0,Math.PI*2,false); // Earth orbit
  ctx.stroke();
 
   ctx.drawImage(bg, -3.5, -3.5, 250, 250);
//   ctx.drawImage(sun,0,0,300,300);
}

function tracklist(){

}

