const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let interval;

function setup() {
    snake = new Snake();
    fruit = new Fruit();
    document.addEventListener('keydown', (e) => {
        snake.changeDirection(e.key);
    });
    interval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snake.update();
        snake.draw();
        fruit.draw();
        if (snake.eat(fruit)) {
            fruit.pickLocation();
        }
        if (snake.collide()) {
            clearInterval(interval);
            alert('Game Over!');
        }
    }, 100);
}

class Snake {
    constructor() {
        this.body = [{ x: 0, y: 0 }];
        this.direction = 'right';
    }

    draw() {
        ctx.fillStyle = 'green';
        this.body.forEach(part => {
            ctx.fillRect(part.x, part.y, scale, scale);
        });
    }

    update() {
        const head = { ...this.body[0] };
        switch (this.direction) {
            case 'right':
                head.x += scale;
                break;
            case 'left':
                head.x -= scale;
                break;
            case 'up':
                head.y -= scale;
                break;
            case 'down':
                head.y += scale;
                break;
        }
        this.body.unshift(head);
        this.body.pop();
    }

    changeDirection(key) {
        switch (key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }
    }

    eat(fruit) {
        const head = this.body[0];
        if (head.x === fruit.position.x && head.y === fruit.position.y) {
            this.body.push({});
            return true;
        }
        return false;
    }

    collide() {
        const head = this.body[0];
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            return true;
        }
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                return true;
            }
        }
        return false;
    }
}

class Fruit {
    constructor() {
        this.position = { x: 0, y: 0 };
        this.pickLocation();
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, scale, scale);
    }

    pickLocation() {
        this.position.x = Math.floor(Math.random() * columns) * scale;
        this.position.y = Math.floor(Math.random() * rows) * scale;
    }
}

setup();
