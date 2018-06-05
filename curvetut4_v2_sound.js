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

var mode_calcul_right = 1;

var start_sound_left = false;
var start_sound_right = false;
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator and gain node
var osc1 = audioCtx.createOscillator('sine');
var gain1 = audioCtx.createGain();
var osc2 = audioCtx.createOscillator('square');
var gain2 = audioCtx.createGain();

var dist1 = audioCtx.createWaveShaper();
var dist2 = audioCtx.createWaveShaper();

// connect oscillator to gain node to speakers
osc1.connect(gain1);
gain1.connect(dist1);
dist1.connect(audioCtx.destination);
osc2.connect(gain2);
gain2.connect(dist2);
dist2.connect(audioCtx.destination);

dist1.curve = makeDistortionCurve(0);
dist2.curve = makeDistortionCurve(0);

var maxFreq1 = 1000;
var maxFreq2 = 600;
var maxVol = 0.02;

var initialFreq = 500;
var initialVol = 0.0;

// set options for the oscillator
osc1.detune.value = 100; // value in cents
osc2.detune.value = 100; // value in cents
gain1.gain.value = initialVol;
gain2.gain.value = initialVol;
osc1.start(0);
osc2.start(0);

/**
 * Distorsion
 * @param {type} amount
 * @returns {Float32Array}
 * Source : https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion#22313408
 */
function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50;
    var n_samples = 44100,
            curve = new Float32Array(n_samples),
            deg = Math.PI / 180,
            i = 0,
            x;
    for (; i < n_samples; ++i) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x))*100;
    }
    return curve;
}
;

function setup() {
    createCanvas(500, 500);

    stroke(255);
    fill(255);

    frameRate(30);
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
    var seed;
    seed = 1337;
    var x = 0.25 * width + 150 * simplex_noise.eval2(seed + cos_tmp, sin_tmp);
    seed = 1515;
    var y = 0.5 * height + 150 * simplex_noise.eval2(seed + cos_tmp, sin_tmp);
    return {x: x, y: y};
}

function xy2(t) {
    var tmp = 2 * TWO_PI * t;
    var xtmp, ytmp;
    if (mode_calcul_right == 1) {
        xtmp = tmp;
        ytmp = tmp;
    } else {
        if (mode_calcul_right == 2) {
            xtmp = tmp * 2;
            ytmp = tmp / 2;
        } else {
            xtmp = tmp / 2;
            ytmp = tmp * 2;
        }
    }
    var x = 0.75 * width + 50 * cos(xtmp);
    var y = 0.5 * height + 50 * sin(ytmp);
    return {x: x, y: y};
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

    if (start_sound_left) {
        dist1.curve = makeDistortionCurve(forme['1'][loopCount].x / height);
        osc1.frequency.value = (forme['1'][loopCount].y / width) 
                * maxFreq1;
        gain1.gain.value = (forme['1'][loopCount].y / height) * maxVol;
    } else {
        gain1.gain.value = initialVol;
    }
    if (start_sound_right) {
        dist2.curve = makeDistortionCurve(forme['2'][loopCount].x / height);
        osc2.frequency.value = (forme['2'][loopCount].y / width) 
                 * maxFreq2;
        gain2.gain.value = (forme['2'][loopCount].y / height) * maxVol;
    } else {
        gain2.gain.value = initialVol;
    }

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
    if (key == 'L' || key == 'l') {
        start_sound_left = !start_sound_left;
    }
    if (key == 'R' || key == 'r') {
        start_sound_right = !start_sound_right;
    }
    if (key == '1') {
        mode_calcul_right = 1
        forme = precalcul();
        loopCount = 1;
    }
    if (key == '2') {
        mode_calcul_right = 2
        forme = precalcul();
        loopCount = 1;
    }
    if (key == '3') {
        mode_calcul_right = 3
        forme = precalcul();
        loopCount = 1;
    }

}