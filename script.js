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

  if (usedFields.some(arr => arr[0] === foodY && arr[1] === foodX)) {
    console.log('AGAIN');
    generateRandomFoodPosition();
  } else {
    const result = { x: foodX, y: foodY };
    helper.foodPosition = result;
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
    level.textContent = Math.ceil(helper.level - 1);
  }
}
// ---------------------------------------------------------- //
function gameOver(msg) {
  console.log(
    `Game Over! You ${msg}! You had ${helper.points} points ! Press restart button to play again!`
  );
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
  foodPosition: { x: 0, y: 0 },
};
// ---------------------------------------------------------- //
// initial call for food placement
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
    gameOver('hit the wall');
    removeEventListeners();
    return;
  }

  // self collision check (getFieldsIds is helper function that returns all coordinates of the fields occupied with the snake)
  const usedFields = getFieldIds('snake');

  if (
    usedFields.some(
      position => position[1] === newHead.x && position[0] === newHead.y
    )
  ) {
    helper.isGameOver = true;
    gameOver('collided with your own body');
    removeEventListeners();
  }
  // food check
  if (
    helper.foodPosition.x === newHead.x &&
    helper.foodPosition.y === newHead.y
  ) {
    helper.moves.push(helper.foodPosition);
    generateRandomFoodPosition();
    helper.points += 100;
  }
  // update snake - clear snake tail (shift) - add new snake head (push newHead)
  helper.moves.shift();
  helper.moves.push(newHead);
}

function renderSnake() {
  // clear board
  grid.innerHTML = '';
  // paint snake for every item in the helper.moves array
  helper.moves.forEach(element => {
    createPiece(element, 'snake');
  });
  // paint food on the board
  createPiece(helper.foodPosition, 'food');
  displayScore();
  displayLevel();
}
// call for initial snake render
renderSnake();

function mainGameLoop(timeStamp) {
  if (helper.isGameOver) return;

  requestAnimationFrame(mainGameLoop);
  const secondsSinceLastRender = (timeStamp - helper.timeSinceLastRender) / 500;

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
  if (e.key !== 'ArrowUp') return;
  if (helper.isGameOver && helper.points === 0) {
    helper.isGameOver = false;
    requestAnimationFrame(mainGameLoop);
  }
  if (!helper.isGameOver && helper.currentPoss.y === 1) return;
  helper.currentPoss = { x: 0, y: -1 };
  nextFrame();
}

function moveDown(e) {
  if (e.key !== 'ArrowDown') return;
  if (helper.isGameOver && helper.points === 0) {
    helper.isGameOver = false;
    requestAnimationFrame(mainGameLoop);
  }
  if (e.key !== 'ArrowDown' || helper.currentPoss.y === -1) return;
  helper.currentPoss = { x: 0, y: 1 };
  nextFrame();
}

function moveLeft(e) {
  if (e.key !== 'ArrowLeft') return;
  if (helper.isGameOver && helper.points === 0) {
    helper.isGameOver = false;
    requestAnimationFrame(mainGameLoop);
  }
  if (e.key !== 'ArrowLeft' || helper.currentPoss.x === 1) return;
  helper.currentPoss = { x: -1, y: 0 };
  nextFrame();
}
function moveRight(e) {
  if (e.key !== 'ArrowRight') return;
  if (helper.isGameOver && helper.points === 0) {
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

function removeEventListeners() {
  removeEventListener('keydown', moveUp);
  removeEventListener('keydown', moveDown);
  removeEventListener('keydown', moveLeft);
  removeEventListener('keydown', moveRight);
}
