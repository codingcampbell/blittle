import Screen from 'screen';
import Huegrid from 'demo/huegrid';

let screen = new Screen(128, 96);
screen.setScale(3);
screen.setPadding(3);
screen.appendTo(document.body);

let demo = new Huegrid(screen);

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

update();
