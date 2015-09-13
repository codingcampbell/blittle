import Screen from 'screen';
import Breakout from 'demo/breakout';

let screen = new Screen(128, 96);
screen.setScale(3);
screen.setPadding(3);
screen.appendTo(document.body);

let demo = new Breakout(screen);

var lastUpdate = null;
var update = function(time) {
  requestAnimationFrame(update);
  if (!time) {
    return;
  }

  if (lastUpdate === null) {
    lastUpdate = time;
    return;
  }

  demo.update(time, time - lastUpdate);
  lastUpdate = time;
  screen.render();
}

var translateEvent = function(e) {
  return [
    Math.floor((e.offsetX / screen.canvas.width) * screen.width),
    Math.floor((e.offsetY / screen.canvas.height) * screen.height)
  ];
}

if (demo.onTouch) {
  screen.canvas.addEventListener('mousedown', function(e) {
    demo.onTouch.apply(demo, translateEvent(e));
  });
}

if (demo.onMove) {
  screen.canvas.addEventListener('mousemove', function(e) {
    demo.onMove.apply(demo, translateEvent(e));
  });
}

update();
