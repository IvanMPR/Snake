const grid = document.querySelector('.grid');
const button = document.querySelector('.btn');
const BOARD_LENGTH = 15;

const helper = {
  moves: [90, 91, 92],
  dir: {
    right: 1,
    left: -1,
    up: -BOARD_LENGTH,
    down: BOARD_LENGTH,
  },
  currentDir: 'right',
  points: 0,
};

// helper fn
function createBoard() {
  let html = '';
  // square board so length * length
  for (let i = 0; i < BOARD_LENGTH * BOARD_LENGTH; i++) {
    html += `<div class="field" data-fieldId="${i}" id="${i}"></div>`;
  }
  grid.insertAdjacentHTML('beforeend', html.trim());
}
createBoard();

// helper fn to avoid typing document.getElementById...
const field = id => document.getElementById(id);

function drawSnake() {
  helper.moves.forEach(id => field(id).classList.add('snake'));
}
function feedSnake() {
  const [last] = helper.moves.slice(-1);
  const food = document.querySelector('.food');
  if (last === Number(food.getAttribute('id'))) {
    console.log('hit');

    placeFood();

    helper.moves.push(Number(food.getAttribute('id')));

    helper.points += 100;
  }
}

function placeFood() {
  const fields = Array.from(document.querySelectorAll('.field'))
    .filter(el => !el.classList.contains('snake'))
    .map(el => Number(el.getAttribute('id')));

  const snakeLength = helper.moves.length;
  const availableLength = fields.length - snakeLength;
  const randomNum = () => Math.floor(Math.random() * availableLength);

  if (document.querySelector('.food')) {
    document.querySelector('.food').classList.remove('food');
  }
  field(randomNum()).classList.add('food');
}
function collisionCheck() {
  const [last] = helper.moves.slice(-1);
}

function move(timeStamp) {
  // document.querySelectorAll('.field').classList.remove('snake', 'food');
  setTimeout(() => {
    // console.log(Math.trunc(timeStamp));

    const first = helper.moves.shift();
    const [last] = helper.moves.slice(-1);
    // console.log(first, last);

    field(first).classList.remove('snake');
    helper.moves.push(last + helper.dir[helper.currentDir]);
    field(helper.moves[helper.moves.length - 1]).classList.add('snake');

    feedSnake();
    requestAnimationFrame(move);
  }, 500);
}

function moveUp(e) {
  if (e.key !== 'ArrowUp' || helper.currentDir === 'down') return;
  helper.currentDir = 'up';
}
function moveDown(e) {
  if (e.key !== 'ArrowDown' || helper.currentDir === 'up') return;
  helper.currentDir = 'down';
}

function moveLeft(e) {
  if (e.key !== 'ArrowLeft' || helper.currentDir === 'right') return;
  helper.currentDir = 'left';
}
function moveRight(e) {
  if (e.key !== 'ArrowRight' || helper.currentDir === 'left') return;
  helper.currentDir = 'right';
}

addEventListener('keydown', moveUp);
addEventListener('keydown', moveDown);
addEventListener('keydown', moveLeft);
addEventListener('keydown', moveRight);

button.addEventListener('click', () => {
  drawSnake();
  placeFood();
  feedSnake();
  requestAnimationFrame(move);
});
