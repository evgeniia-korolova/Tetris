const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;

const TETROMINO_NAMES = [
    'O',
    'L',
    'J',
    'S',
    'Z',
    'I',
    'T'
];

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'J': [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'T': [        
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ]
};


let playfield;
let tetromino;

function getRandomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

function randomGenerator(from, to) {
  return Math.floor(Math.random() * (to - from) + from);
}

function randomColor() {
  const r = randomGenerator(0, 256);
  const g = randomGenerator(0, 256);
  const b = randomGenerator(0, 256);
  const rgb = `rgb(${r}, ${g}, ${b})`;
  return rgb;
}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
    
    console.log(playfield)
}

generatePlayField();

const cells = document.querySelectorAll('.tetris div');
// console.log(cells);

function generateTetromino() {
    const nameTetro = getRandomElement(TETROMINO_NAMES);
    const matrixTetro = TETROMINOES[nameTetro];
    const rowTetro = 0;
    const columnTetro = Math.floor(PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2);
    const colorTetro = randomColor();

    tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        column: columnTetro,
        row: rowTetro, 
        color: colorTetro,
    }
}
generateTetromino()


function drawPlayField(){

    for(let row = 0; row < PLAYFIELD_ROWS; row++){
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            // if(playfield[row][column] == 0) { continue };
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
            
        }
    }

}

function drawTetromino(){
    const name = tetromino.name;
    
    const tetrominoMatrixSize = tetromino.matrix.length;

    for(let row = 0; row < tetrominoMatrixSize; row++){
        for(let column = 0; column < tetrominoMatrixSize; column++){
            if(tetromino.matrix[row][column] == 0){ continue }
            
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);
            

        }
    }
}

drawTetromino();

function draw(){
    cells.forEach(function (cell) {
        cell.removeAttribute('class');
       
    });
    drawPlayField();
    drawTetromino();
    // console.table(playfield)
}


// klava

document.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
    // console.log(event);
    switch (event.key) {
        case 'ArrowUp':
            rotateTetromino();
            break;
        case 'ArrowDown':
            moveTetrominoDown();
            break;
        case 'ArrowLeft':
            moveTetrominoLeft();
            break;
        case 'ArrowRight':
            moveTetrominoRight();
            break;
    }
     draw();
}

function moveTetrominoDown() {
      tetromino.row += 1;
    if(isValid()){
        tetromino.row -= 1;
        placeTetromino();
    }
}

function moveTetrominoLeft(){
    tetromino.column -= 1;
    if(isValid()){
        tetromino.column += 1;
    }
}

function moveTetrominoRight(){
    tetromino.column += 1;
    if(isValid()){
        tetromino.column -= 1;
    }
}

function isValid() {
     const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            // if (!tetromino.matrix[row][column]) { continue }
            if (tetromino.matrix[row][column] === 0) { continue };
            if (isOutsideOfGameBoard(row, column)) { return true };
            if (hasCollisions(row, column)) { return true };
        }
    }
    return false;
}

function isOutsideOfGameBoard(row, column){
    return tetromino.column + column < 0 ||
        tetromino.column + column >= PLAYFIELD_COLUMNS ||
        tetromino.row + row >= playfield.length;
}

// collision

function hasCollisions(row, column) {
    return playfield[tetromino.row + row][tetromino.column + column];
}

function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if(!tetromino.matrix[row][column]) continue;

            playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        }
    }
    const filledRows = findFilledRows();
    console.log(filledRows);
    removeFilledRows(filledRows);
    
    generateTetromino();
}

// ! change for forEach()

function findFilledRows() {
    const filledRows = [];
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        let filledColumns = 0;
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if (playfield[row][column] != 0) {
                filledColumns++;
            }
        }
        if (PLAYFIELD_COLUMNS === filledColumns) {
            filledRows.push(row);
        }
    }
    return filledRows;
}

function dropRowsAbove(rowDelete) {
    for (let row = rowDelete; row > 0; row--) {
        playfield[row] = playfield[row - 1];
    }
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function removeFilledRows(filledRows) {
    filledRows.forEach(row => {
        dropRowsAbove(row);

        // for (let i = 0; i < filledRows.length; i++) {
        //     const row = filledRows[i];
        //     dropRowsAbove(row)
        // }
})
}

function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = [];
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
        }
    }
    return rotateMatrix;
}

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    tetromino.matrix = rotatedMatrix;
    if (isValid()) {
        tetromino.matrix = oldMatrix;
    }
    draw();
}

