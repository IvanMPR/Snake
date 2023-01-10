const grid = document.querySelector('.grid');
const button = document.querySelector('.btn');
const BOARD_LENGTH = 15;
const points = document.querySelector('.points-amount');
const level = document.querySelector('.level-amount');

const helper = {
  position: { x: 0, y: 0 },
  points: 0,
  moves: [
    { x: 1, y: 7 },
    { x: 2, y: 7 },
    { x: 3, y: 7 },
    { x: 4, y: 7 },
  ],
  // isGameOver: true,
  level: 2,
  timeSinceLastRender: 0,
  currentDir: null,
};

function updateSnake(event) {
  // copy last snake
  let copy = helper.moves.slice();
  // clear old snake
  helper.moves = [];
  // create new snake
  //  all fields except first and last
  const snakeBody = copy.slice(1, -1);
  // last field
  const snakeHead = copy.slice(-1);
  console.log(snakeHead);
  let position = { x: snakeHead[0].x, y: snakeHead[0].y };
  const nextSnakeHeadCoords = e => {
    return (e.key = 'ArrowUp'
      ? (position = { x: snakeHead[0].x, y: snakeHead[0].y - 1 })
      : (e.key = 'ArrowDown'
          ? (position = { x: snakeHead[0].x, y: snakeHead[0].y + 1 })
          : (e.key = 'ArrowLeft'
              ? (position = { x: snakeHead[0].x - 1, y: snakeHead[0].y })
              : (position = { x: snakeHead[0].x + 1, y: snakeHead[0].y }))));
  };
  nextSnakeHeadCoords(event);
  helper.moves.push(...snakeBody);
  helper.moves.push(position);
  // console.log(position, 'POS');
  // console.log(snakeBody, 'snake body', last, 'last');
  // console.log('update');
  // console.log(...last);
}

function renderSnake() {
  // Array.from(document.querySelectorAll('.snake')).forEach(div => {
  //   div.parentElement.removeChild(div);
  // });
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
}

button.addEventListener('click', () => {
  helper.isGameOver = false;
  requestAnimationFrame(mainGameLoop);
});
