import Screen from 'screen';
import Breakout from 'demo/breakout';
import Huerizon from 'demo/huerizon';
import Huegrid from 'demo/huegrid';

const screen = new Screen(128, 96);
screen.setScale(3);
screen.setPadding(3);
screen.appendTo(document.getElementById('canvas-container'));

var currentDemo = 0;
const demos = [Breakout, Huerizon, Huegrid].map(demo => new demo(screen));
const thumbnails = demos.map((_, index) => {
  var canvas = document.createElement('canvas');
  canvas.width = screen.width;
  canvas.height = screen.height;
  document.getElementById('thumbnails').appendChild(canvas);

  canvas.addEventListener('click', e => {
    currentDemo = index;
    e.preventDefault();
  });

  return canvas.getContext('2d');
});

var lastUpdate = null;
var firstRender = true;
var update = function(time) {
  requestAnimationFrame(update);
  if (!time) {
    return;
  }

  if (lastUpdate === null) {
    lastUpdate = time;
    return;
  }

  if (firstRender) {
    firstRender = false;
    for (let demoIndex in demos) {
      demos[demoIndex].update(time, time - lastUpdate);
      thumbnails[demoIndex].putImageData(screen.pixels, 0, 0);
    }
  } else {
    demos[currentDemo].update(time, time - lastUpdate);
    thumbnails[currentDemo].putImageData(screen.pixels, 0, 0);
    screen.render();
  }

  lastUpdate = time;
}

const translateEvent = function(e) {
  return [
    Math.floor((e.offsetX / screen.canvas.width) * screen.width),
    Math.floor((e.offsetY / screen.canvas.height) * screen.height)
  ];
}

screen.canvas.addEventListener('mousedown', function(e) {
  demos[currentDemo].onTouch.apply(demos[currentDemo], translateEvent(e));
});

screen.canvas.addEventListener('mousemove', function(e) {
  demos[currentDemo].onMove.apply(demos[currentDemo], translateEvent(e));
});

update();
