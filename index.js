(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

'use strict';

module.exports = require('./lib/anypixel');

},{"./lib/anypixel":2}],2:[function(require,module,exports){
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

'use strict';

module.exports.config = require('./config');
module.exports.canvas = require('./canvas');
module.exports.events = require('./events');
module.exports.events.setStateListenerOn(document);

},{"./canvas":3,"./config":4,"./events":5}],3:[function(require,module,exports){
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

'use strict';

var config = require('./config');
var canvas = module.exports = {};

var domCanvas = document.getElementById(config.canvasId);

domCanvas.width = config.width;
domCanvas.height = config.height;

/**
 * Returns the 2D canvas context
 */
canvas.getContext2D = function getContext2D() {
	return domCanvas.getContext('2d');
}

/**
 * Returns the 3D canvas context
 */
canvas.getContext3D = function getContext3D() {
	return domCanvas.getContext('webgl', {preserveDrawingBuffer: true});
}
},{"./config":4}],4:[function(require,module,exports){
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

'use strict';

/**
 * Expose some configuration data. The user can overwrite this if their setup is different.
 */
var config = module.exports = {};

config.canvasId = 'button-canvas';
config.width = 140;
config.height = 42;
},{}],5:[function(require,module,exports){
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

'use strict';

/**
 * Listen for the 'buttonStates' event from a DOM target and emit onButtonDown / Up events
 * depending on the reported button state
 */
var events = module.exports = {};

events.setStateListenerOn = function setStateListenerOn(target) {
		
	if (target.anypixelListener) {
		return;
	}
	
	target.anypixelListener = true;

	target.addEventListener('buttonStates', function(data) {
		data.detail.forEach(function(button) {
			var x = button.p.x;
			var y = button.p.y;
			var state = button.s;
			var event = state === 1 ? 'onButtonDown' : 'onButtonUp';
			var key = x + ':' + y;

			if (state === 1) {
				events.pushedButtons[key] = {x: x, y: y};
			} else {
				delete events.pushedButtons[key];
			}
			
			target.dispatchEvent(new CustomEvent(event, {detail: {x: x, y: y}}));
		});
	});
}

/**
 * A map of currently-pushed buttons, provided for utility
 */
events.pushedButtons = {};

},{}],6:[function(require,module,exports){
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

let lastFrame = Date.now();
let delta;

function update() {
  const elapsedTimeInFrame = (Date.now() - lastFrame) / 1000;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, INC_W, INC_H);

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

},{"anypixel":1}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy5udm0vdmVyc2lvbnMvbm9kZS92MTAuMTUuMC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm5vZGVfbW9kdWxlcy9hbnlwaXhlbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9hbnlwaXhlbC9saWIvYW55cGl4ZWwuanMiLCJub2RlX21vZHVsZXMvYW55cGl4ZWwvbGliL2NhbnZhcy5qcyIsIm5vZGVfbW9kdWxlcy9hbnlwaXhlbC9saWIvY29uZmlnLmpzIiwibm9kZV9tb2R1bGVzL2FueXBpeGVsL2xpYi9ldmVudHMuanMiLCJzcmMvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL2xpY2Vuc2UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9saWIvYW55cGl4ZWwnKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMuY29uZmlnID0gcmVxdWlyZSgnLi9jb25maWcnKTtcbm1vZHVsZS5leHBvcnRzLmNhbnZhcyA9IHJlcXVpcmUoJy4vY2FudmFzJyk7XG5tb2R1bGUuZXhwb3J0cy5ldmVudHMgPSByZXF1aXJlKCcuL2V2ZW50cycpO1xubW9kdWxlLmV4cG9ydHMuZXZlbnRzLnNldFN0YXRlTGlzdGVuZXJPbihkb2N1bWVudCk7XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL2xpY2Vuc2UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBjb25maWcgPSByZXF1aXJlKCcuL2NvbmZpZycpO1xudmFyIGNhbnZhcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnZhciBkb21DYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb25maWcuY2FudmFzSWQpO1xuXG5kb21DYW52YXMud2lkdGggPSBjb25maWcud2lkdGg7XG5kb21DYW52YXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSAyRCBjYW52YXMgY29udGV4dFxuICovXG5jYW52YXMuZ2V0Q29udGV4dDJEID0gZnVuY3Rpb24gZ2V0Q29udGV4dDJEKCkge1xuXHRyZXR1cm4gZG9tQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgM0QgY2FudmFzIGNvbnRleHRcbiAqL1xuY2FudmFzLmdldENvbnRleHQzRCA9IGZ1bmN0aW9uIGdldENvbnRleHQzRCgpIHtcblx0cmV0dXJuIGRvbUNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcsIHtwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWV9KTtcbn0iLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL2xpY2Vuc2UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgbGljZW5zZS5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogRXhwb3NlIHNvbWUgY29uZmlndXJhdGlvbiBkYXRhLiBUaGUgdXNlciBjYW4gb3ZlcndyaXRlIHRoaXMgaWYgdGhlaXIgc2V0dXAgaXMgZGlmZmVyZW50LlxuICovXG52YXIgY29uZmlnID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuY29uZmlnLmNhbnZhc0lkID0gJ2J1dHRvbi1jYW52YXMnO1xuY29uZmlnLndpZHRoID0gMTQwO1xuY29uZmlnLmhlaWdodCA9IDQyOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqIFxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBMaXN0ZW4gZm9yIHRoZSAnYnV0dG9uU3RhdGVzJyBldmVudCBmcm9tIGEgRE9NIHRhcmdldCBhbmQgZW1pdCBvbkJ1dHRvbkRvd24gLyBVcCBldmVudHNcbiAqIGRlcGVuZGluZyBvbiB0aGUgcmVwb3J0ZWQgYnV0dG9uIHN0YXRlXG4gKi9cbnZhciBldmVudHMgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5ldmVudHMuc2V0U3RhdGVMaXN0ZW5lck9uID0gZnVuY3Rpb24gc2V0U3RhdGVMaXN0ZW5lck9uKHRhcmdldCkge1xuXHRcdFxuXHRpZiAodGFyZ2V0LmFueXBpeGVsTGlzdGVuZXIpIHtcblx0XHRyZXR1cm47XG5cdH1cblx0XG5cdHRhcmdldC5hbnlwaXhlbExpc3RlbmVyID0gdHJ1ZTtcblxuXHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcignYnV0dG9uU3RhdGVzJywgZnVuY3Rpb24oZGF0YSkge1xuXHRcdGRhdGEuZGV0YWlsLmZvckVhY2goZnVuY3Rpb24oYnV0dG9uKSB7XG5cdFx0XHR2YXIgeCA9IGJ1dHRvbi5wLng7XG5cdFx0XHR2YXIgeSA9IGJ1dHRvbi5wLnk7XG5cdFx0XHR2YXIgc3RhdGUgPSBidXR0b24ucztcblx0XHRcdHZhciBldmVudCA9IHN0YXRlID09PSAxID8gJ29uQnV0dG9uRG93bicgOiAnb25CdXR0b25VcCc7XG5cdFx0XHR2YXIga2V5ID0geCArICc6JyArIHk7XG5cblx0XHRcdGlmIChzdGF0ZSA9PT0gMSkge1xuXHRcdFx0XHRldmVudHMucHVzaGVkQnV0dG9uc1trZXldID0ge3g6IHgsIHk6IHl9O1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVsZXRlIGV2ZW50cy5wdXNoZWRCdXR0b25zW2tleV07XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudCwge2RldGFpbDoge3g6IHgsIHk6IHl9fSkpO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxuLyoqXG4gKiBBIG1hcCBvZiBjdXJyZW50bHktcHVzaGVkIGJ1dHRvbnMsIHByb3ZpZGVkIGZvciB1dGlsaXR5XG4gKi9cbmV2ZW50cy5wdXNoZWRCdXR0b25zID0ge307XG4iLCIvKipcbiAqIENvcHlyaWdodCAyMDE2IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvbGljZW5zZS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBsaWNlbnNlLlxuICovXG5cbnZhciBhbnlwaXhlbCA9IHJlcXVpcmUoJ2FueXBpeGVsJyk7XG52YXIgY3R4ID0gYW55cGl4ZWwuY2FudmFzLmdldENvbnRleHQyRCgpO1xuXG5jb25zdCBJTkNfVyA9IGFueXBpeGVsLmNvbmZpZy53aWR0aDtcbmNvbnN0IElOQ19IID0gYW55cGl4ZWwuY29uZmlnLmhlaWdodDtcblxuY29uc3QgSE9SSVpPTl9XID0gMTIwMDtcbmNvbnN0IEhPUklaT05fSCA9IDEyO1xuY29uc3QgSE9SSVpPTl9TUEVFRCA9IDQ7XG5sZXQgaG9yaXpvbkxvY2F0aW9uID0gMDtcbmNvbnN0IGhvcml6b25JbWFnZURhdGFVcmkgPSAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUJMQUFBQUFTQ0FZQUFBQkx1aWM1QUFBQUJtSkxSMFFBL3dEL0FQK2d2YWVUQUFBQUNYQklXWE1BQUM0akFBQXVJd0Y0cFQ5MkFBQUFCM1JKVFVVSDR3d0pGUmNuWHBneFlRQUFBWVZKUkVGVWVOcnQzRkd1d2lBUUJWQlpZL2UvRnZ6U0dFTVRDclIwNkRtZnhqeWZVeGd1RmswdkFBRGdkRG5uWEhvOHBaUlVCOUFEOVZnQUFJRHBHN2ZTNW1ydmNZQ245TUFJZjU5NzhFa2tBQUNjdUduN0J1K2RVd0NmNXpnbEFPaUJlaXdBQU1EbEc3Y2pkLytkeGdMMHdMcm50L1JMUFRhKzVBSUNBTUJKWWZ2Z0hmK1IyYnptdGUwRmdLZzlzUGZFRmdBQUFKUFZuRFJ3R2dHQVNId0hGQUFBRmxUejRaVGZoQUVnaXFVWHJKb2ZkT082ME9RYUdLdVlKMkRlV2JNd2ZvMVZ6Qk13NzRhLytDK1hvLzNDOWRSZk5lUFdiOXUySEhrTUdpdHI5WlJTYjEvOW1qNWhIa1Ivci8vL2QrdDdpVlFIK1VxK3NtYkd6VGpHam53bFg4bFg4aFdBa0tRZVFpd1R4NytBQXVpbjZvRjhaZnpMVndSdHJLTUhXdVE3cml2ZFFkRkUydXJaV3pOMVIzREVKazFONUN2NXlweVRyMEMra2lXbUxQeDNHVmlPNHRlWitYVTJXSGx4MVhldTY5LzZtRUFaS2FESlY4WUZJRjlGNk45cUxWOVpSd0VBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBSUR4M2tsUFN6UDMzc2pLQUFBQUFFbEZUa1N1UW1DQyc7XG5cbnZhciBjb2xvcnMgPSBbJyNGMDAnLCAnIzBGMCcsICcjMDBGJ107XG5cbmNvbnN0IGRpbm9zYXVyID0ge1xuICB4OiAwLFxuICB5OiBJTkNfSCAtIEhPUklaT05fSCxcbn07XG5cbi8qKlxuICogTGlzdGVuIGZvciBvbkJ1dHRvbkRvd24gZXZlbnRzIGFuZCBkcmF3IGEgMngyIHJlY3RhbmdsZSBhdCB0aGUgZXZlbnQgc2l0ZVxuICovXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdvbkJ1dHRvbkRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgZGlub3NhdXIueCsrO1xufSk7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xufSk7XG5cbmNvbnN0IGhvcml6b25JbWFnZSA9IGdldEhvcml6b25JbWFnZSgpO1xuXG5mdW5jdGlvbiBkcmF3SG9yaXpvbihlbGFwc2VkVGltZUluRnJhbWUpIHtcbiAgdXBkYXRlSG9yaXpvbkxvY2F0aW9uKGVsYXBzZWRUaW1lSW5GcmFtZSk7XG4gIGN0eC5kcmF3SW1hZ2UoaG9yaXpvbkltYWdlLCBob3Jpem9uTG9jYXRpb24sIElOQ19IIC0gaG9yaXpvbkltYWdlLmhlaWdodCk7XG4gIGN0eC5kcmF3SW1hZ2UoaG9yaXpvbkltYWdlLCBob3Jpem9uTG9jYXRpb24gKyBob3Jpem9uSW1hZ2Uud2lkdGgsXG4gICAgICBJTkNfSCAtIGhvcml6b25JbWFnZS5oZWlnaHQpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVIb3Jpem9uTG9jYXRpb24oZWxhcHNlZFRpbWVJbkZyYW1lKSB7XG4gIGhvcml6b25Mb2NhdGlvbiAtPSBlbGFwc2VkVGltZUluRnJhbWUgKiBIT1JJWk9OX1NQRUVEO1xuICBob3Jpem9uTG9jYXRpb24gPSBNYXRoLmZsb29yKGhvcml6b25Mb2NhdGlvbikgJSBIT1JJWk9OX1c7XG59XG5cbmZ1bmN0aW9uIGRyYXdEaW5vc2F1cihkaW5vc2F1cikge1xuICBjdHguZmlsbFN0eWxlID0gY29sb3JzWzFdO1xuICBjdHguZmlsbFJlY3QoZGlub3NhdXIueCwgZGlub3NhdXIueSwgNCwgNCk7XG59XG5cbmxldCBsYXN0RnJhbWUgPSBEYXRlLm5vdygpO1xubGV0IGRlbHRhO1xuXG5mdW5jdGlvbiB1cGRhdGUoKSB7XG4gIGNvbnN0IGVsYXBzZWRUaW1lSW5GcmFtZSA9IChEYXRlLm5vdygpIC0gbGFzdEZyYW1lKSAvIDEwMDA7XG4gIGN0eC5maWxsU3R5bGUgPSAnIzAwMCc7XG4gIGN0eC5maWxsUmVjdCgwLCAwLCBJTkNfVywgSU5DX0gpO1xuXG4gIGRyYXdIb3Jpem9uKGVsYXBzZWRUaW1lSW5GcmFtZSk7XG4gIGRyYXdEaW5vc2F1cihkaW5vc2F1cik7XG4gIGxhc3RGcmFtZSA9IERhdGUubm93KCk7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xufVxuXG5mdW5jdGlvbiBnZXRIb3Jpem9uSW1hZ2UoKSB7XG4gIGNvbnN0IGhvcml6b25JbWFnZSA9IG5ldyBJbWFnZTtcbiAgaG9yaXpvbkltYWdlLnNyYyA9IGhvcml6b25JbWFnZURhdGFVcmk7XG4gIGhvcml6b25JbWFnZS5oZWlnaHQgPSBIT1JJWk9OX0g7XG4gIGhvcml6b25JbWFnZS53aWR0aCA9IEhPUklaT05fVztcbiAgcmV0dXJuIGhvcml6b25JbWFnZTtcbn1cbiJdfQ==
