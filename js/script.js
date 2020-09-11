'use strict';

const score = document.querySelector('.score'),
    bestScore = document.querySelector('.best-score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    car = document.createElement('div');

car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const enemyCars = {
    0: 'transparent url("./img/enemy.png") center center/cover no-repeat',
    1: 'transparent url("./img/enemy2.png") center center/cover no-repeat',
    2: 'transparent url("./img/enemy3.png") center center/cover no-repeat',
    3: 'transparent url("./img/enemy4.png") center center/cover no-repeat',
    4: 'transparent url("./img/enemy5.png") center center/cover no-repeat',
    5: 'transparent url("./img/enemy6.png") center center/cover no-repeat',
    6: 'transparent url("./img/enemy7.png") center center/cover no-repeat'
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

if (localStorage.getItem('bestScore')) {
    bestScore.textContent = `Best score: ${localStorage.getItem('bestScore')}`;
} else {
    bestScore.textContent = 'Best score: 0';
    localStorage.setItem('bestScore', setting.score);
}

function getQuantityElements(heightElement) {
    return Math.floor(document.documentElement.clientHeight / heightElement + 1);
}

function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = `${i * 100}px`;
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = `${enemy.y}px`;
        enemy.style.background = enemyCars[Math.floor(Math.random() * Object.keys(enemyCars).length)];
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;

    gameArea.appendChild(car);
    car.style.left = `${gameArea.offsetWidth / 2 - car.offsetWidth / 2}px`;
    car.style.top = 'auto';
    car.style.bottom = '10px';

    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    requestAnimationFrame(playGame);
}

function playGame() {
    if (setting.start) {
        setting.score += setting.speed;
        score.textContent = `Score: ${setting.score}`;
        moveRoad();
        moveEnemy();

        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight - 5)) {
            setting.y += setting.speed;
        }

        car.style.left = `${setting.x}px`;
        car.style.top = `${setting.y}px`;
        requestAnimationFrame(playGame);
    }
}

function startRun(evt) {
    evt.preventDefault();
    keys[evt.key] = true;
}

function stopRun(evt) {
    evt.preventDefault();
    keys[evt.key] = false;
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(line => {
        line.y += setting.speed;
        line.style.top = `${line.y}px`;

        if (line.y >= document.documentElement.clientHeight) {
            line.y = -50;
        }
    });
}

function moveEnemy() {
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(item => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            setting.start = false;
            start.classList.remove('hide');
            start.style.top = `${score.offsetHeight}px`;
            setBestScore(setting.score);
        }
        item.y += setting.speed / 2;
        item.style.top = `${item.y}px`;

        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
            item.style.background = enemyCars[Math.floor(Math.random() * Object.keys(enemyCars).length)];
        }
    });
}

function setBestScore(score) {
    if (score > localStorage.getItem('bestScore')) {
        bestScore.textContent = `Best score: ${setting.score}`;
        localStorage.setItem('bestScore', setting.score);
    }
}