const grid = document.querySelector('.grid');
const button = document.querySelector('.btn');
const BOARD_LENGTH = 15;
const points = document.querySelector('.points-amount');
const level = document.querySelector('.level-amount');

const helper = {
  points: 0,
  moves: [{ x: 8, y: 8 }],
  isGameOver: true,
  level: 2,
  timeSinceLastRender: 0,
  currentPoss: { x: 0, y: 0 },
  start: false,
};

function updateSnake() {
  const snakeHead = helper.moves[helper.moves.length - 1];
  const newHead = {
    x: snakeHead.x + helper.currentPoss.x,
    y: snakeHead.y + helper.currentPoss.y,
  };
  if (newHead.x < 1 || newHead.x > 15 || newHead.y < 1 || newHead.y > 15) {
    helper.isGameOver = true;
    console.log('game over');
  }

  helper.moves.shift();
  helper.moves.push(newHead);
  console.log('update');
  // helper.position.x = 0;
  // helper.position.y = 0;
  // console.log(helper.x, helper.y);
}

function renderSnake() {
  grid.innerHTML = '';

  helper.moves.forEach(element => {
    const snakePart = document.createElement('div');
    snakePart.style.gridRowStart = element.y;
    snakePart.style.gridColumnStart = element.x;
    snakePart.classList.add('snake');
    grid.appendChild(snakePart);
  });
  console.log('render');
}
renderSnake();
function mainGameLoop(timeStamp) {
  if (helper.isGameOver) return;
  requestAnimationFrame(mainGameLoop);
  const secondsSinceLastRender = (timeStamp - helper.timeSinceLastRender) / 750;
  if (secondsSinceLastRender < 1 / helper.level) return;
  helper.timeSinceLastRender = timeStamp;
  // console.log(timeStamp);
  // console.log(secondsSinceLastRender);
  updateSnake();
  renderSnake();
}

function moveUp(e) {
  console.log(e.key);
  if (e.key !== 'ArrowUp') return;
  if (helper.isGameOver) {
    helper.isGameOver = false;
    requestAnimationFrame(mainGameLoop);
  }
  if (!helper.isGameOver && helper.currentPoss.y === 1) return;
  helper.currentPoss = { x: 0, y: -1 };
  // if (e.key === 'ArrowUp' && helper.isGameOver) {
  //   helper.isGameOver = false;
  //   requestAnimationFrame(mainGameLoop);
  // } else {
  //   if (helper.currentPoss.y === 1) return;
  //   else helper.currentPoss = { x: 0, y: -1 };
  // }
}
function moveDown(e) {
  if (e.key !== 'ArrowDown' || helper.currentPoss.y === -1) return;
  helper.currentPoss = { x: 0, y: 1 };
}
function moveLeft(e) {
  if (e.key !== 'ArrowLeft' || helper.currentPoss.x === 1) return;
  helper.currentPoss = { x: -1, y: 0 };
}
function moveRight(e) {
  if (e.key !== 'ArrowRight' || helper.currentPoss.x === -1) return;
  helper.currentPoss = { x: 1, y: 0 };
}

// button.addEventListener('click', () => {
//   helper.isGameOver = false;
//   requestAnimationFrame(mainGameLoop);
// });

addEventListener('keydown', moveUp);
addEventListener('keydown', moveDown);
addEventListener('keydown', moveLeft);
addEventListener('keydown', moveRight);
