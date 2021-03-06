/**
 * Original version written by Etienne Jacob for Processing
 * Adaptated and optimized for P5.js by Gregory Jarrige (April 2, 2018)
 */

"use strict";

// améliore les perfs :
//  https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#use-native-js-in-bottlenecks
p5.disableFriendlyErrors = true;

var numFrames = 100;
var forme1 = [];
var forme2 = [];
var loopCount = 1;
var m = 200;


function setup(){
  createCanvas(500,500,'WEBGL');
 
  stroke(255);
  fill(255);
  
  precalcul();
  loopCount = 1;
}
 
function precalcul() {
    var t, i;
    for (i=1; i <= numFrames; i++) {
        t = 1.0*(i - 1)/numFrames;
        forme1.push({x:x1(t),y:y1(t)});
        forme2.push({x:x2(t),y:y2(t)});
    }
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
    background(0);

    ellipse(forme1[loopCount].x, forme1[loopCount].y, 6, 6);
    ellipse(forme2[loopCount].x, forme2[loopCount].y, 6, 6);

    push();
    strokeWeight(2);
    stroke(255,100);
    for(var i=0;i<=m;i++){
        var tt = 1.0*i/m;

        var x = lerp(forme1[loopCount].x,forme2[loopCount].x,tt);
        var y = lerp(forme1[loopCount].y,forme2[loopCount].y,tt);

        point(x,y);
    }
    pop();
    
    //println("saving frame " + frameCount + "/" + numFrames);
    //if(frameCount<=numFrames) saveFrame("fr###.png");
    loopCount++;
    //if(loopCount == numFrames) noLoop();
    if(loopCount == numFrames)  loopCount = 1;
}