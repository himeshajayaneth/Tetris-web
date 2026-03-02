// Tetris game implementation
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextCtx = nextCanvas.getContext('2d');

// Scale for drawing (each cell is 30x30 in main canvas)
const CELL = 30;
ctx.scale(CELL, CELL);
nextCtx.scale(30/40, 30/40); // small scale for next preview

const COLS = 10;
const ROWS = 20;

// Colors for tetrominos
const COLORS = {
    I: '#00f0f0',
    J: '#0000f0',
    L: '#f0a000',
    O: '#f0f000',
    S: '#00f000',
    T: '#a000f0',
    Z: '#f00000'
};

// Tetromino shapes (matrices)
const SHAPES = {
    I: [
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]]
    ],
    J: [
        [[1,0,0],[1,1,1],[0,0,0]],
        [[0,1,1],[0,1,0],[0,1,0]],
        [[0,0,0],[1,1,1],[0,0,1]],
        [[0,1,0],[0,1,0],[1,1,0]]
    ],
    L: [
        [[0,0,1],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,0],[0,1,1]],
        [[0,0,0],[1,1,1],[1,0,0]],
        [[1,1,0],[0,1,0],[0,1,0]]
    ],
    O: [
        [[1,1],[1,1]]
    ],
    S: [
        [[0,1,1],[1,1,0],[0,0,0]],
        [[0,1,0],[0,1,1],[0,0,1]]
    ],
    T: [
        [[0,1,0],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,1],[0,1,0]],
        [[0,1,0],[1,1,0],[0,1,0]]
    ],
    Z: [
        [[1,1,0],[0,1,1],[0,0,0]],
        [[0,0,1],[0,1,1],[0,1,0]]
    ]
};

// Utility: create empty grid
function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Game class to manage state
class Game {
    constructor() {
        this.grid = createGrid();
        this.score = 0;
        this.lines = 0;
        this.level = 0;
        this.dropInterval = 1000; // ms
        this.dropTimer = 0;
        this.lastTime = 0;
        this.paused = false;

        this.bag = [];
        this.next = this.randomTetromino();
        this.spawnTetromino();

        this.addEventListeners();
        this.updateScoreboard();
        requestAnimationFrame(this.loop.bind(this));
    }

    randomTetromino() {
        // 7-bag system
        if (this.bag.length === 0) {
            this.bag = Object.keys(SHAPES);
            // shuffle
            for (let i = this.bag.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
            }
        }
        return this.bag.pop();
    }

    spawnTetromino() {
        const type = this.next || this.randomTetromino();
        this.next = this.randomTetromino();
        this.active = {
            type,
            matrix: SHAPES[type][0].map(r => r.slice()),
            rotation: 0,
            pos: { x: Math.floor((COLS - SHAPES[type][0][0].length) / 2), y: 0 }
        };
        // If spawn collides, game over -> reset
        if (this.collides(this.active.matrix, this.active.pos)) {
            // reset
            this.grid = createGrid();
            this.score = 0; this.lines = 0; this.level = 0;
            this.dropInterval = 1000;
        }
        this.updateScoreboard();
        this.drawNext();
    }

