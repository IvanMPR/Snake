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

function snake(array) {
  array.forEach(id => field(id).classList.add('snake'));
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

function collisionDetector() {
  const [test] = helper.moves.slice(-1);
  console.log(test);
  if (document.querySelector('.collision-test')) {
    document
      .querySelector('.collision-test')
      .classList.remove('collision-test');
  }

  const next = test + helper.dir[helper.currentDir];
  console.log(next, ' next');
  field(next).classList.add('collision-test');
  // document.querySelector('.collision-test').classList.remove('collision-test')
}

function activateCollisionDetector() {
  const [test] = helper.moves.slice(-1);
  const next = test + helper.dir[helper.currentDir];
  field(next).classList.add('test');
}
// activateCollisionDetector();
function move(timeStamp) {
  setTimeout(() => {
    // console.log(Math.trunc(timeStamp));

    const first = helper.moves.shift();
    const [last] = helper.moves.slice(-1);
    // console.log(first, last);

    field(first).classList.remove('snake');
    helper.moves.push(last + helper.dir[helper.currentDir]);
    field(helper.moves[helper.moves.length - 1]).classList.add('snake');
    collisionDetector();
    requestAnimationFrame(move);
  }, 1000);
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
  snake(helper.moves);
  placeFood();
  requestAnimationFrame(move);
});
