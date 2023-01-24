const grid = document.querySelector('.grid');
const button = document.querySelector('.btn');
const BOARD_LENGTH = 15;
const points = document.querySelector('.points-amount');
const level = document.querySelector('.level-amount');
// ---------------------------------------------------------- //
function randomNumGenerator() {
  return Math.floor(Math.random() * BOARD_LENGTH) + 1;
}
// ---------------------------------------------------------- //
function getFieldIds(classList) {
  const result = [];
  document.querySelectorAll(`.${classList}`).forEach(div => {
    const rowId = Number(div.style.gridRowStart);
    const columnId = Number(div.style.gridColumnStart);
    result.push([rowId, columnId]);
  });
  return result;
}
// ---------------------------------------------------------- //
function generateRandomFoodPosition() {
  const usedFields = getFieldIds('snake');

  // console.log(usedFields);
  const foodX = randomNumGenerator();
  const foodY = randomNumGenerator();
  // console.log(foodX, foodY);
  if (usedFields.some(arr => arr[0] === foodY && arr[1] === foodX)) {
    console.log('AGAIN');
    generateRandomFoodPosition();
  } else {
    const result = { x: foodX, y: foodY };
    helper.foodPosition = result;
    // createPiece(result, 'food');
  }
}
// ---------------------------------------------------------- //
// snake pieces creation. food is created with same fn but with different classlist assigned
function createPiece(pieceCoordinates, classList) {
  const snakePart = document.createElement('div');
  snakePart.style.gridRowStart = pieceCoordinates.y;
  snakePart.style.gridColumnStart = pieceCoordinates.x;
  snakePart.classList.add(classList);
  grid.appendChild(snakePart);
}
// ---------------------------------------------------------- //
// helper object containing game information
const helper = {
  points: 0,
  moves: [
    { x: 8, y: 8 },
    // { x: 8, y: 9 },
    // { x: 8, y: 10 },
    // { x: 8, y: 11 },
  ],
  isGameOver: true,
  level: 2,
  timeSinceLastRender: 0,
  currentPoss: { x: 0, y: 0 },
  start: false,
  foodPosition: { x: 0, y: 0 },
};
// ---------------------------------------------------------- //

generateRandomFoodPosition();

function updateSnake() {
  const snakeHead = helper.moves[helper.moves.length - 1];
  const newHead = {
    x: snakeHead.x + helper.currentPoss.x,
    y: snakeHead.y + helper.currentPoss.y,
  };
  // console.log(newHead, 'newHead');
  if (newHead.x < 1 || newHead.x > 15 || newHead.y < 1 || newHead.y > 15) {
    helper.isGameOver = true;
    console.log('game over');
    return;
  }
  const usedFields = getFieldIds('snake');
  // console.log(usedFields, newHead, 'testing');
  if (
    usedFields.some(
      position => position[1] === newHead.x && position[0] === newHead.y
    )
  ) {
    console.log('COLLISION');
  }
  if (
    helper.foodPosition.x === newHead.x &&
    helper.foodPosition.y === newHead.y
  ) {
    console.log('FOOD');
    helper.moves.push(helper.foodPosition);
    generateRandomFoodPosition();
  }

  helper.moves.shift();
  helper.moves.push(newHead);
  // console.log('update');
}

function renderSnake() {
  grid.innerHTML = '';

  helper.moves.forEach(element => {
    createPiece(element, 'snake');
  });
  // console.log('render');
  createPiece(helper.foodPosition, 'food');
}
renderSnake();
// createPiece(helper.foodPosition, 'food');

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
  // console.log(e.key);
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
