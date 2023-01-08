const grid = document.querySelector('.grid');
const button = document.querySelector('.btn');
const BOARD_LENGTH = 15;
const points = document.querySelector('.points-amount');
const level = document.querySelector('.level-amount');

const helper = {
  position: { x: 0, y: 0 },
  points: 0,
  moves: [
    { x: 1, y: Math.floor(BOARD_LENGTH / 2) },
    { x: 2, y: Math.floor(BOARD_LENGTH / 2) },
  ],
  // isGameOver: true,
  level: 2,
  timeSinceLastRender: 0,
};

const nextField = () => {
  const currentSnakeHead = helper.moves.slice(-1);
  const nextSnakeHead = currentSnakeHead.map(position => {
    position.x + helper.position.x;
    position.y + helper.position.y;
    console.log(position);
  });
  console.log(...nextSnakeHead);
  helper.moves.push(...nextSnakeHead);
  helper.moves.shift();
  helper.position.x = 0;
  helper.position.y = 0;
};

function updateSnake() {
  console.log('update');
  nextField();
}

function renderSnake() {
  Array.from(document.querySelectorAll('.snake')).forEach(div => {
    div.parentElement.removeChild(div);
  });
  helper.moves.forEach(element => {
    const snakePart = document.createElement('div');
    snakePart.style.gridRowStart = element.y;
    snakePart.style.gridColumnStart = element.x;
    snakePart.classList.add('snake');
    grid.appendChild(snakePart);
  });
}

function mainGameLoop(timeStamp) {
  requestAnimationFrame(mainGameLoop);
  const secondsSinceLastRender =
    (timeStamp - helper.timeSinceLastRender) / 1000;
  if (secondsSinceLastRender < 1 / helper.level) return;
  helper.timeSinceLastRender = timeStamp;
  // console.log(timeStamp);
  // console.log(secondsSinceLastRender);
  updateSnake();
  renderSnake();
}

// addEventListener('keydown', moveUp);
addEventListener('keydown', moveDown);
// addEventListener('keydown', moveLeft);
// addEventListener('keydown', moveRight);
function moveDown(e) {
  if (e.key !== 'ArrowDown' || helper.currentDir === 'up') return;
  helper.position.y += 1;
  nextField();
}

button.addEventListener('click', () => {
  helper.isGameOver = false;
  requestAnimationFrame(mainGameLoop);
});
