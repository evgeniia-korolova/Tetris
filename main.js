

import {
    PLAYFIELD_COLUMNS,
    PLAYFIELD_ROWS,
    TETROMINO_NAMES,
    TETROMINOES,
    
    scoreSection,
    gameOverBlock,
        restartBtn,

} from './utils.js';
// ДЗ №3
// ? 1. Зробити розмітку висновків гри по її завершенню
// ? 2. Зверстати окрему кнопку рестарт, що перезапускатиме гру посеред гри
// ? 3. Додати клавіатуру на екрані браузеру для руху фігур

// 4. Створити секцію, що відображатиме наступну фігуру, що випадатиме
// 5. Додати рівні гри при котрих збільшується швидкість 
//    падіння фігур та виводити їх на екран
// 6. Зберігати і виводити найкращий власний результат

 let playfield,
        tetromino,
        timeoutId,
        requestId,
        cells,
        score = 0,
        isPaused = false,
    isGameOver = false;
        
    let light = document.querySelector('.easy');
let middle = document.querySelector('.middle');
let pro = document.querySelector('.high');
let speed = 3000;

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
    document.querySelector('.tetris').innerHTML = '';
    for (let i = 0; i < PLAYFIELD_COLUMNS * PLAYFIELD_ROWS; i++) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }

    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
    
    // console.log(playfield)
}

generatePlayField();


function generateTetromino() {
    const nameTetro = getRandomElement(TETROMINO_NAMES);
    const matrixTetro = TETROMINOES[nameTetro];
    // const rowTetro = 0;
    const rowTetro = -2;
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
// generateTetromino()


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
             if (isOutsideTopBoard(row)) { continue }
            if(tetromino.matrix[row][column] == 0){ continue }
            
            const cellIndex = convertPositionToIndex(tetromino.row + row, tetromino.column + column);
            cells[cellIndex].classList.add(name);            
        }
    }
}

function isOutsideTopBoard(row) {
    return tetromino.row + row < 0;
}

// function moveAutoDown() {
//     draw();
//     moveTetrominoDown()
// }
init()
function init() {
    gameOverBlock.classList.remove('visible');
    isGameOver = false;
    generatePlayField();
    generateTetromino();
    startLoop();
    cells = document.querySelectorAll('.tetris div');
    score = 0;
    countScore(null);
}

restartBtn.addEventListener('click', () => {
    init();
})

function draw(){
    cells.forEach(function (cell) {
        cell.removeAttribute('class');       
    });
    drawPlayField();
    drawTetromino();
    // console.table(playfield)
}


// klava

function togglePauseGame() {
    isPaused = !isPaused;

    if (isPaused) {
        stopLoop();
    } else {
        startLoop();
    }
}

document.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
    // console.log(event);
    if (event.key == 'p') {
        togglePauseGame()
    } if (isPaused) {
        return
    }
        switch (event.key) {
            case ' ':
                dropTetrominoDown();
                break;
            case 'Enter':
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

function dropTetrominoDown() {
    while (!isValid()) {
        tetromino.row++;
    }
    tetromino.row--;
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
    // return playfield[tetromino.row + row][tetromino.column + column];
    return playfield[tetromino.row + row]?.[tetromino.column + column];
}

function placeTetromino(){
    const matrixSize = tetromino.matrix.length;
    for(let row = 0; row < matrixSize; row++){
        for(let column = 0; column < matrixSize; column++){
            if (!tetromino.matrix[row][column]) continue;
            if(isOutsideTopBoard(row)){ 
                isGameOver = true;
                return;
            }

            playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        }
    }
    const filledRows = findFilledRows();
    // console.log(filledRows);
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

function countScore(destroyRows){
    switch(destroyRows){
        case 1:
            score += 10;
            break;
        case 2:
            score += 30;
            break;
        case 3:
            score += 50;
            break;
        case 4:
            score += 100;
            break;
        default:
            score += 0;
    }
    scoreSection.innerHTML = score;
}


function removeFilledRows(filledRows) {
    filledRows.forEach(row => {
        dropRowsAbove(row);      
        
        // for (let i = 0; i < filledRows.length; i++) {
        //     const row = filledRows[i];
        //     dropRowsAbove(row)
        // }
    })
     countScore(filledRows.length);
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

function moveDown(){
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if (isGameOver) {
        gameOver();
    }
}

let finalScore = document.querySelector('.final-score');

function gameOver() {
    stopLoop();
    gameOverBlock.classList.add('visible');
    finalScore.innerHTML = `Your current score ${score}`;
}



function selectLevel() {
    light.addEventListener('click', () => {
        speed = 2000;
    })
    middle.addEventListener('click', () => {
        speed = 1000;
    })
    pro.addEventListener('click', () => {
        speed = 500;
    })
    console.log(speed);
}

selectLevel();


function startLoop() {
    
    selectLevel();
    timeoutId = setTimeout(
        () => (requestId = requestAnimationFrame(moveDown)),
        speed
    );
}

// startLoop()

function stopLoop(){
    cancelAnimationFrame(requestId);
    timeoutId = clearTimeout(timeoutId);
}

// let interval = setInterval(() => {
//   moveAutoDown();
// }, 1700)

// mouse controlls

const down = document.querySelector('.down');
const left = document.querySelector('.left');
const right = document.querySelector('.right');
const rotate = document.querySelector('.rotate');
const drop = document.querySelector('.space');
const pauseGame = document.querySelector('.pause');
const restartField = document.querySelector('.restart-field');


down.addEventListener('click', moveTetrominoDown);
left.addEventListener('click', moveTetrominoLeft);
right.addEventListener('click', moveTetrominoRight);
rotate.addEventListener('click', rotateTetromino);
drop.addEventListener('click', dropTetrominoDown);
pauseGame.addEventListener('click', togglePauseGame);
restartField.addEventListener('click', init);