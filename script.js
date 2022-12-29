const grid = document.querySelector('.grid');
const BOARD_LENGTH = 15;
const test = document.querySelector('.test');
const fields = document.querySelectorAll('.field');
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
const field = id => document.getElementById(id);
// console.log(field(90));
function snake(array) {
  array.forEach(id => field(id).classList.add('snake'));
}
snake(helper.moves);
// let position = document.querySelector('.test').getBoundingClientRect().left;
// let screenWidth = document.querySelector('body').clientWidth - 500;
// const initialPosition = [90, 91, 92, 93, 94];

function move(timeStamp) {
  setTimeout(() => {
    // console.log(Math.trunc(timeStamp));

    const first = helper.moves.shift();
    const [last] = helper.moves.slice(-1);
    // console.log(first, last);

    field(first).classList.remove('snake');
    helper.moves.push(last + helper.dir[helper.currentDir]);

    field(helper.moves[helper.moves.length - 1]).classList.add('snake');
    requestAnimationFrame(move);
  }, 500);

  // if (position < screenWidth) {
  // console.log(position, screenWidth);
  // position++;
  // test.style.transform = `translateX(${position + 'px'})`;
  // }
}
// requestAnimationFrame(move);
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
