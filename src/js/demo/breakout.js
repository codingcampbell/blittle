import * as color from 'color';

const brickColors = [
  color.RGB(0xff0000),
  color.RGB(0xff00ff),
  color.RGB(0x00ff00),
  color.RGB(0x00ffff),
  color.RGB(0xffff00)
];

const _createBrickGrid = function(screen, offsetX, offsetY, gridWidth, gridHeight, brickWidth, brickHeight, margin) {
  var x, y, grid = [];

  var totalWidth = (brickWidth + margin) * gridWidth - margin;
  var gridX = offsetX + (screen.width - totalWidth) / 2;
  var gridY = 0 + offsetY;

  for (y = 0; y < gridHeight; y += 1) {
    for (x = 0; x < gridWidth; x += 1) {
      grid.push({
        x: Math.floor(gridX + x * (brickWidth + margin)),
        y: Math.floor(gridY + y * (brickHeight + margin)),
        width: brickWidth,
        height: brickHeight,
        hits: 2
      });
    }
  }

  return grid;
};

const _centerRect = function(screen, rect) {
  if (rect.x === null) {
    rect.x = Math.floor((screen.width - rect.width) / 2);
  }

  if (rect.y === null) {
    rect.y = Math.floor((screen.height - rect.height) / 2);
  }

  return rect;
};

const _fillRect = function(colors, rect, warp) {
  var  x, y, rx = rect.x || 0, ry = rect.y || 0, tx = this.translation.x, ty = this.translation.y, sx = 0;
  for (y = 0; y < rect.height; y += 1) {
    for (x = 0; x < rect.width; x += 1) {
      if (warp) {
        sx = Math.sin(Date.now() * 0.01 + (ry + y)) * warp;
      }
      this.screen.setPixel(Math.floor(sx + tx + rx + x), Math.floor(ty + ry + y), colors[0], colors[1], colors[2], colors[3]);
    }
  }
}

/* Horizontal velocity is higher if the collision was near the ends of a rect.
* This returns -1 for far left, +/- 0.5 minimum for center, 1 for far right
*/
const _getBounceVelocity = function(x, rect) {
  var speed = (x - rect.width / 2) / (rect.width / 2);
  return Math.max(0.5, Math.abs(speed)) * (speed < 0 ? -1 : 1);
};

/* Returns {x, y}, where x is horizontal velocity of collision,
* y is -1 is rect1 is above rect2, or y is 1 if rect1 is below rect2.
* If there is no collision, null is returned.
*/
const _getCollision = function(rect1, rect2) {
  if (rect1.x + rect1.width >= rect2.x && rect1.x <= rect2.x + rect2.width) {
    if (rect1.y + rect1.height >= rect2.y && rect1.y <= rect2.y + rect2.height) {
      return {
        x: _getBounceVelocity(rect1.x + (rect1.width / 2) - rect2.x, rect2),
        y: rect1.y + rect1.height / 2 < rect2.y + rect2.height / 2 ? -1 : 1
      };
    }
  }

  return null;
};

const _rainbowColor = time => color.HSL(time * 0.002 % 1, 0.75, 0.5);

const _easeOut = t => (2 - t) * t;

const _spawnParticles = function(rect, time) {
  var x, y, particles = [], rainbow = _rainbowColor(time);
  for (y = 0; y < rect.height; y += 1) {
    for (x = 0; x < rect.width; x += 1) {
      particles.push({
        x: rect.x + x,
        y: rect.y + y,
        width: 1,
        height: 1,
        vx: Math.random(0.01, 0.1) * Math.sign(0.5 - Math.random()),
        vy: -Math.random(0.01, 0.1),
        color: rainbow,
        expiration: time + 1000 + Math.random() * 1000
      });
    }
  }

  return particles;
};

const _updateParticles = function(particles, time, delta) {
  var particleExpired = false;

  for (let p of particles) {
    if (time >= p.expiration) {
      particleExpired = true;
      continue;
    }

    p.x += p.vx * delta * 0.05;
    p.y += p.vy * delta * 0.05;
    p.vy += 0.002 * delta;
  }

  if (!particleExpired) {
    return particles;
  }

  return particles.filter(particle => time < particle.expiration);
};

const _createShakes = function(num, amount, time) {
  var j, shakes = [];
  for (j = 0; j < num; j += 1) {
    shakes.push({
      x: Math.random() * amount * Math.sign(0.5 - 0),
      y: Math.random() * amount * Math.sign(0.5 - 0),
      time: time + j * 32
    });
  }

  return shakes;
}

const _updateShakes = function(time) {
  this.shakes = this.shakes.filter(shake => time < shake.time);

  if (this.shakes.length) {
    this.translation.x = this.shakes[0].x
    this.translation.y = this.shakes[0].y
  } else {
    this.translation.x = 0;
    this.translation.y = 0;
  }
};

const states = {
  paused: 0,
  playing: 1
};

const stepHz = 16;
const ballXSpeed = 0.05;
const ballYSpeed = 0.05;

export default class Breakout {
  constructor(screen) {
    this.timeBuffer = 0;
    this.screen = screen;
    this.particles = [];
    this.shakeTime = 0;
    this.shakes = [];
    this.translation = { x: 0, y: 0 };
    this.paddle = _centerRect(this.screen, {
      x: null,
      y: this.screen.height - 10,
      width: 20,
      height: 4
    });
    this.reset();
  }

