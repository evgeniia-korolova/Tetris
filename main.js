const PLAYIRLD_COLUMNS = 10;
const PLAYIRLD_ROWS = 20;

const TETROMINO_Name = ['O'];

const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ]
}


let playfield;
let tetromino;

function generatePlayField() {
    for (let i = 0; i <= PLAYIRLD_COLUMNS * PLAYIRLD_ROWS; i++) {
        const div = document.createElement('div');
        document.querySelector('.tetris').append(div);
    }
    playfield = new Array(PLAYIRLD_ROWS).fill(0)
        .map(() => new Array(PLAYIRLD_COLUMNS).fill(0))
    
    console.log(playfield)
}

generatePlayField();

function generateTetromino() {
    const nameTetro = 'O';
    const matrixTetro = TETROMINOES[nameTetro]
    const columnTetro = 5;
    const rowTetro = 3;

        tetromino = {
        name: nameTetro,
        matrix: matrixTetro,
        column: columnTetro,
        row: rowTetro
        
    }
}

generateTetromino()


// klava

document.addEventListener('keydown', onKeyDown);

function onKeyDown(event) {
    console.log(event);
    switch (event.key) {
        case 'ArrowDown':
            moveTetrominoDown()
    }
}

function moveTetrominoDown() {
    tetromino.row += 1;
}