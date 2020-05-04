/**
 * Canvas Wrapper Class
 */
var Canvas = /** @class */ (function () {
    function Canvas(id) {
        this.id = id;
        this.canvas = document.getElementById(id);
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        window.addEventListener("resize", this.resizeCanvas.bind(this), false);
        var canvas = document.getElementById("created-canvas");
    }
    Canvas.prototype.getEl = function () {
        return this.canvas;
    };
    Canvas.prototype.getContext = function () {
        return this.canvas.getContext("2d");
    };
    Canvas.prototype.getWidth = function () {
        return this.canvas.width;
    };
    Canvas.prototype.getHeight = function () {
        return this.canvas.height;
    };
    Canvas.prototype.resizeCanvas = function () {
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
    };
    return Canvas;
}());
/**
 * Ball Wrapper Class
 */
var Ball = /** @class */ (function () {
    function Ball(canvas, x, y, velX, velY, color, size, sick) {
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
    Ball.prototype.draw = function () {
        var context = this.canvas.getContext();
        var sicc = new Image();
        sicc.src = this.img;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.drawImage(sicc, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
        context.fill();
    };
    Ball.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    Ball.prototype.update = function (balls) {
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
        var mouse = new Mouse();
        mouse.addListener("mouseenter", function () { return console.log(mouse.position); });
        mouse.addListener("mousemove", function () {
            if (Math.sqrt(Math.pow(this.x - parseInt(mouse.position.split(",")[0]), 2) +
                Math.pow(this.y - parseInt(mouse.position.split(",")[1]), 2)) <= 120) {
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
        for (var _i = 0, balls_1 = balls; _i < balls_1.length; _i++) {
            var ball = balls_1[_i];
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
    };
    Object.defineProperty(Ball.prototype, "getX", {
        get: function () {
            return this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "getY", {
        get: function () {
            return this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ball.prototype, "getSize", {
        get: function () {
            return this.size;
        },
        enumerable: true,
        configurable: true
    });
    return Ball;
}());
/**
 * Main Loop Class
 */
var Loop = /** @class */ (function () {
    function Loop(canvas, ballGenerator) {
        this.canvas = canvas;
        this.ballGenerator = ballGenerator;
        this.canvas.addEventListener;
    }
    Loop.prototype.start = function () {
        this.canvas.getContext().fillStyle = "rgba(255,255,255,0.15)";
        this.canvas
            .getContext()
            .fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
        for (var _i = 0, _a = this.ballGenerator.getAll(); _i < _a.length; _i++) {
            var ball = _a[_i];
            //reads in the balls to do stuff
            //we check if the current item we're looking at has it's location in the list
            //if it does, then that means that there's collision happening
            ball.draw();
            ball.update(this.ballGenerator.getAll());
        }
        requestAnimationFrame(this.start.bind(this));
    };
    return Loop;
}());
var BallGenerator = /** @class */ (function () {
    function BallGenerator(canvas, numberOfBalls) {
        if (numberOfBalls === void 0) { numberOfBalls = 10; }
        this.balls = [];
        this.canvas = canvas;
        this.numberOfBalls = numberOfBalls;
    }
    BallGenerator.prototype.generate = function () {
        var size = this.getRandomSize();
        var ball = new Ball(this.canvas, this.getRandomX(size), this.getRandomY(size), this.getRandomVelocity(), this.getRandomVelocity(), "hsl(116,100%,50%)", 
        //this.getRandomColor(), //instead of random color use green
        size, true);
        this.add(ball);
        for (var i = 1; i < this.numberOfBalls; i++) {
            var size_1 = this.getRandomSize();
            /** init a new ball */
            var bool = false;
            var ball_1 = new Ball(this.canvas, this.getRandomX(size_1), this.getRandomY(size_1), this.getRandomVelocity(), this.getRandomVelocity(), "hsl(116,100%,50%)", 
            //this.getRandomColor(), //instead of random color use green
            size_1, bool);
            for (var _i = 0, _a = this.getAll(); _i < _a.length; _i++) {
                var bol = _a[_i];
                for (var _b = 0, _c = this.getAll(); _b < _c.length; _b++) {
                    var bol2 = _c[_b];
                    while (Math.abs(bol.getX - bol2.getX) <=
                        bol.getSize + bol2.getSize + 30) {
                        bol = new Ball(this.canvas, this.getRandomX(size_1), this.getRandomY(size_1), this.getRandomVelocity(), this.getRandomVelocity(), "hsl(116,100%,50%)", 
                        //this.getRandomColor(), //instead of random color use green
                        size_1, false);
                        bol2 = new Ball(this.canvas, this.getRandomX(size_1), this.getRandomY(size_1), this.getRandomVelocity(), this.getRandomVelocity(), "hsl(116,100%,50%)", 
                        //this.getRandomColor(), //instead of random color use green
                        size_1, false);
                    }
                }
            }
            //TODO: fix the ball random location issue because some balls keep bugging out
            this.add(ball_1);
        }
        return this;
    };
    BallGenerator.prototype.add = function (ball) {
        this.balls.push(ball);
    };
    BallGenerator.prototype.getAll = function () {
        return this.balls;
    };
    BallGenerator.prototype.getRandomColor = function () {
        var hue = Math.floor(Math.random() * 360);
        var pastel = "hsl(" + hue + ", 100%, 87.5%)";
        return pastel;
    };
    BallGenerator.prototype.getRandomVelocity = function () {
        return this.random(1, 4) || this.random(-4, -1);
    };
    BallGenerator.prototype.getRandomSize = function () {
        return this.random(30, 46);
    };
    BallGenerator.prototype.getRandomX = function (size) {
        return this.random(size, this.canvas.getWidth() - size * 2);
    };
    BallGenerator.prototype.getRandomY = function (size) {
        return this.random(size, this.canvas.getHeight() - size * 2);
    };
    BallGenerator.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    return BallGenerator;
}());
function formSubmit() {
    var canvas = new Canvas("created-canvas");
    var num = Number(document.getElementById("lname").value);
    var ballGenerator = new BallGenerator(canvas, num);
    var loop = new Loop(canvas, ballGenerator.generate());
    loop.start();
}
function init() {
    formSubmit();
}
// class file to find out mouse cordinates
var Mouse = /** @class */ (function () {
    function Mouse() {
        this.x = 0;
        this.y = 0;
        this.callbacks = {
            mouseenter: [],
            mousemove: [],
        };
    }
    Object.defineProperty(Mouse.prototype, "xPos", {
        get: function () {
            return this.x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mouse.prototype, "yPos", {
        get: function () {
            return this.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mouse.prototype, "position", {
        get: function () {
            return this.x + "," + this.y;
        },
        enumerable: true,
        configurable: true
    });
    Mouse.prototype.addListener = function (type, callback) {
        document.addEventListener(type, this); // Pass `this` as the second arg to keep the context correct
        this.callbacks[type].push(callback);
    };
    // `handleEvent` is part of the browser's `EventListener` API.
    // https://developer.mozilla.org/en-US/docs/Web/API/EventListener/handleEvent
    Mouse.prototype.handleEvent = function (event) {
        var isMousemove = event.type === "mousemove";
        var isMouseenter = event.type === "mouseenter";
        if (isMousemove || isMouseenter) {
            this.x = event.pageX;
            this.y = event.pageY;
        }
        this.callbacks[event.type].forEach(function (callback) {
            callback();
        });
    };
    return Mouse;
}());
//# sourceMappingURL=index.js.map