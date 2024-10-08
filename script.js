const boardElement = document.querySelector('.board');
const message = document.querySelector('.message');
const timerElement = document.querySelector('.timer');
const playAgainButton = document.querySelector('.play-again');
const startGameButton = document.getElementById('start-game');
const gridSizeSelect = document.getElementById('grid-size');
const menu = document.querySelector('.menu');
const moveSound = document.getElementById('move-sound');
let currentPlayer = 'X';
let board = [];
let gameActive = true;
let gridSize = 3;
let timer;
let timeElapsed = 0;

function createBoard(size) {
    boardElement.innerHTML = '';
    const cellSize = size === 3 ? 100 : 40; // 100px for 3x3, 40px for 10x10
    boardElement.style.gridTemplateColumns = `repeat(${size}, ${cellSize}px)`;
    boardElement.style.gridTemplateRows = `repeat(${size}, ${cellSize}px)`;
    board = Array(size * size).fill('');
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.textContent = currentPlayer;

    moveSound.play();

    if (checkWin()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        playAgainButton.style.display = 'block';
        clearInterval(timer);
        return;
    }

    if (board.every(cell => cell !== '')) {
        message.textContent = 'Draw!';
        gameActive = false;
        playAgainButton.style.display = 'block';
        clearInterval(timer);
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin() {
    const winPatterns = gridSize === 3 ? [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ] : generateWinPatterns(10, 4);

    return winPatterns.some(pattern => {
        return pattern.every(index => {
            return board[index] === currentPlayer;
        });
    });
}

function generateWinPatterns(size, matchLength) {
    const patterns = [];

    // Horizontal and vertical win patterns
    for (let i = 0; i < size; i++) {
        for (let j = 0; j <= size - matchLength; j++) {
            const horizontal = [];
            const vertical = [];
            for (let k = 0; k < matchLength; k++) {
                horizontal.push(i * size + j + k);
                vertical.push(j * size + i + k * size);
            }
            patterns.push(horizontal, vertical);
        }
    }

    // Diagonal win patterns
    for (let i = 0; i <= size - matchLength; i++) {
        for (let j = 0; j <= size - matchLength; j++) {
            const diagonal1 = [];
            const diagonal2 = [];
            for (let k = 0; k < matchLength; k++) {
                diagonal1.push((i + k) * size + j + k);
                diagonal2.push((i + k) * size + j + matchLength - 1 - k);
            }
            patterns.push(diagonal1, diagonal2);
        }
    }

    return patterns;
}

function resetGame() {
    gameActive = true;
    currentPlayer = 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;
    playAgainButton.style.display = 'none';
    createBoard(gridSize);
    resetTimer();
}

function startTimer() {
    timeElapsed = 0;
    timerElement.textContent = `Time: ${timeElapsed}s`;
    timer = setInterval(() => {
        timeElapsed++;
        timerElement.textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeElapsed = 0;
    timerElement.textContent = `Time: ${timeElapsed}s`;
    startTimer();
}

startGameButton.addEventListener('click', () => {
    gridSize = parseInt(gridSizeSelect.value);
    menu.style.display = 'none';
    resetGame();
});

playAgainButton.addEventListener('click', () => {
    menu.style.display = 'block';
    resetGame();
});
