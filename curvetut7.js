
"use strict";

// to improve performances
//  https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#use-native-js-in-bottlenecks
p5.disableFriendlyErrors = true;


var result;
var mn = .5*Math.sqrt(3), ia = Math.atan(Math.sqrt(.5));
var samplesPerFrame = 5;
var numFrames = 100;        
var shutterAngle = .6;
var recording = false;
var m = 450;
var motion_rad = 0.1;
var simplex_size = 0.4;
var offset_factor = 2.0;
var parts = 8;
var mouse_is_pressed = false;
var simplex_noise;
var n = 20;
var size_by_width = null;

function initArray() {
    result = new Array(width*height);
    for (var i=0, imax = result.length ; i<imax ; i++) {
        result[i] = new Array(3);
    }  
}

function setup(){
  createCanvas(500, 500);
  
  initArray();
  
  simplex_noise = new OpenSimplexNoise();
  
  size_by_width = simplex_size * width;
  
}



function draw() {

    var t = mouseX / width;
   // c = mouseY / height;
    background(0);

    push();
    translate(width/2,height/2);

    for(var i=0 ; i<n ; i++){
      push();
      rotate(i*TWO_PI/n);
      drawThing(t, i);
      pop();
    }

    pop();

}

//////////////////////////////////////////////////////////////////////////////

// quelques calculs pourraient être mutualisées entre xy1 et xy2, 
// sans doute au prix d'une moindre lisibilité

function xy1(t_ph){
    var tmp = TWO_PI*(t_ph);
    var tmp_cos = motion_rad*cos(tmp);
    var tmp_sin = motion_rad*sin(tmp);
    var x = size_by_width*simplex_noise.eval2(75+tmp_cos,tmp_sin);
    var y = size_by_width*simplex_noise.eval2(100+tmp_cos,tmp_sin);
    return {x:x, y:y};
}

function xy2(t_ph){
    var tmp = TWO_PI*(t_ph);
    var tmp_cos = motion_rad*cos(tmp);
    var tmp_sin = motion_rad*sin(tmp);
    var x = 0.3*width+0.5*size_by_width*simplex_noise.eval2(200+tmp_cos,tmp_sin);
    var y = 0.5*size_by_width*simplex_noise.eval2(300+tmp_cos,tmp_sin);
    return {x:x, y:y};
}


function drawThing(t, j){
  var ph2 = -parts * j / n;
  
  var t_ph2 = t + ph2;
  
  var w_xy1 = xy1(t_ph2);
  var w_xy2 = xy2(t_ph2);
 
  stroke(255);
  fill(255);
  ellipse(w_xy1.x,w_xy1.y,3,3);
  ellipse(w_xy2.x,w_xy2.y,3,3);
  
  stroke(255,50);
  strokeWeight(2);
  for(var i=0;i<=m;i++){
    var tt = i/m;
    
    var tmp_xy1 = xy1(-offset_factor*tt+t_ph2);
    var tmp_xy2 = xy2(-offset_factor*(1-tt)+t_ph2);
    
    var xx = lerp(tmp_xy1.x,tmp_xy2.x,tt);
    var yy = lerp(tmp_xy1.y,tmp_xy2.y,tt);
    
    point(xx,yy);
  }
}

function keyPressed() {
    var tmp_n = int(key);
    if (tmp_n > 0 && tmp_n < 10) {
        n = tmp_n * 10;
        initArray();
    }
}