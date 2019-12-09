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

const HORIZON_W = 1200;
const HORIZON_H = 12;
const HORIZON_SPEED = 4;
let horizonLocation = 0;
const horizonImageDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAAASCAYAAABLuic5AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wwJFRcnXpgxYQAAAYVJREFUeNrt3FGuwiAQBVBZY/e/FvzSGEMTCrR06DmfxjyfUxguFk0vAADgdDnnXHo8pZRUB9AD9VgAAIDpG7fS5mrvcYCn9MAIf5978EkkAACcuGn7Bu+dUwCf5zglAOiBeiwAAMDlG7cjd/+dxgL0wLrnt/RLPTa+5AICAMBJYfvgHf+R2bzmte0FgKg9sPfEFgAAAJPVnDRwGgGASHwHFAAAFlTz4ZTfhAEgiqUXrJofdOO60OQaGKuYJ2DeWbMwfo1VzBMw74a/+C+Xo/3C9dRfNePWb9u2HHkMGitr9ZRSb1/9mj5hHkR/r///d+t7iVQH+Uq+smbGzTjGjnwlX8lX8hWAkKQeQiwTx7+AAuin6oF8ZfzLVwRtrKMHWuQ7rivdQdFE2urZWzN1R3DEJk1N5Cv5ypyTr0C+kiWmLPx3GViO4teZ+XU2WHlx1Xeu69/6mEAZKaDJV8YFIF9F6N9qLV9ZRwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDx3klPSzP33sjKAAAAAElFTkSuQmCC';

var colors = ['#F00', '#0F0', '#00F'];

const dinosaur = {
  x: 0,
  y: INC_H - HORIZON_H,
};

let lastFrame = Date.now();

/**
 * Listen for onButtonDown events and draw a 2x2 rectangle at the event site
 */
document.addEventListener('onButtonDown', function (event) {
  dinosaur.x++;
});

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(update);
});

const horizonImage = getHorizonImage();

function drawHorizon(elapsedTimeInFrame) {
  updateHorizonLocation(elapsedTimeInFrame);
  ctx.drawImage(horizonImage, horizonLocation, INC_H - horizonImage.height);
  ctx.drawImage(horizonImage, horizonLocation + horizonImage.width,
      INC_H - horizonImage.height);
}

function updateHorizonLocation(elapsedTimeInFrame) {
  horizonLocation -= elapsedTimeInFrame * HORIZON_SPEED;
  horizonLocation = Math.floor(horizonLocation) % HORIZON_W;
}

function drawDinosaur(dinosaur) {
  ctx.fillStyle = colors[1];
  ctx.fillRect(dinosaur.x, dinosaur.y, 4, 4);
}

function update() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, INC_W, INC_H);

  const elapsedTimeInFrame = (Date.now() - lastFrame) / 1000;
  drawHorizon(elapsedTimeInFrame);
  drawDinosaur(dinosaur);
  lastFrame = Date.now();

  requestAnimationFrame(update);
}

function getHorizonImage() {
  const horizonImage = new Image;
  horizonImage.src = horizonImageDataUri;
  horizonImage.height = HORIZON_H;
  horizonImage.width = HORIZON_W;
  return horizonImage;
}
