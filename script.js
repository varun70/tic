const cells = document.querySelectorAll('[data-cell]');
const currentPlayerDisplay = document.getElementById('current-player');
const result = document.getElementById('result');
const resetButton = document.getElementById('reset');
let currentPlayer = 'X';
let isGameActive = true;

const checkWin = () => {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[b].textContent === cells[c].textContent) {
            isGameActive = false;
            showWinner(currentPlayer);
            cells[a].style.background = cells[b].style.background = cells[c].style.background = 'lightgreen';
        }
    }

    if ([...cells].every(cell => cell.textContent !== '')) {
        isGameActive = false;
        result.innerHTML = 'It\'s a draw!';
    }
};

const showWinner = (player) => {
    result.innerHTML = `Player <span id="current-player">${player}</span> wins!`;
};

const handleCellClick = (cell) => {
    if (cell.textContent === '' && isGameActive) {
        cell.textContent = currentPlayer;
        checkWin();
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        currentPlayerDisplay.textContent = currentPlayer;
    }
};

cells.forEach(cell => {
    cell.addEventListener('click', () => handleCellClick(cell));
});

resetButton.addEventListener('click', () => {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.background = '#0050a7';
    });
    result.innerHTML = '';
    isGameActive = true;
    currentPlayer = 'X';
    currentPlayerDisplay.textContent = currentPlayer;
});
