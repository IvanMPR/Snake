const position = { x: 5, y: 5 };

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
// helper fn to display score
const displayPoints = score => (points.textContent = score);
//  ==========================================================  //
function clearSnake() {
  helper.moves.forEach(coords => field(coords).classList.remove('snake'));
}
function drawSnake() {
  helper.moves.forEach(coords => {
    if (field(coords)) {
      field(coords).classList.add('snake');
    }
  });
}
// function isFoodFound() {
//   const last = String(helper.moves.slice(-1)[0]);
//   const food = document.querySelector('.food').getAttribute('id');
//   return last === food;
// }

function placeFood() {
  const fields = Array.from(document.querySelectorAll('.field')).filter(
    el => !el.classList.contains('snake')
  );
  const randomField = Math.floor(Math.random() * fields.length);
  fields[randomField].classList.add('food');
}

function gameBoundariesCheck(snakeHead) {
  if (snakeHead.some(el => el < 0)) {
    helper.isGameOver = true;
    // add last field to the tail after snake dives into the wall
    // field(helper.moves[0][0]).classList.add('snake');
  }

  if (snakeHead.some(el => el > 14)) {
    helper.isGameOver = true;
    // add last field to the tail after snake dives into the wall
    // field(helper.moves[0][0]).classList.add('snake');
  }
}

function selfCollisionCheck(snakeHead) {
  // const size = new Set(helper.moves.map(el => String(el))).size;
  // const length = helper.moves.length;
  const snakeBody = helper.moves.slice(0, helper.moves.length - 1);
  // console.log(snakeHead, snakeBody);
  snakeBody.forEach(field => {
    // console.log(String(field), String(snakeHead));
    if (String(field) === String(snakeHead)) {
      console.log('collision ');
      helper.isGameOver = true;
    }
  });
  // if (size !== length) {
  //   console.log('collision');
  //   console.log(helper.currentDir);
  //   // field(helper.moves[0][0]).classList.add('snake');
  //   helper.isGameOver = true;
  // }
}

function moveSnake() {
  // console.log(Math.trunc(timeStamp));

  const [row, col] = helper.moves.slice(-1)[0];
  const next = nextField(row, col, helper.currentDir);
  // const foodSearch = isFoodFound();

  clearSnake();
  if (foodSearch) {
    document.querySelector('.food').classList.remove('food');
    helper.moves.push(next);
    console.log('next', next);
    // selfCollisionCheck(next);
    gameBoundariesCheck(next);
    drawSnake();
    placeFood();
    helper.points += 100;
    displayPoints(helper.points);
    // checkSpeed(helper.points);
  } else {
    helper.moves.push(next);
    console.log('next', next);

    // selfCollisionCheck(next);
    helper.moves.shift(helper.moves[0]);
    gameBoundariesCheck(next);
    drawSnake();
  }
}
// function checkSpeed(points) {
//   points >= 500 ? (helper.speed -= 0.5) : helper.speed;
// }
let timeSinceLastRender = 0;
const LEVEL = 2;
function gameFlow(timeStamp) {
  requestAnimationFrame(gameFlow);
  const secondsSinceLastRender = (timeStamp - timeSinceLastRender) / 1000;
  if (secondsSinceLastRender < 1 / LEVEL) return;
  timeSinceLastRender = timeStamp;
  console.log(timeStamp);
  console.log(secondsSinceLastRender);
  // if (!helper.isGameOver) {
  //   setTimeout(() => {
  //     // console.log(Math.trunc(timeStamp));
  moveSnake();
  requestAnimationFrame(gameFlow);
  //   }, helper.timeout);
  // } else {
  //   cancelAnimationFrame(gameFlow);
  // }
}
function moveUp(e) {
  if (!helper.isGameOver) {
    if (e.key !== 'ArrowUp' || helper.currentDir === 'down') return;
    helper.currentDir = 'up';
    // console.log(helper.currentDir);
    moveSnake();
    // requestAnimationFrame(moveSnake);
  }
}
function moveDown(e) {
  if (!helper.isGameOver) {
    if (e.key !== 'ArrowDown' || helper.currentDir === 'up') return;
    helper.currentDir = 'down';
    // console.log(helper.currentDir);

    moveSnake();

    // requestAnimationFrame(moveSnake);
  }
}

function moveLeft(e) {
  if (!helper.isGameOver) {
    if (e.key !== 'ArrowLeft' || helper.currentDir === 'right') return;
    helper.currentDir = 'left';
    // console.log(helper.currentDir);

    moveSnake();

    // requestAnimationFrame(moveSnake);
  }
}

function moveRight(e) {
  if (!helper.isGameOver) {
    if (e.key !== 'ArrowRight' || helper.currentDir === 'left') return;
    helper.currentDir = 'right';
    // console.log(helper.currentDir);

    moveSnake();

    // requestAnimationFrame(moveSnake);
  }
}
