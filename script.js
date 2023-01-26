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
function displayScore() {
  points.textContent = helper.points;
}
function displayLevel() {
  if (helper.points % 2000 === 0 && helper.points > 0) {
    helper.level += 0.6;
    helper.points += 500;
    level.textContent = Math.ceil(helper.level - 1);
  } else {
    // helper.level++;
    level.textContent = Math.ceil(helper.level - 1);
  }
}
// ---------------------------------------------------------- //
// helper object containing game information
const helper = {
  points: 0,
  moves: [{ x: 8, y: 8 }],
  isGameOver: true,
  level: 2,
  timeSinceLastRender: 0,
  currentPoss: { x: 0, y: 0 },
  start: false,
  foodPosition: { x: 0, y: 0 },
  test: false,
};
// ---------------------------------------------------------- //

generateRandomFoodPosition();

function updateSnake() {
  // current snake head
  const snakeHead = helper.moves[helper.moves.length - 1];
  // next snake head
  const newHead = {
    x: snakeHead.x + helper.currentPoss.x,
    y: snakeHead.y + helper.currentPoss.y,
  };
  // board edges check
  if (newHead.x < 1 || newHead.x > 15 || newHead.y < 1 || newHead.y > 15) {
    helper.isGameOver = true;
    console.log('game over');
    return;
  }
  // self collision check (getFieldsIds is helper function that returns all coordinates of the fields occupied with the snake)
  const usedFields = getFieldIds('snake');

  if (
    usedFields.some(
      position => position[1] === newHead.x && position[0] === newHead.y
    )
  ) {
    console.log('COLLISION');
    helper.isGameOver = true;
  }
  // food check
  if (
    helper.foodPosition.x === newHead.x &&
    helper.foodPosition.y === newHead.y
  ) {
    console.log('FOOD');
    helper.moves.push(helper.foodPosition);
    generateRandomFoodPosition();
    helper.points += 100;
  }
  // update snake - clear snake tail (shift) - add new snake head (push newHead)
  helper.moves.shift();
  helper.moves.push(newHead);
}

function renderSnake() {
  grid.innerHTML = '';

  helper.moves.forEach(element => {
    createPiece(element, 'snake');
  });

  createPiece(helper.foodPosition, 'food');
  displayScore();
  displayLevel();
}
// call for initial snake render
renderSnake();

function mainGameLoop(timeStamp) {
  if (helper.isGameOver) return;

  requestAnimationFrame(mainGameLoop);
  const secondsSinceLastRender = (timeStamp - helper.timeSinceLastRender) / 400;
  if (secondsSinceLastRender < 1 / helper.level) return;
  helper.timeSinceLastRender = timeStamp;

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

button.addEventListener('click', () => {
  location.reload();
});

addEventListener('keydown', moveUp);
addEventListener('keydown', moveDown);
addEventListener('keydown', moveLeft);
addEventListener('keydown', moveRight);