    collides(matrix, pos) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < matrix[y].length; x++) {
                if (matrix[y][x]) {
                    const gx = x + pos.x;
                    const gy = y + pos.y;
                    if (gx < 0 || gx >= COLS || gy >= ROWS) return true;
                    if (gy >= 0 && this.grid[gy][gx]) return true;
                }
            }
        }
        return false;
    }

    rotateMatrix(matrix) {
        // rotate 90 degrees clockwise
        const N = matrix.length;
        const result = Array.from({ length: N }, () => Array(N).fill(0));
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                result[x][N - 1 - y] = matrix[y][x] || 0;
            }
        }
        return result;
    }

    rotateActive() {
        const type = this.active.type;
        const shapes = SHAPES[type];
        // produce next rotation matrix
        let matrix = this.active.matrix;
        // For non-square matrices, create square matrix wrapper
        const size = Math.max(matrix.length, matrix[0].length);
        const square = Array.from({ length: size }, (_, y) => Array(size).fill(0));
        for (let y=0;y<matrix.length;y++) for (let x=0;x<matrix[y].length;x++) square[y][x] = matrix[y][x];
        const rotated = this.rotateMatrix(square);
        // trim empty rows/cols
        // simple wall kick attempts
        const kicks = [0, -1, 1, -2, 2];
        for (let k of kicks) {
            const newPos = { x: this.active.pos.x + k, y: this.active.pos.y };
            // build trimmed matrix to test collision properly
            // find bounding box of rotated
            let top=0, bottom=rotated.length-1, left=0, right=rotated.length-1;
            while (top<=bottom && rotated[top].every(c=>c===0)) top++;
            while (bottom>=top && rotated[bottom].every(c=>c===0)) bottom--;
            while (left<=right && rotated.every(row=>row[left]===0)) left++;
            while (right>=left && rotated.every(row=>row[right]===0)) right--;
            const trimmed = [];
            for (let r=top;r<=bottom;r++) trimmed.push(rotated[r].slice(left, right+1));
            if (!this.collides(trimmed, newPos)) {
                this.active.matrix = trimmed;
                this.active.pos = newPos;
                return;
            }
        }
        // if no valid kick, do nothing
    }

    lockPiece() {
        const m = this.active.matrix;
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x]) {
                    const gx = x + this.active.pos.x;
                    const gy = y + this.active.pos.y;
                    if (gy >= 0 && gy < ROWS && gx >= 0 && gx < COLS) {
                        this.grid[gy][gx] = this.active.type;
                    }
                }
            }
        }
        this.clearLines();
        this.spawnTetromino();
    }

    clearLines() {
        let linesCleared = 0;
        outer: for (let y = ROWS - 1; y >= 0; y--) {
            for (let x = 0; x < COLS; x++) {
                if (!this.grid[y][x]) {
                    continue outer;
                }
            }
            // this row is full
            const row = this.grid.splice(y, 1)[0].fill(0);
            this.grid.unshift(Array(COLS).fill(0));
            linesCleared++;
            y++; // re-check same index after shift
        }
        if (linesCleared > 0) {
            const points = [0, 40, 100, 300, 1200];
            this.score += points[linesCleared] * (this.level + 1);
            this.lines += linesCleared;
            this.level = Math.floor(this.lines / 10);
            this.dropInterval = Math.max(100, 1000 - this.level * 75);
            this.updateScoreboard();
        }
    }

    hardDrop() {
        while (!this.collides(this.active.matrix, { x: this.active.pos.x, y: this.active.pos.y + 1 })) {
            this.active.pos.y++;
        }
        this.lockPiece();
    }

    softDrop() {
        if (!this.collides(this.active.matrix, { x: this.active.pos.x, y: this.active.pos.y + 1 })) {
            this.active.pos.y++;
        } else {
            this.lockPiece();
        }
    }

    move(dx) {
        const newPos = { x: this.active.pos.x + dx, y: this.active.pos.y };
        if (!this.collides(this.active.matrix, newPos)) this.active.pos.x += dx;
    }

    getGhostPos() {
        let ghostY = this.active.pos.y;
        while (!this.collides(this.active.matrix, { x: this.active.pos.x, y: ghostY + 1 })) ghostY++;
        return ghostY;
    }

    addEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.repeat) return;
            if (e.key === 'ArrowLeft') this.move(-1);
            else if (e.key === 'ArrowRight') this.move(1);
            else if (e.key === 'ArrowUp') this.rotateActive();
            else if (e.key === 'ArrowDown') {
                this.softDrop();
            }
            else if (e.code === 'Space') { e.preventDefault(); this.hardDrop(); }
            else if (e.key.toLowerCase() === 'p') { this.paused = !this.paused; }
            this.draw();
        });
    }

    updateScoreboard() {
        document.getElementById('score-value').textContent = this.score;
        document.getElementById('lines-value').textContent = this.lines;
        document.getElementById('level-value').textContent = this.level;
    }

    loop(time = 0) {
        const delta = time - this.lastTime;
        this.lastTime = time;
        if (!this.paused) {
            this.dropTimer += delta;
            if (this.dropTimer > this.dropInterval) {
                this.dropTimer = 0;
                // try move down
                if (!this.collides(this.active.matrix, { x: this.active.pos.x, y: this.active.pos.y + 1 })) {
                    this.active.pos.y++;
                } else {
                    this.lockPiece();
                }
            }
        }

        this.draw();
        requestAnimationFrame(this.loop.bind(this));
    }

    drawCell(x, y, color, alpha=1) {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
        ctx.globalAlpha = 1;
        // border
        ctx.strokeStyle = 'rgba(0,0,0,0.25)';
        ctx.lineWidth = 0.03;
        ctx.strokeRect(x, y, 1, 1);
    }

    draw() {
        // background
        ctx.clearRect(0, 0, COLS, ROWS);
        ctx.fillStyle = 'rgba(10,12,20,1)';
        ctx.fillRect(0, 0, COLS, ROWS);

        // draw grid cells
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                const cell = this.grid[y][x];
                if (cell) this.drawCell(x, y, COLORS[cell]);
                else {
                    // faint grid lines
                    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
                    ctx.lineWidth = 0.015;
                    ctx.strokeRect(x + 0.005, y + 0.005, 0.99, 0.99);
                }
            }
        }

        // draw ghost
        const ghostY = this.getGhostPos();
        const m = this.active.matrix;
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x]) {
                    const gx = this.active.pos.x + x;
                    const gy = ghostY + y;
                    if (gy >= 0) this.drawCell(gx, gy, COLORS[this.active.type], 0.12);
                }
            }
        }

        // draw active piece
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x]) {
                    const gx = this.active.pos.x + x;
                    const gy = this.active.pos.y + y;
                    if (gy >= 0) this.drawCell(gx, gy, COLORS[this.active.type]);
                }
            }
        }

        // overlay paused
        if (this.paused) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(1, 8, COLS - 2, 4);
            ctx.fillStyle = '#fff';
            ctx.font = '0.5px Rubik';
            ctx.fillText('PAUSED', COLS/2 - 1, 10);
        }
    }

    drawNext() {
        // clear
        nextCtx.setTransform(1,0,0,1,0,0);
        nextCtx.clearRect(0,0,nextCanvas.width,nextCanvas.height);
        nextCtx.scale(30/40, 30/40);

        // draw background box
        nextCtx.fillStyle = 'rgba(10,12,20,1)';
        nextCtx.fillRect(0,0,4,4);

        const type = this.next;
        const matrix = SHAPES[type][0];
        const offsetX = Math.floor((4 - matrix[0].length)/2);
        const offsetY = Math.floor((4 - matrix.length)/2);
        for (let y=0;y<matrix.length;y++){
            for (let x=0;x<matrix[y].length;x++){
                if (matrix[y][x]) {
                    nextCtx.fillStyle = COLORS[type];
                    nextCtx.fillRect(offsetX + x, offsetY + y, 1,1);
                    nextCtx.strokeStyle = 'rgba(0,0,0,0.25)';
                    nextCtx.lineWidth = 0.05;
                    nextCtx.strokeRect(offsetX + x, offsetY + y, 1,1);
                }
            }
        }
    }
}

// Start the game
const game = new Game();
