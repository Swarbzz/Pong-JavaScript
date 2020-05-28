class Vec
{
  constructor(x = 0, y = 0)
  {
    this.x = x;
    this.y = y;
  }
  get len()
  {
    return Math.sqrt(this.x * this.x + this.y * this.y); //calculate the hypotenuse of a triangle
  }
  set len(value)
  {
    const fact = value / this.len;
    this.x *= fact;
    this.y *= fact;
  }
}

class Rect
{
  constructor(w, h)
  {
    this.pos = new Vec;
    this.size = new Vec(w, h);
  }
  get left()
  {
    return this.pos.x - this.size.x / 2;
  }
  get right()
  {
    return this.pos.x + this.size.x / 2;
  }
  get top()
  {
    return this.pos.y - this.size.y / 2;
  }
  get bottom()
  {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect
{
  constructor()
  {
    super(10, 10);
    this.vel = new Vec;
  }
}

//adding player
class Player extends Rect
{
  constructor()
  {
    super(20, 100);
    this.score = 0;
  }
}

class Pong
{
  constructor(canvas)
  {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');

    this.ball = new Ball;

    //adding 2 new players into an array
    this.players = [
      new Player,
      new Player
    ]

    //adding player to the left
    this.players[0].pos.x = 40;
    //adding player to the right
    this.players[1].pos.x = this._canvas.width - 40;
    //adding both players to the middle 
    this.players.forEach(player => { 
      player.pos.y = this._canvas.height /2
    });


    let lastTime;
    const callback = (millis) => {
      if (lastTime) {
        this.update((millis - lastTime) / 1000);
      }
      lastTime = millis;
      requestAnimationFrame(callback);
    };
    callback(); 

    this.reset();
  }
  //adding collision between ball and player
  collide(player, ball)
  {
    if (player.left < ball.right && player.right > ball.left && 
        player.top < ball.bottom && player.bottom > ball.top) {
          ball.vel.x = -ball.vel.x;
        }
  }
  draw()
  {
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, 
      this._canvas.clientWidth, this._canvas.height);

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));
  }
  drawRect(rect)
  {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.left, rect.top, 
                          rect.size.x, rect.size.y);
  }
  reset () 
  {
    //ball position
    this.ball.pos.x = this._canvas.width /2;
    this.ball.pos.y = this._canvas.height /2;
    // speed of the ball
    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }
  start() //if the ball is not moving, then move it
  {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      this.ball.vel.x = 200 * (Math.random() > .5 ? 1 : -1) // ball moves in random position after start
      this.ball.vel.y = 200 * (Math.random() * 2 - 1); // ball moves in a random way after start
      this.ball.vel.len = 200; //applying consisten speed for the ball
    }
  }
  update(dt) 
  {
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;
  
    //adding boundries
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      // adding scoring 
      const playerId = this.ball.vel.x < 0 | 0;
      this.players[playerId].score ++;
      this.reset()
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }

    //player 2 follows the ball
    this.players[1].pos.y = this.ball.pos.y;

    //testing collision
    this.players.forEach(player => this.collide(player, this.ball));

    this.draw();
  }
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

//player 1 with mouse controls
canvas.addEventListener('mousemove', event => {
  pong.players[0].pos.y = event.offsetY;
});
//start the game by clicking the left mouse button
canvas.addEventListener('click', event => {
  pong.start();
});