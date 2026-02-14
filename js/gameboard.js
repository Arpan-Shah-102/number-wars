let gameboardConnections = {}
let gameboardGrid = [];
let gameboard = document.querySelector('.gameboard');
let connectionLayer = document.querySelector('.gameboard-connections');
let gameboardCells = document.querySelectorAll('.gameboard .map-cell');
let [gameboardHeight, gameboardWidth] = getGameboardSize();

function generateConnectionsList(height = gameboardHeight, width = gameboardWidth, connectionChance = 0.85) {
    gameboardConnections = {};
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const currentCell = `${row},${col}`;
            gameboardConnections[currentCell] = [];
        }
    }

    const consideredConnections = new Set();
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const currentCell = `${row},${col}`;

            if (col < width - 1) {
                const rightCell = `${row},${col + 1}`;
                const pairKey = `${currentCell}|${rightCell}`;

                if (!consideredConnections.has(pairKey)) {
                    consideredConnections.add(pairKey);

                    if (Math.random() < connectionChance) {
                        gameboardConnections[currentCell].push(rightCell);
                        gameboardConnections[rightCell].push(currentCell);
                    }
                }
            }
            if (row < height - 1) {
                const downCell = `${row + 1},${col}`;
                const pairKey = `${currentCell}|${downCell}`;

                if (!consideredConnections.has(pairKey)) {
                    consideredConnections.add(pairKey);

                    if (Math.random() < connectionChance) {
                        gameboardConnections[currentCell].push(downCell);
                        gameboardConnections[downCell].push(currentCell);
                    }
                }
            }
        }
    }
}

let boardPixelHeight = gameboard.offsetHeight;
let boardPixelWidth = gameboard.offsetWidth;
let connectionLineMap = new Map();

function generateConnections() {
    let cellWidth = (boardPixelWidth - 20) / gameboardWidth;
    let cellHeight = (boardPixelHeight - 20) / gameboardHeight;

    const cellPositions = {};
    for (let row = 0; row < gameboardHeight; row++) {
        for (let col = 0; col < gameboardWidth; col++) {
            const cellKey = `${row},${col}`;
            cellPositions[cellKey] = {
                x: (col * cellWidth) + (cellWidth / 2),
                y: (row * cellHeight) + (cellHeight / 2)
            };
        }
    }

    connectionLayer.innerHTML = '';
    connectionLineMap.clear();
    const drawnConnections = new Set();

    for (const [startCell, connectedCells] of Object.entries(gameboardConnections)) {
        const startPos = cellPositions[startCell];

        for (const endCell of connectedCells) {
            const endPos = cellPositions[endCell];
            const connectionKey = [startCell, endCell].sort().join('->');

            if (!drawnConnections.has(connectionKey)) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', startPos.x);
                line.setAttribute('y1', startPos.y);
                line.setAttribute('x2', endPos.x);
                line.setAttribute('y2', endPos.y);
                line.setAttribute('stroke', 'rgba(0, 255, 128, 0.5)');
                line.setAttribute('stroke-width', '12');
                line.classList.add('connection');

                connectionLayer.appendChild(line);
                connectionLineMap.set(connectionKey, line);
                drawnConnections.add(connectionKey);
            }
        }
    }
}

function generateGameboardGrid() {
    gameboardGrid = [];
    for (let row = 0; row < gameboardHeight; row++) {
        let rowArray = [];
        for (let col = 0; col < gameboardWidth; col++) {
            rowArray.push("");
        }
        gameboardGrid.push(rowArray);
    }
}

function generateGameboard() {
    gameboard.innerHTML = '';
    gameboard.className = 'gameboard grid-'+gameboardWidth+'x'+gameboardHeight;
    for (let i = 0; i < gameboardHeight * gameboardWidth; i++) {
        let cell = document.createElement('div');
        cell.classList.add('map-cell');
        cell.classList.add('empty');
        cell.dataset.index = i;
        cell.dataset.value = "";
        let p = document.createElement('p');
        p.textContent = "O";
        cell.appendChild(p);
        gameboard.appendChild(cell);
    }
    gameboardCells = document.querySelectorAll('.gameboard .map-cell')
}

function attachCellEventListeners() {
    gameboardCells.forEach((cell, index) => {
        cell.addEventListener('mouseenter', () => {
            let row = Math.floor(index / gameboardWidth);
            let col = index % gameboardWidth;
            let cellKey = `${row},${col}`;
            let adjacentCells = gameboardConnections[cellKey] || [];

            adjacentCells.forEach(connectedCellKey => {
                const [r, c] = connectedCellKey.split(',').map(Number);
                const connectedCell = gameboardCells[r * gameboardWidth + c];
                connectedCell.classList.add('connection-part');

                const key = [cellKey, connectedCellKey].sort().join('->');
                const line = connectionLineMap.get(key);
                if (line) line.classList.add('connection-part');
            });
        });

        cell.addEventListener('mouseleave', () => {
            gameboardCells.forEach(cell => cell.classList.remove('connection-part'));
            connectionLineMap.forEach(line => line.classList.remove('connection-part'));
        });
    });
}

function createFullBoard(height = getGameboardSize()[0], width = getGameboardSize()[1]) {
    gameboardHeight = height;
    gameboardWidth = width;

    generateGameboardGrid();
    generateGameboard();
    generateConnectionsList();
    generateConnections();
    attachCellEventListeners();

    setGameboardSize([height, width]);
}
createFullBoard();

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Update the resize event listener to use debounce
window.addEventListener('resize', debounce(() => {
    boardPixelHeight = gameboard.offsetHeight;
    boardPixelWidth = gameboard.offsetWidth;
    generateConnections();
}, 150));
