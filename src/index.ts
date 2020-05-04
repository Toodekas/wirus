/**
 * Canvas Wrapper Class
 */
class Canvas {
  protected canvas: HTMLCanvasElement;
  addEventListener: any;

  constructor(private id: string) {
    this.canvas = <HTMLCanvasElement>document.getElementById(id);
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    window.addEventListener("resize", this.resizeCanvas.bind(this), false);
    var canvas = document.getElementById("created-canvas");
  }

  public getEl(): HTMLCanvasElement {
    return <HTMLCanvasElement>this.canvas;
  }

  public getContext(): CanvasRenderingContext2D {
    return <CanvasRenderingContext2D>this.canvas.getContext("2d");
  }

  public getWidth(): number {
    return this.canvas.width;
  }

  public getHeight(): number {
    return this.canvas.height;
  }

  protected resizeCanvas(): void {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
  }
}

interface Loopable {
  draw(): void;
  update(balls: Ball[]): void;
}
/**
 * Ball Wrapper Class
 */
class Ball implements Loopable {
  protected canvas: Canvas;
  protected x: number;
  protected y: number;
  protected velX: number;
  protected velY: number;
  protected color: string;
  protected size: number;
  protected sick: boolean;
  protected img: string;
  protected counter: number;
  protected cursorX: number;
  protected cursorY: number;

  constructor(
    canvas: Canvas,
    x: number,
    y: number,
    velX: number,
    velY: number,
    color: string,
    size: number,
    sick: boolean
  ) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.sick = sick;
    if (sick == true) {
      this.img = "img/puk.png";
    } else {
      this.img = "img/sicc.png";
    }
  }

  public draw(): void {
    let context = this.canvas.getContext();
    let sicc = new Image();
    sicc.src = this.img;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);

    context.drawImage(
      sicc,
      this.x - this.size,
      this.y - this.size,
      this.size * 2,
      this.size * 2
    );
    context.fill();
  }
  protected random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  public update(balls: Ball[]): void {
    //colision with wall
    if (this.x + this.size >= this.canvas.getWidth()) {
      this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
      this.velX = -this.velX;
    }

    if (this.y + this.size >= this.canvas.getHeight()) {
      this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
      this.velY = -this.velY;
    }
    //collision with mouse
    //TODO: fix mouse event
    const mouse = new Mouse();
    mouse.addListener("mouseenter", () => console.log(mouse.position));

    mouse.addListener("mousemove", function () {
      if (
        Math.sqrt(
          Math.pow(this.x - parseInt(mouse.position.split(",")[0]), 2) +
            Math.pow(this.y - parseInt(mouse.position.split(",")[1]), 2)
        ) <= 120
      ) {
        this.velX = -this.velX;
        this.velY = -this.velY;
      }
    });
    /*
    if (
      Math.sqrt(
        Math.pow(this.x - mouselocation.split(",")[0], 2) +
          Math.pow(this.y - mouselocation.split(",")[1], 2)
      ) <= 120
    ) {
      this.velX = -this.velX;
      this.velY = -this.velY;
    }
    */
    //colision with other balls
    for (let ball of balls) {
      if (ball != this) {
        var arv = this.random(30, 70);
        if (
          Math.sqrt(
            Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)
          ) <=
          this.size * 2 + arv
        ) {
          if (
            (ball.img == "img/puk.png" || this.img == "img/puk.png") &&
            arv < 50
          ) {
            this.img = "img/puk.png";
            ball.img = "img/puk.png";
          }

          ball.velX = -ball.velX;
          ball.velY = -ball.velY;
        }
      }
    }
    this.x += this.velX;
    this.y += this.velY;
  }

  get getX(): number {
    return this.x;
  }
  get getY(): number {
    return this.y;
  }
  get getSize(): number {
    return this.size;
  }
}

/**
 * Main Loop Class
 */
class Loop {
  protected canvas: Canvas;
  protected ballGenerator: BallGenerator;
  protected mouseloc: number[];

  constructor(canvas: Canvas, ballGenerator: BallGenerator) {
    this.canvas = canvas;
    this.ballGenerator = ballGenerator;
    this.canvas.addEventListener;
  }

  public start(): void {
    this.canvas.getContext().fillStyle = "rgba(255,255,255,0.15)";
    this.canvas
      .getContext()
      .fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    for (let ball of this.ballGenerator.getAll()) {
      //reads in the balls to do stuff
      //we check if the current item we're looking at has it's location in the list
      //if it does, then that means that there's collision happening

      ball.draw();
      ball.update(this.ballGenerator.getAll());
    }

    requestAnimationFrame(this.start.bind(this));
  }
}

