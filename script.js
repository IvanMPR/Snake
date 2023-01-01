const grid = document.querySelector('.grid');
const button = document.querySelector('.btn');
const BOARD_LENGTH = 15;

const helper = {
  moves: [90, 91, 92, 93, 94, 95],
  dir: {
    right: 1,
    left: -1,
    up: -BOARD_LENGTH,
    down: BOARD_LENGTH,
  },
  currentDir: 'right',
  points: 0,
  isGameOver: false,
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
function clearSnake() {
  helper.moves.forEach(id => field(id).classList.remove('snake'));
}
function drawSnake() {
  helper.moves.forEach(id => field(id).classList.add('snake'));
}
// function feedSnake() {
//   const [last] = helper.moves.slice(-1);
//   const food = document.querySelector('.food');
//   if (last === Number(food.getAttribute('id'))) {
//     console.log('hit');

//     placeFood();

//     helper.moves.push(Number(food.getAttribute('id')));

//     helper.points += 100;
//   }
// }

// function placeFood() {
//   const fields = Array.from(document.querySelectorAll('.field'))
//     .filter(el => !el.classList.contains('snake'))
//     .map(el => Number(el.getAttribute('id')));

//   const snakeLength = helper.moves.length;
//   const availableLength = fields.length - snakeLength;
//   const randomNum = () => Math.floor(Math.random() * availableLength);

//   if (document.querySelector('.food')) {
//     document.querySelector('.food').classList.remove('food');
//   }
//   field(randomNum()).classList.add('food');
// }
// function collisionCheck() {
//   const [last] = helper.moves.slice(-1);
// }
function gameBoundariesCheck(snakeHead) {
  if (snakeHead + helper.dir[helper.currentDir] < 0) helper.isGameOver = true;
  if (snakeHead + helper.dir[helper.currentDir] > 225) helper.isGameOver = true;
}
function selfCollisionCheck(snakeHead) {
  const snakeBody = helper.moves.slice(0, helper.moves.length - 1);
  // console.log(snakeBody);
  if (snakeBody.includes(snakeHead)) {
    console.log('collision');
    helper.isGameOver = true;
  }
}

function move(timeStamp) {
  // document.querySelectorAll('.field').classList.remove('snake', 'food');
  if (!helper.isGameOver) {
    setTimeout(() => {
      // console.log(Math.trunc(timeStamp));

      const first = helper.moves.slice().shift();
      const [last] = helper.moves.slice(-1);
      const next = last + helper.dir[helper.currentDir];
      selfCollisionCheck(next);
      gameBoundariesCheck(next);
      console.log(first, last);

      clearSnake();
      helper.moves.push(next);
      helper.moves.shift(first);
      drawSnake();
      // feedSnake();
      requestAnimationFrame(move);
    }, 500);
  } else {
    cancelAnimationFrame(move);
  }
}

function moveUp(e) {
  if (e.key !== 'ArrowUp' || helper.currentDir === 'down') return;
  console.log('Up');
  helper.currentDir = 'up';
}
function moveDown(e) {
  if (e.key !== 'ArrowDown' || helper.currentDir === 'up') return;
  console.log('Down');
  helper.currentDir = 'down';
}

function moveLeft(e) {
  if (e.key !== 'ArrowLeft' || helper.currentDir === 'right') return;
  console.log('Left');
  helper.currentDir = 'left';
}

function moveRight(e) {
  if (e.key !== 'ArrowRight' || helper.currentDir === 'left') return;
  console.log('Right');
  helper.currentDir = 'right';
}

addEventListener('keydown', moveUp);
addEventListener('keydown', moveDown);
addEventListener('keydown', moveLeft);
addEventListener('keydown', moveRight);

button.addEventListener('click', () => {
  drawSnake();
  // placeFood();
  // feedSnake();
  requestAnimationFrame(move);
});