  reset() {
    this.bricks = _createBrickGrid(this.screen, 0, 10, 8, 3, 10, 4, 3);
    this.brickColor = brickColors[Math.floor(Math.random() * brickColors.length)];
    this.bricksDestroyed = 0;
    this.resetBall();
  }

  resetBall() {
    this.state = states.paused;
    this.tail = [];
    this.ball = _centerRect(this.screen, {
      x: null,
      y: null,
      vx: ballXSpeed * 0.75 * Math.sign(0.5 - Math.random()),
      vy: ballYSpeed,
      width: 4,
      height: 4
    });
  }

  onTouch(x, y) {
    if (this.state === states.paused) {
      this.state = states.playing;
    }
  }

  onMove(x, y) {
    this.paddle.x = Math.floor(Math.max(0, Math.min(this.screen.width - this.paddle.width, x - this.paddle.width / 2)));
  }

  step(time, delta) {
    if (this.particles.length) {
      this.particles = _updateParticles(this.particles, time, delta);
    }

    if (this.shakes.length) {
      _updateShakes.call(this, time);
    }

    if (this.state === states.paused) {
      return;
    }

    var rainbow = _rainbowColor(time);

    // Move ball
    this.ball.x += delta * this.ball.vx;
    this.ball.y += delta * this.ball.vy;

    // Detect horizontal bounce
    if (this.ball.vx > 0 && this.ball.x >= this.screen.width - this.ball.width) {
      this.ball.x = this.screen.width - this.ball.width;
      this.ball.vx *= -1;
    }
    if (this.ball.vx < 0 && this.ball.x <= 0) {
      this.ball.x = 0;
      this.ball.vx *= -1;
    }

    // Detect vertical bounce (from top)
    if (this.ball.vy < 0 && this.ball.y <= 0) {
      this.ball.y = 0;
      this.ball.vy *= -1;
    }

    // Detect paddle collision
    var collision = this.ball.vy > 0 && _getCollision(this.ball, this.paddle);
    if (collision) {
      this.ball.y = this.paddle.y - this.ball.height + this.ball.vy * delta;
      this.ball.vy *= -1;
      this.ball.vx = collision.x * ballYSpeed;
    }

    // Detect ball out of bounds
    if (this.ball.vy > 0 && this.ball.y >= this.screen.height - this.ball.height) {
      this.resetBall();
    }

    // Detect brick collision
    var brickCollided = false;
    for (let brick of this.bricks) {
      collision = _getCollision(this.ball, brick);
      if (!collision) {
        continue;
      }

      brickCollided = true;
      brick.hits -= 1;
      if (brick.hits === 0) {
        this.particles = this.particles.concat(_spawnParticles(brick, time));
        this.shakes = _createShakes(15, 3, time);
        this.shakeTime = time;
        this.bricksDestroyed += 1;
      }

      this.ball.vx = Math.abs(this.ball.vx) * (collision.x < 0 ? -1 : 1);
      this.ball.vy = Math.abs(this.ball.vy) * collision.y;
    }

    // Clean up dead bricks
    if (brickCollided) {
      this.bricks = this.bricks.filter(brick => brick.hits > 0);
      // 0 bricks left = reset the game
      if (this.bricks.length === 0) {
        this.reset();
      }
    }

    // Spawn tail every 2 frames
    if (!this.tail.length || time - this.tail[0].time >= delta * 2) {
      this.tail = [{
        x: this.ball.x,
        y: this.ball.y,
        width: this.ball.width,
        height: this.ball.height,
        time: time,
        color: rainbow
      }].concat(this.tail.filter(link => time - link.time < delta * (this.bricksDestroyed + 1) * 2));
    }
  }

  update(time, delta) {
    delta += this.timeBuffer;
    while (delta >= stepHz) {
      this.step(time - delta, stepHz);
      delta -= stepHz;
    }
    this.timeBuffer = delta;

    this.draw(time);
  }

  draw(time) {
    var rainbow = _rainbowColor(time);
    var shakeWarp = 0;
    if (!this.shakeTime || time - this.shakeTime > 1000) {
      this.shakeTime = 0;
    } else {
      shakeWarp = (1 - _easeOut((time - this.shakeTime) / 1000)) * 2;
    }

    // Clear
    _fillRect.call(this, shakeWarp ? color.HSL(shakeWarp / 2, 1, 0.25) : color.RGB(0x444444), this.screen);

    // Ball tail
    for (let link in this.tail) {
      if (link < 1) {
        continue;
      }
      _fillRect.call(this, this.tail[link].color, this.tail[link], 2);
    }

    // Bricks
    for (let brick of this.bricks) {
      _fillRect.call(this, brick.hits === 1 ? rainbow : this.brickColor, brick, shakeWarp);
    }

    // Paddle
    _fillRect.call(this, color.RGB(0xffffff), this.paddle, shakeWarp);

    // Ball
    _fillRect.call(this, rainbow, this.ball);

    // Particles
    for (let particle of this.particles) {
      _fillRect.call(this, rainbow, particle);
    }
  }
}
