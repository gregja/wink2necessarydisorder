/**
 * Original version written by Etienne Jacob for Processing
 * Adaptated and optimized for P5.js by Gregory Jarrige (April 2, 2018)
 * Note : this version isn't optimized, some parts of code have been
 *        refactored in the V2 
 */

"use strict";

// improve perfs of P5 :
//  https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#use-native-js-in-bottlenecks
p5.disableFriendlyErrors = true;
    
var numFrames = 100;
var m = 200;
var delay_factor = 5.0;

function setup(){
  createCanvas(500, 500);
 
  stroke(255);
  fill(255);
}
 
function x1(t){
  return 0.25*width + 50*cos(TWO_PI*t);
}
function y1(t){
  return 0.5*height + 50*sin(TWO_PI*t);
}
 
function x2(t){
  return 0.75*width + 50*cos(2*TWO_PI*t);
}
function y2(t){
  return 0.5*height + 50*sin(2*TWO_PI*t);
}
 
function draw(){
    var t = 1.0*(frameCount - 1)/numFrames;

    background(0);

    ellipse(x1(t),y1(t),6,6);
    ellipse(x2(t),y2(t),6,6);

    push();
    strokeWeight(2);
    stroke(255,100);
    for(var i=0 ; i<=m ; i++){
        var tt = 1.0*i/m;

        //  no delay
        //      var x = lerp(x1(t),x2(t),tt);
        //      var y = lerp(y1(t),y2(t),tt);

        // delay on 1 disk
        //        var x = lerp(x1(t - delay_factor*tt),x2(t),tt);
        //        var y = lerp(y1(t - delay_factor*tt),y2(t),tt);

        // delay on 2 disks
        var x = lerp(x1(t - delay_factor*tt),x2(t - delay_factor*(1-tt)),tt);
        var y = lerp(y1(t - delay_factor*tt),y2(t - delay_factor*(1-tt)),tt);

        point(x,y);
    }
    pop();

  //println("saving frame " + frameCount + "/" + numFrames);
  //if(frameCount<=numFrames) saveFrame("fr###.png");
  if(frameCount == numFrames) stop();
}