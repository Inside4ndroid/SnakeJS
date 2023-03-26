const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const snakeSize = 20; // Doubled the snake size
const snakeColor = '#FFFF00';
const appleImage = new Image();

let snake = [{x: 20, y: 20}];
let velocity = {x: 0, y: 0};
let food = {};
let score = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth - (window.innerWidth % snakeSize);
    canvas.height = window.innerHeight - (window.innerHeight % snakeSize);
    resetFood();
}

function resetFood() {
    food.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    food.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
}

function isSnakeCollidingWithItself() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function update() {
    const head = {x: snake[0].x + velocity.x, y: snake[0].y + velocity.y};

    if (head.x === food.x && head.y === food.y) {
        score++;
        resetFood();
    } else {
        snake.pop();
    }

    snake.unshift(head);

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || isSnakeCollidingWithItself()) {
        alert('Game over! Score: ' + score);
        snake = [{x: 20, y: 20}];
        score = 0;
        velocity = {x: 0, y: 0};
    }

    const baseSpeed = 100;
    const speedIncrement = 2;
    const minSpeed = 30;
    const newSpeed = Math.max(baseSpeed - snake.length * speedIncrement, minSpeed);
    setTimeout(update, newSpeed);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const appleSize = 20;

    ctx.drawImage(appleImage, food.x, food.y, appleSize, appleSize);

    ctx.fillStyle = snakeColor;
    for (const part of snake) {
        ctx.fillRect(part.x, part.y, snakeSize, snakeSize);
    }

    requestAnimationFrame(draw);
}

function changeDirection(e) {
    const arrows = {
        37: {x: -snakeSize, y: 0},
        38: {x: 0, y: -snakeSize},
        39: {x: snakeSize, y: 0},
        40: {x: 0, y: snakeSize},
    };

    if (arrows[e.keyCode]) {
        velocity = arrows[e.keyCode];
    }
}

function init() {
    appleImage.src = 'assets/apple.png';
    appleImage.onload = () => {
        window.addEventListener('keydown', changeDirection);
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        update();
        draw();
    }
}

init();