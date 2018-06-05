
"use strict";

// to improve performances
//  https://github.com/processing/p5.js/wiki/Optimizing-p5.js-Code-for-Performance#use-native-js-in-bottlenecks
p5.disableFriendlyErrors = true;

//var mn = .5 * Math.sqrt(3);
//var ia = Math.atan(Math.sqrt(.5));
var m = 300;
var offset_factor = 0.5;
var samplesPerFrame = 4;
var numFrames = 100;
var shutterAngle = .7;
var simplex_noise;
var n = 5;
var r = 160;
var motion_rad = 1.0;
var l = 50;
var ejarray = [];

//function ease(p, g = null) {
//    if (g == null) {
//        return 3 * p * p - 2 * p * p * p;
//    } else {
//        if (p < 0.5) {
//            return 0.5 * pow(2 * p, g);
//        } else {
//            return 1 - 0.5 * pow(2 * (1 - p), g);
//        }
//    }
//}

//////////////////////////////////////////////////////////////////////////////

class Center {

    constructor(i, n, l, motion_rad) {
        this.l = l;
        this.motion_rad = motion_rad;
        this.theta = i * TWO_PI / n;
        this.cx = r * cos(this.theta);
        this.cy = r * sin(this.theta);
        this.seed = random(1000);
        this.ii = i;
    }

    xy(q, t) {
        var tmp1 = TWO_PI * (t + q);
        var tmp2 = this.motion_rad * cos(tmp1);
        var tmp3 = this.motion_rad * sin(tmp1);
        return {
            'x': this.cx + this.l * simplex_noise.eval2(this.seed + tmp2, tmp3),
            'y': this.cy + this.l * simplex_noise.eval2(2 * this.seed + tmp2, tmp3)
        };
    }

    show(t) {
        fill(255);
        stroke(255);
        var tmp = this.xy(0, t);
        ellipse(tmp.x, tmp.y, 6, 6);
    }
}

function initArray() {
    ejarray = [];
    for (var i = 0; i < n; i++) {
        ejarray[i] = new Center(i, n, l, motion_rad);
    }
    
}

function setup() {
    createCanvas(500, 500);

    initArray();
    simplex_noise = new OpenSimplexNoise();
    
    frameRate(60);
}

function draw() {
    var t = mouseX / width;

    background(0);
    push();
    translate(width / 2, height / 2);

    strokeWeight(1);
    for (var i = 0; i < n; i++) {
        ejarray[i].show(t);
    }

    stroke(255, 70);
    strokeWeight(2);
    
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < i; j++) {
            for (var k = 0; k <= m; k++) {
                var tt = k / m;

                var tmp1 = 0 - offset_factor; // => -1 * offset_factor 
                var tmp2 = tmp1 * tt;  // => -1 * offset_factor * tt
                var tmp3 = tmp1 * (1 - tt);  // => -1 * offset_factor * (1 - tt)
                
//                var xx = lerp(ejarray[i].x(tmp2, t), ejarray[j].x(tmp3, t), tt);
//                var yy = lerp(ejarray[i].y(tmp2, t), ejarray[j].y(tmp3, t), tt);
                var tmp4 = ejarray[i].xy(tmp2, t);
                var tmp5 = ejarray[j].xy(tmp3, t);

                var xx = lerp(tmp4.x, tmp5.x, tt);
                var yy = lerp(tmp4.y, tmp5.y, tt);

                point(xx, yy);
            }
        }
    }

    pop();
}

function keyPressed() {
    var tmp_n = int(key);
    if (tmp_n > 0 && tmp_n < 10) {
        n = tmp_n;
        initArray();
    }
}