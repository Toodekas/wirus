/**
 * Canvas Wrapper Class
 */
let canvas;
let bolls;
let loop;
let mouse;
let bool;
let mousex;
let mousey;
class Canvas {
    constructor(id) {
        this.id = id;
        this.canvas = document.getElementById(id);
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        window.addEventListener("resize", this.resizeCanvas.bind(this), false);
        window.addEventListener("mousemove", function (event) {
            mousex = event.clientX;
            mousey = event.clientY;
        });
    }
    getEl() {
        return this.canvas;
    }
    getContext() {
        return this.canvas.getContext("2d");
    }
    getWidth() {
        return this.canvas.width;
    }
    getHeight() {
        return this.canvas.height;
    }
    resizeCanvas() {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    }
    clearCanvas(context, canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        var w = canvas.width;
        canvas.width = 1;
        canvas.width = w;
    }
}
/**
 * Ball Wrapper Class
 */
class Ball {
    constructor(canvas, x, y, velX, velY, color, size, sick) {
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
        }
        else {
            this.img = "img/sicc.png";
        }
    }
    draw() {
        let context = this.canvas.getContext();
        let sicc = new Image();
        sicc.src = this.img;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.drawImage(sicc, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        context.fill();
    }
    random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    update(balls) {
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
        //mouse collision
        if (Math.sqrt(Math.pow(this.x - mousex, 2) + Math.pow(this.y - mousey, 2)) <=
            120) {
            this.velX = -this.velX;
            this.velY = -this.velY;
        }
        //colision with other balls
        for (let ball of balls) {
            if (ball != this) {
                var arv = this.random(30, 70);
                if (Math.sqrt(Math.pow(this.x - ball.x, 2) + Math.pow(this.y - ball.y, 2)) <=
                    this.size * 2 + arv) {
                    if ((ball.img == "img/puk.png" || this.img == "img/puk.png") &&
                        arv < 50) {
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
    get getX() {
        return this.x;
    }
    get getY() {
        return this.y;
    }
    get getSize() {
        return this.size;
    }
}
/**
 * Main Loop Class
 */
class Loop {
    constructor(canvas, ballGenerator) {
        this.canvas = canvas;
        this.ballGenerator = ballGenerator;
        this.canvas.addEventListener;
    }
    start() {
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
    update(ballsx) {
        this.ballGenerator = ballsx;
    }
}
class BallGenerator {
    constructor(canvas, numberOfBalls = 10) {
        this.balls = [];
        this.canvas = canvas;
    }
    combine(pallid) {
        for (let pall of pallid.getAll()) {
            this.add(pall);
        }
    }
    generate(numberOfBalls, bool) {
        //generates/adds all the balls to the ballgenerator
        for (let i = 0; i < numberOfBalls; i++) {
            let size = this.getRandomSize();
            /** init a new ball */
            let ball = new Ball(this.canvas, this.getRandomX(size), this.getRandomY(size), this.getRandomVelocity(), this.getRandomVelocity(), "hsl(116,100%,50%)", size, bool);
            //Fix for when two emojis spawn right on top of each other
            for (let bol of this.getAll()) {
                for (let bol2 of this.getAll()) {
                    while (Math.abs(bol.getX - bol2.getX) <=
                        bol.getSize + bol2.getSize + 30) {
                        bol = new Ball(this.canvas, this.getRandomX(size), this.getRandomY(size), this.getRandomVelocity(), this.getRandomVelocity(), "hsl(116,100%,50%)", 
                        //this.getRandomColor(), //instead of random color use green
                        size, false);
                        bol2 = new Ball(this.canvas, this.getRandomX(size), this.getRandomY(size), this.getRandomVelocity(), this.getRandomVelocity(), "hsl(116,100%,50%)", size, false);
                    }
                }
            }
            this.add(ball);
        }
        return this;
    }
    add(ball) {
        this.balls.push(ball);
    }
    getAll() {
        return this.balls;
    }
    getRandomColor() {
        let hue = Math.floor(Math.random() * 360);
        let pastel = "hsl(" + hue + ", 100%, 87.5%)";
        return pastel;
    }
    getRandomVelocity() {
        return this.random(1, 4) || this.random(-4, -1);
    }
    getRandomSize() {
        return this.random(30, 46);
    }
    getRandomX(size) {
        return this.random(size, this.canvas.getWidth() - size * 2);
    }
    getRandomY(size) {
        return this.random(size, this.canvas.getHeight() - size * 2);
    }
    random(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
function formSubmit2() {
    bool = true;
    formSubmit();
}
function formSubmit() {
    var num = Number(document.getElementById("lname").value);
    loop = new Loop(canvas, bolls.generate(num, bool));
    bool = false;
    loop.start();
}
function init() {
    canvas = new Canvas("created-canvas");
    bolls = new BallGenerator(canvas);
}
//# sourceMappingURL=index.js.map