const grid = document.querySelector('.grid');
const button = document.querySelector('.btn');
const BOARD_LENGTH = 15;

const helper = {
  moves: [
    [6, 0],
    [6, 1],
    [6, 2],
    [6, 3],
    [6, 4],
    [6, 5],
  ],

  currentDir: 'right',
  points: 0,
  isGameOver: false,
};
function createGrid() {
  let html = '';
  for (let i = 0; i < BOARD_LENGTH; i++) {
    for (let j = 0; j < BOARD_LENGTH; j++) {
      html += `<div class="field" data-fieldId="${[i, j]}" id="${[
        i,
        j,
      ]}"></div>`;
    }
  }
  grid.insertAdjacentHTML('beforeend', html.trim());
}
createGrid();

// helper fn for moving trough the grid
const nextField = (r, c, dir) => {
  return dir === 'right'
    ? [r, c + 1]
    : dir === 'left'
    ? [r, c - 1]
    : dir === 'up'
    ? [r - 1, c]
    : [r + 1, c];
};

// helper fn to avoid typing document.getElementById...
const field = id => document.getElementById(id);

function clearSnake() {
  helper.moves.forEach(coords => field(coords).classList.remove('snake'));
}
function drawSnake() {
  helper.moves.forEach(coords => {
    field(coords).classList.add('snake');
  });
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
  if (snakeHead.some(el => el < 0)) {
    helper.isGameOver = true;
    // add last field to the tail after snake dives into the wall
    field(helper.moves[0][0]).classList.add('snake');
  }

  if (snakeHead.some(el => el > 14)) {
    helper.isGameOver = true;
    // add last field to the tail after snake dives into the wall
    field(helper.moves[0][0]).classList.add('snake');
  }
}

function selfCollisionCheck(snakeHead) {
  const size = new Set(helper.moves.map(el => String(el))).size;
  const length = helper.moves.length;
  // const snakeBody = helper.moves.slice();
  // console.log(snakeHead, snakeBody);
  // snakeBody.forEach(coords => {
  //   console.log(coords);
  //   if (coords.some(el => el[0] === snakeHead[0] && el[1] === snakeHead[1])) {
  //     console.log('collision');
  //     helper.isGameOver = true;
  //   }
  // });
  if (size !== length) {
    console.log('collision');
    // field(helper.moves[0][0]).classList.add('snake');
    helper.isGameOver = true;
  }
}
function moveSnake() {
  // console.log(Math.trunc(timeStamp));
  const [row, col] = helper.moves.slice(-1)[0];
  const next = nextField(row, col, helper.currentDir);
  // console.log('next', next);
  clearSnake();
  helper.moves.push(next);
  helper.moves.shift(helper.moves[0]);
  selfCollisionCheck(next);
  gameBoundariesCheck(next);
  drawSnake();
}

function gameFlow(timeStamp) {
  if (!helper.isGameOver) {
    setTimeout(() => {
      // // console.log(Math.trunc(timeStamp));
      moveSnake();
      requestAnimationFrame(gameFlow);
    }, 500);
  } else {
    cancelAnimationFrame(gameFlow);
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
  requestAnimationFrame(gameFlow);
});
