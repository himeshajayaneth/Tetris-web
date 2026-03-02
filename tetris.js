// Tetris game implementation with hold, SRS, sounds, start/pause, highscore, and mobile controls
const canvas = document.getElementById('tetris');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next');
const nextCtx = nextCanvas.getContext('2d');
const holdCanvas = document.getElementById('hold');
const holdCtx = holdCanvas.getContext('2d');

// Scale for drawing (each cell is 30x30 in main canvas)
const CELL = 30;
ctx.scale(CELL, CELL);
nextCtx.scale(30/40, 30/40); // small scale for next preview
holdCtx.scale(30/40, 30/40);

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

// Tetromino shapes (matrices) - normalized to square matrices for SRS where needed
const SHAPES = {
    I: [
        [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
        [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
        [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
        [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
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
        [[0,1,0],[0,1,1],[0,0,1]],
        [[0,0,0],[0,1,1],[1,1,0]],
        [[1,0,0],[1,1,0],[0,1,0]]
    ],
    T: [
        [[0,1,0],[1,1,1],[0,0,0]],
        [[0,1,0],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,1],[0,1,0]],
        [[0,1,0],[1,1,0],[0,1,0]]
    ],
    Z: [
        [[1,1,0],[0,1,1],[0,0,0]],
        [[0,0,1],[0,1,1],[0,1,0]],
        [[0,0,0],[1,1,0],[0,1,1]],
        [[0,1,0],[1,1,0],[1,0,0]]
    ]
};

// SRS wall kick data taken from standard SRS (simplified indices: fromRotation -> toRotation)
const SRS = {
    // For J, L, S, T, Z
    JLSTZ: {
        '0->1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
        '1->0': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
        '1->2': [[0,0],[1,0],[1,-1],[0,2],[1,2]],
        '2->1': [[0,0],[-1,0],[-1,1],[0,-2],[-1,-2]],
        '2->3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]],
        '3->2': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
        '3->0': [[0,0],[-1,0],[-1,-1],[0,2],[-1,2]],
        '0->3': [[0,0],[1,0],[1,1],[0,-2],[1,-2]]
    },
    I: {
        '0->1': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
        '1->0': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
        '1->2': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]],
        '2->1': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
        '2->3': [[0,0],[2,0],[-1,0],[2,1],[-1,-2]],
        '3->2': [[0,0],[-2,0],[1,0],[-2,-1],[1,2]],
        '3->0': [[0,0],[1,0],[-2,0],[1,-2],[-2,1]],
        '0->3': [[0,0],[-1,0],[2,0],[-1,2],[2,-1]]
    }
};

// Utility: clone matrix
function cloneMatrix(m){ return m.map(r=>r.slice()); }

// Utility: create empty grid
function createGrid() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

// Sound effects (simple) - short beep tones generated via WebAudio if available
class SoundManager {
    constructor(){
        this.on = true;
        try{
            this.ctx = new (window.AudioContext||window.webkitAudioContext)();
        }catch(e){ this.ctx = null; }
    }
    play(type){ if(!this.on) return; if(!this.ctx) return; const now=this.ctx.currentTime; const o=this.ctx.createOscillator(); const g=this.ctx.createGain(); o.connect(g); g.connect(this.ctx.destination); g.gain.setValueAtTime(0.001, now); g.gain.exponentialRampToValueAtTime(0.08, now+0.01); if(type==='move'){ o.frequency.setValueAtTime(400, now); o.type='sine'; } else if(type==='drop'){ o.frequency.setValueAtTime(140, now); o.type='square'; } else if(type==='clear'){ o.frequency.setValueAtTime(780, now); o.type='sawtooth'; } else if(type==='lock'){ o.frequency.setValueAtTime(220, now); o.type='sine'; } g.gain.exponentialRampToValueAtTime(0.001, now+0.12); o.start(now); o.stop(now+0.13); }
}
const sound = new SoundManager();

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
        this.paused = true; // start paused until Start pressed

        this.bag = [];
        this.next = this.randomTetromino();
        this.hold = null;
        this.canHold = true;
        this.highscore = parseInt(localStorage.getItem('tetrisHigh') || '0', 10);
        document.getElementById('highscore-value').textContent = this.highscore;

        this.spawnTetromino();

        this.addEventListeners();
        this.updateScoreboard();
        this.drawNext();
        this.drawHold();
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
            matrix: cloneMatrix(SHAPES[type][0]),
            rotation: 0,
            pos: { x: Math.floor((COLS - SHAPES[type][0][0].length) / 2), y: -this.topOffset(type) }
        };
        this.canHold = true;
        // If spawn collides, game over -> reset
        if (this.collides(this.active.matrix, this.active.pos)) {
            // update highscore
            if (this.score > this.highscore) { this.highscore = this.score; localStorage.setItem('tetrisHigh', this.highscore); document.getElementById('highscore-value').textContent = this.highscore; }
            // reset
            this.grid = createGrid();
            this.score = 0; this.lines = 0; this.level = 0;
            this.dropInterval = 1000;
            this.bag = [];
            this.next = this.randomTetromino();
        }
        this.updateScoreboard();
        this.drawNext();
        this.drawHold();
    }

    topOffset(type){
        // For proper spawn y offset based on shape height
        const m = SHAPES[type][0];
        return Math.floor(m.length/2);
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

    rotateActive(clockwise=true) {
        const type = this.active.type;
        const shapes = SHAPES[type];
        const from = this.active.rotation % shapes.length;
        const to = (from + (clockwise?1:shapes.length-1)) % shapes.length;
        const rotated = cloneMatrix(shapes[to]);

        const kickTable = (type === 'I') ? SRS.I : SRS.JLSTZ;
        const key = `${from}->${to}`;
        const kicks = kickTable[key] || [[0,0]];

        for (let k of kicks) {
            const newPos = { x: this.active.pos.x + k[0], y: this.active.pos.y + k[1] };
            if (!this.collides(rotated, newPos)) {
                this.active.matrix = cloneMatrix(rotated);
                this.active.pos = newPos;
                this.active.rotation = to;
                sound.play('move');
                return;
            }
        }
        // no kick worked
    }

    holdPiece() {
        if (!this.canHold) return;
        sound.play('move');
        if (!this.hold) {
            this.hold = this.active.type;
            this.spawnTetromino();
        } else {
            const temp = this.hold;
            this.hold = this.active.type;
            this.active = { type: temp, matrix: cloneMatrix(SHAPES[temp][0]), rotation:0, pos: { x: Math.floor((COLS - SHAPES[temp][0][0].length) / 2), y: -this.topOffset(temp) } };
            if (this.collides(this.active.matrix, this.active.pos)) {
                // immediate lock/game over handled in spawn
                this.spawnTetromino();
            }
        }
        this.canHold = false;
        this.drawHold();
    }

    rotateMatrix(matrix) {
        // rotate 90 degrees clockwise for square matrices
        const N = matrix.length;
        const result = Array.from({ length: N }, () => Array(N).fill(0));
        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                result[x][N - 1 - y] = matrix[y][x] || 0;
            }
        }
        return result;
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
        sound.play('lock');
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
            this.grid.splice(y, 1);
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
            sound.play('clear');
        }
    }

    hardDrop() {
        while (!this.collides(this.active.matrix, { x: this.active.pos.x, y: this.active.pos.y + 1 })) {
            this.active.pos.y++;
        }
        this.lockPiece();
        sound.play('drop');
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
        if (!this.collides(this.active.matrix, newPos)) { this.active.pos.x += dx; sound.play('move'); }
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
            else if (e.key === 'ArrowUp') this.rotateActive(true);
            else if (e.key === 'ArrowDown') {
                this.softDrop();
            }
            else if (e.code === 'Space') { e.preventDefault(); this.hardDrop(); }
            else if (e.key.toLowerCase() === 'p') { this.togglePause(); }
            else if (e.key.toLowerCase() === 'c') { this.holdPiece(); }
            this.draw();
        });

        // UI buttons
        document.getElementById('start-btn').addEventListener('click', () => { this.start(); });
        document.getElementById('pause-btn').addEventListener('click', () => { this.togglePause(); });
        document.getElementById('sound-btn').addEventListener('click', (e) => { sound.on = !sound.on; e.target.textContent = `Sound: ${sound.on? 'On':'Off'}`; });

        // Mobile controls
        document.querySelectorAll('.m-btn').forEach(btn => {
            btn.addEventListener('touchstart', (ev) => { ev.preventDefault(); this.handleMobileAction(btn.dataset.action); });
            btn.addEventListener('mousedown', (ev) => { ev.preventDefault(); this.handleMobileAction(btn.dataset.action); });
        });
    }

    handleMobileAction(action){
        if (action==='left') this.move(-1);
        else if (action==='right') this.move(1);
        else if (action==='rotate') this.rotateActive(true);
        else if (action==='down') this.softDrop();
        else if (action==='drop') this.hardDrop();
        else if (action==='hold') this.holdPiece();
        this.draw();
    }

    updateScoreboard() {
        document.getElementById('score-value').textContent = this.score;
        document.getElementById('lines-value').textContent = this.lines;
        document.getElementById('level-value').textContent = this.level;
        document.getElementById('highscore-value').textContent = this.highscore;
    }

    start(){ this.paused=false; this.lastTime=performance.now(); }
    togglePause(){ this.paused = !this.paused; document.getElementById('pause-btn').textContent = this.paused? 'Resume':'Pause'; }

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

    drawHold() {
        holdCtx.setTransform(1,0,0,1,0,0);
        holdCtx.clearRect(0,0,holdCanvas.width,holdCanvas.height);
        holdCtx.scale(30/40, 30/40);
        holdCtx.fillStyle = 'rgba(10,12,20,1)';
        holdCtx.fillRect(0,0,4,4);
        if (!this.hold) return;
        const type = this.hold;
        const matrix = SHAPES[type][0];
        const offsetX = Math.floor((4 - matrix[0].length)/2);
        const offsetY = Math.floor((4 - matrix.length)/2);
        for (let y=0;y<matrix.length;y++){
            for (let x=0;x<matrix[y].length;x++){
                if (matrix[y][x]) {
                    holdCtx.fillStyle = COLORS[type];
                    holdCtx.fillRect(offsetX + x, offsetY + y, 1,1);
                    holdCtx.strokeStyle = 'rgba(0,0,0,0.25)';
                    holdCtx.lineWidth = 0.05;
                    holdCtx.strokeRect(offsetX + x, offsetY + y, 1,1);
                }
            }
        }
    }
}

// Start the game
const game = new Game();
