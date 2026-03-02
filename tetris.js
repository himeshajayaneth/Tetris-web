const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

const nextCanvas = document.getElementById('next');
const nextContext = nextCanvas.getContext('2d');

context.scale(30, 30);
nextContext.scale(10, 10);

// Define the grid dimensions
const ROWS = 20;
const COLUMNS = 10;

// Create the game grid
const grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

// Define Tetromino shapes and their rotations
const TETROMINOS = {
    I: [
        [
            [1, 1, 1, 1]
        ],
        [
            [1],
            [1],
            [1],
            [1]
        ]
    ],
    J: [
        [
            [0, 1],
            [0, 1],
            [1, 1]
        ],
        [
            [1, 0, 0],
            [1, 1, 1]
        ],
        [
            [1, 1],
            [1, 0],
            [1, 0]
        ],
        [
            [1, 1, 1],
            [0, 0, 1]
        ]
    ],
    // Add other Tetrominos (L, O, S, T, Z) here
};

// Render the grid on the canvas
function drawGrid() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#333';
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            context.strokeRect(col, row, 1, 1);
        }
    }
}

// Function to create a new Tetromino
function createTetromino(type) {
    return {
        matrix: TETROMINOS[type][0],
        position: { x: Math.floor(COLUMNS / 2) - 1, y: 0 },
    };
}

// Function to draw a Tetromino
function drawTetromino(tetromino) {
    context.fillStyle = '#0ff'; // Temporary color
    tetromino.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillRect(tetromino.position.x + x, tetromino.position.y + y, 1, 1);
            }
        });
    });
}

// Initialize the current Tetromino
let currentTetromino = createTetromino('I');

// Function to update the game state
function update() {
    currentTetromino.position.y++;
    drawGrid();
    drawTetromino(currentTetromino);
}

// Start the game loop
setInterval(update, 1000);

// Placeholder for game logic
console.log('Tetris game initialized');
