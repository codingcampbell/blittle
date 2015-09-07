import Screen from 'screen';
import Huerizon from 'demo/huerizon';

let screen = new Screen(128, 96);
screen.setScale(3);
screen.setPadding(3);
screen.appendTo(document.body);

let demo = new Huerizon(screen);

var update = function() {
  requestAnimationFrame(update);
  demo.update(Date.now());
  screen.render();
}

update();
