/**
 * Original version written by Etienne Jacob for Processing
 * Adaptated and optimized for P5.js by Gregory Jarrige (April 2, 2018)
 */

"use strict";

// to improve performances
//  https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#use-native-js-in-bottlenecks
p5.disableFriendlyErrors = true;

var numFrames = 100;
var simplex_noise;
var m = 3000;
var motion_radius = 1.0;
var delay_factor = 1.0;
var forme = {};
var loopCount = 1;

var val_delay_factor = document.getElementById('val_delay_factor');
var val_motion_radius = document.getElementById('val_motion_radius');
val_delay_factor.innerHTML = delay_factor;
val_motion_radius.innerHTML = motion_radius;

function setup() {
    createCanvas(500, 500);

    stroke(255);
    fill(255);

    simplex_noise = new OpenSimplexNoise();

    forme = precalcul();
    loopCount = 1;

    var target = document.getElementById('defaultCanvas0');
    target.focus();

}

function xy1(t) {
    var tmp = TWO_PI * t;
    var cos_tmp = motion_radius * cos(tmp);
    var sin_tmp = motion_radius * sin(tmp);
    var seed ;
    seed = 1337;
    var x = 0.25 * width + 150 * simplex_noise.eval2(seed + cos_tmp, sin_tmp);
    seed = 1515;
    var y = 0.5 * height + 150 * simplex_noise.eval2(seed + cos_tmp, sin_tmp);
    return {x: x, y: y};
}

function xy2(t) {
    var tmp = 2 * TWO_PI * t;
    var x = 0.75 * width + 50 * cos(tmp);
    var y = 0.5 * height + 50 * sin(tmp);
    return {x:x, y:y};
}

function precalcul() {
    var forme = {};
    forme['1'] = [];
    forme['2'] = [];
    forme['t'] = [];
    var t, i, coords;
    for (i = 1; i <= numFrames; i++) {
        t = 1.0 * (i - 1) / numFrames;
        coords = xy1(t);
        forme['1'].push({x: coords.x, y: coords.y});
        coords = xy2(t);
        forme['2'].push({x: coords.x, y: coords.y});
        forme['t'].push(t);
    }
    return forme;
}

function draw() {
    //var t = 1.0*(frameCount - 1)/numFrames;
    var t = forme['t'][loopCount];

    background(0);

    ellipse(forme['1'][loopCount].x, forme['1'][loopCount].y, 6, 6);
    ellipse(forme['2'][loopCount].x, forme['2'][loopCount].y, 6, 6);

    push();
    strokeWeight(2);
    stroke(255, 35);

    var i, tt, coords1, coords2, x, y;
    for (i = 0; i <= m; i++) {
        tt = 1.0 * i / m;
        coords1 = xy1(t - delay_factor * tt);
        coords2 = xy2(t - delay_factor * (1 - tt));
        var x = lerp(coords1.x, coords2.x, tt);
        var y = lerp(coords1.y, coords2.y, tt);

        point(x, y);
    }
    pop();

    loopCount++;
    
    if (loopCount == numFrames)
        loopCount = 1;
}

function keyPressed() {
    if (keyCode == DOWN_ARROW) {
        motion_radius -= 0.5;
        forme = precalcul();
        loopCount = 1;
        //console.log('motion_radius ', motion_radius);
        val_motion_radius.innerHTML = motion_radius;
    }
    if (keyCode == UP_ARROW) {
        motion_radius += 0.5;
        forme = precalcul();
        loopCount = 1;
        //console.log('motion_radius ', motion_radius);
        val_motion_radius.innerHTML = motion_radius;
    }
    if (keyCode == LEFT_ARROW) {
        delay_factor -= 0.5;
        forme = precalcul();
        loopCount = 1;
        //console.log('delay_factor ', delay_factor);
        val_delay_factor.innerHTML = delay_factor;
    }
    if (keyCode == RIGHT_ARROW) {
        delay_factor += 0.5;
        forme = precalcul();
        loopCount = 1;
        //console.log('delay_factor ', delay_factor);
        val_delay_factor.innerHTML = delay_factor;
    }
}