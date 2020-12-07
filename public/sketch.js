let grid;
let score = 0;

function baseGrid() {
  return [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
}

function keyPressed() {
  let flipped = false;
  let rotated = false;
  let played = true;
  if (keyCode === DOWN_ARROW) {
    // DO NOTHİNG
  } else if (keyCode === UP_ARROW) {
    grid = flipGrid(grid);
    flipped = true;
  } else if (keyCode === RIGHT_ARROW) {
    grid = rotateGrid(grid);
    rotated = true;
  } else if (keyCode === LEFT_ARROW) {
    grid = rotateGrid(grid);
    grid = flipGrid(grid);
    rotated = true;
    flipped = true;
  } else {
    played = false;
  }

  if (played) {
    let past = copyGrid(grid);
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }

    let changed = compare(past, grid);

    if (flipped) {
      grid = flipGrid(grid);
    }
    if (rotated) {
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
      grid = rotateGrid(grid);
    }

    if (changed) {
      addNumber();
    }

    updateCanvas();
  }

  let gameover = isGameover();
  if (gameover) {
    console.log("GAME OVER");
  }
}

function operate(row) {
  row = slide(row);
  row = combine(row);
  row = slide(row);
  return row;
}

function flipGrid(grid) {
  for (let i = 0; i < 4; i++) {
    grid[i].reverse();
  }
  return grid;
}

function rotateGrid(grid) {
  let newGrid = baseGrid();
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[j][i];
    }
  }
  return newGrid;
}

function copyGrid(grid) {
  let newGrid = baseGrid();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newGrid[i][j] = grid[i][j];
    }
  }
  return newGrid;
}

function compare(past, grid) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (past[i][j] !== grid[i][j]) {
        return true;
      }
    }
  }
  return false;
}

function isGameover() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] == 0) return false;
      if (i !== 3 && grid[i][j] == grid[i + 1][j]) return false;
      if (j !== 3 && grid[i][j] == grid[i][j + 1]) return false;
    }
  }
  return true;
}

function setup() {
  createCanvas(400, 400);
  noLoop();
  grid = baseGrid();
  addNumber();
  addNumber();
  updateCanvas();
}

function updateCanvas() {
  background(255);
  let w = 100;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      noFill();
      strokeWeight(2);
      stroke(0);
      rect(i * w, j * w, w, w);
      let val = grid[i][j];
      let str = val.toString();
      let str_length = str.length - 1;
      let sizes = [64, 64, 48, 24];
      if (val !== 0) {
        textAlign(CENTER, CENTER);
        noStroke();
        textSize(sizes[str_length]);
        fill(0);
        text(val, i * w + w / 2, j * w + w / 2);
      }
    }
  }

  select("#score").html(score);
}

function addNumber() {
  let options = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) {
        options.push({
          x: i,
          y: j,
        });
      }
    }
  }

  if (options.length > 0) {
    let spot = random(options);
    let r = random(1);
    grid[spot.x][spot.y] = r > 0.5 ? 2 : 4;
  }
}

function slide(row) {
  let arr = row.filter((val) => val);
  let missing = 4 - arr.length;
  let zeros = Array(missing).fill(0);
  arr = zeros.concat(arr);
  return arr;
}

function combine(row) {
  for (let i = 3; i >= 1; i--) {
    let a = row[i];
    let b = row[i - 1];
    if (a == b) {
      row[i] = a + b;
      score += row[i];
      row[i - 1] = 0;
    }
  }
  return row;
}
