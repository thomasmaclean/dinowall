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

const Dino = require('./dino.js');

var anypixel = require('anypixel');
var ctx = anypixel.canvas.getContext2D();
const ObstacleManager = require('./obstacle_manager');
const Obstacle = require('./obstacle');

const INC_W = anypixel.config.width;
const INC_H = anypixel.config.height;

const HORIZON_W = 1200;
const HORIZON_H = 12;
const HORIZON_HILL_H = 4;
const HORIZON_SPEED = 4;
let horizonLocation = 0;
const horizonImageDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABLAAAAASCAYAAABLuic5AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wwJFRcnXpgxYQAAAYVJREFUeNrt3FGuwiAQBVBZY/e/FvzSGEMTCrR06DmfxjyfUxguFk0vAADgdDnnXHo8pZRUB9AD9VgAAIDpG7fS5mrvcYCn9MAIf5978EkkAACcuGn7Bu+dUwCf5zglAOiBeiwAAMDlG7cjd/+dxgL0wLrnt/RLPTa+5AICAMBJYfvgHf+R2bzmte0FgKg9sPfEFgAAAJPVnDRwGgGASHwHFAAAFlTz4ZTfhAEgiqUXrJofdOO60OQaGKuYJ2DeWbMwfo1VzBMw74a/+C+Xo/3C9dRfNePWb9u2HHkMGitr9ZRSb1/9mj5hHkR/r///d+t7iVQH+Uq+smbGzTjGjnwlX8lX8hWAkKQeQiwTx7+AAuin6oF8ZfzLVwRtrKMHWuQ7rivdQdFE2urZWzN1R3DEJk1N5Cv5ypyTr0C+kiWmLPx3GViO4teZ+XU2WHlx1Xeu69/6mEAZKaDJV8YFIF9F6N9qLV9ZRwEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIDx3klPSzP33sjKAAAAAElFTkSuQmCC';

const FLOOR_HEIGHT = INC_H - HORIZON_H + HORIZON_HILL_H;

var colors = ['#F00', '#0F0', '#00F'];

const DINOSAUR_H = 22;
const DINOSAUR_W = 20;
const dinosaur = {
  x: 0,
  y: FLOOR_HEIGHT - DINOSAUR_H,
};

const dinoImageDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAAWCAYAAACVDJ0dAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4wwJFR4dSVZTmgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAKKSURBVHja7VvBbsMgDLWjHPJVPZJvhmO/qjd26CIxCsE2OE0WW0LaFHgG+9mA2dB7Dy1xzm0/xkZXDCEAVQxXF3eTdV13cb33CDeSidE3UvokDjRcJi4iwtZG4a7rGmOMsDVJUNyZ9O9Ug9dKClrz1cKtEfOs870F6bWcoiVa870aOa/mN02ZzQT/P0Aty3dmehOTu2d6rRRiuCZ6pH88HgAA8Hw+ix0a1YJ0P/5TTtvG1UpshkvChRruKLlbuRIAYF6WJb5eL2w4I3Ky2+/YWOpjuP24AO8yY4uwpVLk3ph0Tj0BRg3kEMIwnRy9c2NwpE6eOSnDVcDdIzvnPg0AmO9QCu8ZmNlhhE6S3hkAYFmW6JxD5uBIyEiGq4hbyvYtwm/fG7tELBCTRChGMOc7oFQnW+9UAeco4kSe4Q7GTUlOyfDMM3zMGrX/ewGyUilXJ1vvzMw+IxxuuINxuceZBvFRMM/yYunvDsN0UvR2lSw1qgmGq49LuFgOJeHZdE4gqzHvls9+vxmuEq7gmEIek+jFI4PtSJ1Th2MoCzFcJVwp8b9IQiy0I4j/oXcSOAaVHG64AqdTic8NkA4SYmXMx+U03806iU/WOzEdg9yzpuHq4lIILd0RiCRMyYbZWmutusYQAsVW2KN3JtykR10wjsRNIxydc5JLYYrLqQN/xQ7ee0yrOPnvEskfjwo2wOxVtcfeJb2w59csm5P1To1qAeZRJ1nMF3CBklUYGe7joehMdqhl9t4zfzaX2Lhsi+1NtVOWycV6554KgjTTaeOOwM9KaR9/J3JWOyhdbnFv7sqlVWwEBL96s/Ot9P+YcYDjj8TtJn6SYS5hh9KRpueYU7HBcFvv2Wk04A8GVyP3KvY3jQAAAABJRU5ErkJggg==';

let lastFrame = Date.now();
const horizonImage = getHorizonImage();
const dinosaurImage = getDinosaurImage();

const obstacleManager = new ObstacleManager();
const dinos = [new Dino(ctx), null, null, null, null, null];

/**
 * Listen for onButtonDown events and draw a 2x2 rectangle at the event site
 */
document.addEventListener('onButtonDown', function (event) {
  obstacleManager.addDefaultObstacle(new Obstacle(canvasXToPrimaryLayerX(event.detail.x), event.detail.y));
  const randomColor = '#' + Math.random().toString(16).slice(2, 3);
  const region = Math.min(Math.floor(event.detail.x / DINOSAUR_H), 5);
  if (!dinos[region] || dinos[region] === 'DEAD') {
    dinos[region] = new Dino(ctx, region * DINOSAUR_H + 2);

  }
  dinos[region].jump();
});

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(update);
});

function drawHorizon(elapsedTimeInFrame) {
  updateHorizonLocation(elapsedTimeInFrame);
  ctx.drawImage(horizonImage, horizonLocation, INC_H - horizonImage.height);
  ctx.drawImage(horizonImage, primaryLayerXToCanvasX(horizonImage.width),
    INC_H - horizonImage.height);
}

function updateHorizonLocation(elapsedTimeInFrame) {
  horizonLocation -= elapsedTimeInFrame * HORIZON_SPEED;
  horizonLocation = Math.floor(horizonLocation) % HORIZON_W;
}

function drawDinosaur(dinosaur) {
  ctx.drawImage(dinosaurImage, 0, 0, DINOSAUR_W, DINOSAUR_H,
    dinosaur.x, dinosaur.y, DINOSAUR_W, DINOSAUR_H);
}

function drawObstacles(obstacleManager) {
  ctx.fillStyle = colors[1];
  for (obstacle of obstacleManager.getDefaultObstacles()) {
    ctx.fillRect(primaryLayerXToCanvasX(obstacle.x), obstacle.y, obstacle.width, obstacle.height);
  }
}

function primaryLayerXToCanvasX(x) {
  x + horizonLocation;
}

function canvasXToPrimaryLayerX(x) {
  x - horizonLocation;
}

function update() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, INC_W, INC_H);

  const elapsedTimeInFrame = (Date.now() - lastFrame) / 1000;
  drawHorizon(elapsedTimeInFrame);
  drawObstacles(obstacleManager);
  lastFrame = Date.now();
  dinos.forEach(dino => dino && dino.update());

  requestAnimationFrame(update);
}

function getHorizonImage() {
  const horizonImage = new Image;
  horizonImage.src = horizonImageDataUri;
  horizonImage.height = HORIZON_H;
  horizonImage.width = HORIZON_W;
  return horizonImage;
}

function getDinosaurImage() {
  const dinoImage = new Image;
  dinoImage.src = dinoImageDataUri;
  return dinoImage;
}

