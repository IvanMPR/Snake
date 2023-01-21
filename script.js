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
  console.log(newHead, 'newHead');
  if (newHead.x < 1 || newHead.x > 15 || newHead.y < 1 || newHead.y > 15) {
    helper.isGameOver = true;
    console.log('game over');
    return;
  }

  helper.moves.shift();
  helper.moves.push(newHead);
  // console.log('update');
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
placeFood();
function placeFood() {
  const snakeLocations = [];
  const fieldsWithSnake = Array.from(
    document.querySelectorAll('.snake')
  ).forEach(div => {
    const rowId = Number(div.style.gridRowStart);
    const columnId = Number(div.style.gridColumnStart);

    snakeLocations.push([rowId, columnId]);
  });

  console.log(snakeLocations);
}
function mainGameLoop(timeStamp) {
  if (helper.isGameOver) return;

  requestAnimationFrame(mainGameLoop);
  const secondsSinceLastRender = (timeStamp - helper.timeSinceLastRender) / 400;
  if (secondsSinceLastRender < 1 / helper.level) return;
  helper.timeSinceLastRender = timeStamp;
  // console.log(timeStamp);
  // console.log(secondsSinceLastRender);
  updateSnake();
  renderSnake();
}
// helper function that calls update, render and requestAnimationFrame.
// reduces lines of code to be called in moveUp, moveDown, moveLeft and moveRight functions
function nextFrame() {
  updateSnake();
  renderSnake();
  requestAnimationFrame(mainGameLoop);
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
  nextFrame();
}

function moveDown(e) {
  if (e.key !== 'ArrowDown') return;
  if (helper.isGameOver) {
    helper.isGameOver = false;
    requestAnimationFrame(mainGameLoop);
  }
  if (e.key !== 'ArrowDown' || helper.currentPoss.y === -1) return;
  helper.currentPoss = { x: 0, y: 1 };
  nextFrame();
}

function moveLeft(e) {
  if (e.key !== 'ArrowLeft') return;
  if (helper.isGameOver) {
    helper.isGameOver = false;
    requestAnimationFrame(mainGameLoop);
  }
  if (e.key !== 'ArrowLeft' || helper.currentPoss.x === 1) return;
  helper.currentPoss = { x: -1, y: 0 };
  nextFrame();
}
function moveRight(e) {
  if (e.key !== 'ArrowRight') return;
  if (helper.isGameOver) {
    helper.isGameOver = false;
    requestAnimationFrame(mainGameLoop);
  }
  if (e.key !== 'ArrowRight' || helper.currentPoss.x === -1) return;
  helper.currentPoss = { x: 1, y: 0 };
  nextFrame();
}

// button.addEventListener('click', () => {
//   helper.isGameOver = false;
//   requestAnimationFrame(mainGameLoop);
// });

addEventListener('keydown', moveUp);
addEventListener('keydown', moveDown);
addEventListener('keydown', moveLeft);
addEventListener('keydown', moveRight);