class BallGenerator {
  protected canvas: Canvas;
  protected balls: Ball[] = [];
  protected numberOfBalls: number;

  constructor(canvas: Canvas, numberOfBalls: number = 10) {
    this.canvas = canvas;
    this.numberOfBalls = numberOfBalls;
  }

  public generate(): BallGenerator {
    let size: number = this.getRandomSize();

    let ball = new Ball(
      this.canvas,
      this.getRandomX(size),
      this.getRandomY(size),
      this.getRandomVelocity(),
      this.getRandomVelocity(),
      "hsl(116,100%,50%)",
      //this.getRandomColor(), //instead of random color use green
      size,
      true
    );
    this.add(ball);
    for (let i = 1; i < this.numberOfBalls; i++) {
      let size: number = this.getRandomSize();
      /** init a new ball */
      let bool = false;
      let ball = new Ball(
        this.canvas,
        this.getRandomX(size),
        this.getRandomY(size),
        this.getRandomVelocity(),
        this.getRandomVelocity(),
        "hsl(116,100%,50%)",
        //this.getRandomColor(), //instead of random color use green
        size,
        bool
      );

      for (let bol of this.getAll()) {
        for (let bol2 of this.getAll()) {
          while (
            Math.abs(bol.getX - bol2.getX) <=
            bol.getSize + bol2.getSize + 30
          ) {
            bol = new Ball(
              this.canvas,
              this.getRandomX(size),
              this.getRandomY(size),
              this.getRandomVelocity(),
              this.getRandomVelocity(),
              "hsl(116,100%,50%)",
              //this.getRandomColor(), //instead of random color use green
              size,
              false
            );
            bol2 = new Ball(
              this.canvas,
              this.getRandomX(size),
              this.getRandomY(size),
              this.getRandomVelocity(),
              this.getRandomVelocity(),
              "hsl(116,100%,50%)",
              //this.getRandomColor(), //instead of random color use green
              size,
              false
            );
          }
        }
      }

      //TODO: fix the ball random location issue because some balls keep bugging out
      this.add(ball);
    }

    return this;
  }

  protected add(ball: Ball): void {
    this.balls.push(ball);
  }

  public getAll(): Ball[] {
    return this.balls;
  }

  protected getRandomColor(): string {
    let hue = Math.floor(Math.random() * 360);
    let pastel = "hsl(" + hue + ", 100%, 87.5%)";
    return pastel;
  }

  protected getRandomVelocity(): number {
    return this.random(1, 4) || this.random(-4, -1);
  }

  protected getRandomSize(): number {
    return this.random(30, 46);
  }

  protected getRandomX(size: number): number {
    return this.random(size, this.canvas.getWidth() - size * 2);
  }

  protected getRandomY(size: number): number {
    return this.random(size, this.canvas.getHeight() - size * 2);
  }

  protected random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

function formSubmit() {
  let canvas = new Canvas("created-canvas");
  var num = Number(
    (<HTMLInputElement>(<unknown>document.getElementById("lname"))).value
  );

  let ballGenerator = new BallGenerator(canvas, num);
  let loop = new Loop(canvas, ballGenerator.generate());
  loop.start();
}

function init(): void {
  formSubmit();
}

// class file to find out mouse cordinates
class Mouse {
  x: number;
  y: number;
  callbacks: { mouseenter: any[]; mousemove: any[] };
  constructor() {
    this.x = 0;
    this.y = 0;
    this.callbacks = {
      mouseenter: [],
      mousemove: [],
    };
  }

  get xPos() {
    return this.x;
  }

  get yPos() {
    return this.y;
  }

  get position() {
    return `${this.x},${this.y}`;
  }

  addListener(type, callback) {
    document.addEventListener(type, this); // Pass `this` as the second arg to keep the context correct
    this.callbacks[type].push(callback);
  }

  // `handleEvent` is part of the browser's `EventListener` API.
  // https://developer.mozilla.org/en-US/docs/Web/API/EventListener/handleEvent
  handleEvent(event) {
    const isMousemove = event.type === "mousemove";
    const isMouseenter = event.type === "mouseenter";

    if (isMousemove || isMouseenter) {
      this.x = event.pageX;
      this.y = event.pageY;
    }

    this.callbacks[event.type].forEach((callback) => {
      callback();
    });
  }
}
