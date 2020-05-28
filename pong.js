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
      player.pos.y = this._canvas.height / 2
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

    this.CHAR_PIXEL = 10
    this.CHARS = [
      '111101101101111', //0
      '010010010010010', //1
      '111001111100111', //2
      '111001111001111', //3
      '101101111001001', //4
      '111100111001111', //5
      '111100111101111', //6
      '111001001001001', //7 
      '111101111101111', //8
      '111101111001111'  //9
    ].map(str => {
      const canvas = document.createElement('canvas');
      canvsas.height = this.CHAR_PIXEL * 5;
      canvas.width = this.CHAR_PIXEL * 3;
      const context = canvas.getContext('2d');
      context.fillStyle = '#fff';
      str.split('').forEach((fill, i) => {
        if(fill === '1') {
          context.fillRect(
            (i % 3) * this.CHAR_PIXEL, 
            (i / 3 | 0) * this.CHAR_PIXEL, 
            this.CHAR_PIXEL,
            this.CHAR_PIXEL);
            // for every string in this.CHARS we created a new canvas
            // On each canvas we draw for everyone a white square
            // it should fill the canvas according to the matrix's numbers
        }
      });
      return canvas;
    });

    this.reset();
  }
  //adding collision between ball and player
  collide(player, ball)
  {
    if (player.left < ball.right && player.right > ball.left && 
        player.top < ball.bottom && player.bottom > ball.top) {
          const len = ball.vel.len;
          ball.vel.x = -ball.vel.x;
          ball.vel.y += 300 * (Math.random() - .5); // mix up the horizontal velocity when ball gets hit
          ball.vel.len = len * 1.10 // increading ball speed by 10% per paddle hit
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
      this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1) // ball moves in random position after start
      this.ball.vel.y = 300 * (Math.random() * 2 - 1); // ball moves in a random way after start
      this.ball.vel.len = 300; //applying consisten speed for the ball
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