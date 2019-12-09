/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/license-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the license.
 */

var anypixel = require('anypixel');
var ctx = anypixel.canvas.getContext2D();

const INC_W = anypixel.config.width;
const INC_H = anypixel.config.height;

var colors = ['#F00', '#0F0', '#00F'];
const color = colors[2];

const dinoSize = 4;
const horizonHeight = 2;

const dinosaur = {
  x: 0,
  y: INC_H - dinoSize - horizonHeight,
};

/**
 * Listen for onButtonDown events and draw a 2x2 rectangle at the event site
 */
document.addEventListener('onButtonDown', function (event) {
  dinosaur.x++;
});

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(update);
});

function drawHorizon() {
  ctx.fillStyle = colors[2];
  ctx.fillRect(0, INC_H - horizonHeight, INC_W, horizonHeight);
}

function drawDinosaur(dinosaur) {
  ctx.fillStyle = colors[1];
  ctx.fillRect(dinosaur.x, dinosaur.y, 4, 4);
}

function update(elapsedTime) {
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, INC_W, INC_H);

	drawHorizon();
  drawDinosaur(dinosaur);

  requestAnimationFrame(update);
}

