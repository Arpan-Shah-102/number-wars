let playerTurnActive = true;
let score = {
    player: 0,
    ai: 0
}
let cardDeck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let currentCard = pullRandomCard();
let nextCard = pullRandomCard(cardDeck, "next");

let cardDisplay = document.querySelector('.current-card .card-num');
let nextCardDisplay = document.querySelector('.next-card');
let terminal = document.querySelector('.terminal');

let playerPointsLabel = document.querySelector('.player-score.score');
let aiPointsLabel = document.querySelector('.computer-score.score');

function newGame() {
    gameOverPanel.classList.remove('load-in');
    currentCard = pullRandomCard();
    nextCard = pullRandomCard(cardDeck, "next");
    terminal.textContent = "New game started!";
    score.ai = 0;
    score.player = 0;
    playerPointsLabel.textContent = score.player;
    aiPointsLabel.textContent = score.ai;
    startGame();
}
function startGame() {
    createFullBoard();
    cardDisplay.textContent = currentCard;
    nextCardDisplay.textContent = `Next Card: ${nextCard}`;
    addCellClickListener();

    if (isPassAndPlayEnabled()) {
        alert("Pass and Play mode is not available yet. Please check back later for updates!");
    }
    else if (!playerTurnActive) {
        AITurn();
    }
}
function pullRandomCard(cardDeckList = cardDeck, cardNum = "current") {
    if (cardNum === "current") {
        return cardDeckList[Math.floor(Math.random() * cardDeckList.length)];
    } else if (cardNum === "next") {
        return cardDeckList.filter(card => card !== currentCard)[Math.floor(Math.random() * cardDeckList.length)];
    }
}
function shuffleCards() {
    currentCard = pullRandomCard();
    nextCard = pullRandomCard(cardDeck, "next");
    cardDisplay.textContent = currentCard;
    nextCardDisplay.textContent = `Next Card: ${nextCard}`;
}

function AITurn() {
    playerTurnActive = true;
    makeAIMove((cell) => {
        calculatePoints(cell, 'ai');
        nextTurn();
    });
}
function nextTurn() {
    setTimeout(() => {
        if (isBoardFull() || (getGamemode() == 'sudden-death' && (score.player >= 10 || score.ai >= 10))) {
            if (score.player > score.ai) {
                endGame('win', score.player, score.ai, (score.player * parseFloat(creditsMultiplierDisplay.textContent)));
            } else if (score.player < score.ai) {
                endGame('lose', score.player, score.ai, 0);
            } else {
                endGame('tie', score.player, score.ai, 0);
            }
        } else if (!playerTurnActive) {
            cardDisplay.parentElement.parentElement.classList.add('opacity');
            shuffleCards();
            AITurn();
        } else {
            cardDisplay.parentElement.parentElement.classList.remove('opacity');
        }
    }, 100);
}

function makeAIMove(callback, chance = getAIDificulty()) {
    // Placeholder AI logic: Random move with chance influenced by difficulty
    // if (Math.random() < chance) {

    // }
    cellIndex = Math.floor(Math.random() * gameboardCells.length);
    let aiCard = pullRandomCard();
    let timeoutDuration = 1250 + ((Math.random() * 500) - 250);
    while (!gameboardCells[cellIndex].classList.contains('empty')) {
        cellIndex = Math.floor(Math.random() * gameboardCells.length);
    }
    setTimeout(() => {
        fillCell(cellIndex, aiCard);
        if (callback) callback(cellIndex);
    }, 1000);
}
function calculatePoints(cell, side = 'player') {
    let pointsEarned = findPoints(cell, 0);
    if (side === 'player') {
        terminal.textContent = pointsEarned > 0 ? `You scored ${pointsEarned} point${pointsEarned > 1 ? "s" : ""} this turn!` : "You scored no points this turn.";
        score.player += pointsEarned;
        playerPointsLabel.textContent = score.player;
        playSound(sfx.placeCell);
    } else if (side === 'ai') {
        terminal.textContent = pointsEarned > 0 ? `AI scored ${pointsEarned} point${pointsEarned > 1 ? "s" : ""} this turn!` : "AI scored no points this turn.";
        score.ai += pointsEarned;
        aiPointsLabel.textContent = score.ai;
        playSound(sfx.placeCell);
    }
    if (pointsEarned > 0) {
        setTimeout(() => {
            playSound(sfx.mediumAction);
        }, 300);
    }
}
function findPoints(cell, points, side = playerTurnActive ? 'player' : 'ai') {
    let cellColumn = cell % gameboardWidth;
    let cellRow = Math.floor(cell / gameboardWidth);
    let cellValue = parseInt(gameboardCells[cell].dataset.value);
    let adjacentCells = gameboardConnections[`${cellRow},${cellColumn}`] || [];
    
    adjacentCells.forEach(connectedCellKey => {
        const [r, c] = connectedCellKey.split(',').map(Number);
        const connectedCellIndex = r * gameboardWidth + c;
        const connectedCellValue = parseInt(gameboardCells[connectedCellIndex].dataset.value);

        if (connectedCellValue === cellValue) {
            points++;
            changeCell(connectedCellIndex, side === 'player' ? 'red' : 'green');
            changeCell(cell, side === 'player' ? 'red' : 'green');
        }

        if (connectedCellValue + cellValue == 10) {
            points += 2;
            changeCell(connectedCellIndex, side === 'player' ? 'red' : 'green');
            changeCell(cell, side === 'player' ? 'red' : 'green');
        }
    });
    return points;
}
function endGame(result, playerScore, aiScore, creditsEarned) {
    gameOverPanel.classList.remove('win', 'lose', 'tie');
    gameOverPanel.querySelector('.final-your-score').textContent = `Your Score: ${playerScore}`;
    gameOverPanel.querySelector('.final-ai-score').textContent = `AI Score: ${aiScore}`;
    updateStats(gamesPlayed, 1);
    calcCredits(creditsEarned);
    if (result === 'win') {
        playSound(sfx.win);
        gameOverPanel.querySelector('h2').textContent = "You Win!";
        gameOverPanel.classList.add('win');
        gameOverPanel.querySelector('.credits-result').textContent = `Credits Earned: ${creditsEarned}`;
        updateStats(wins, 1);
        updateStats(currentWinStreak, 1);
        if (getStats().currentWinStreak > getStats().highestWinStreak) {
            updateStats(highestWinStreak, 1);
        }
    } else if (result === 'lose') {
        playSound(sfx.lose);
        gameOverPanel.querySelector('h2').textContent = "You Lose!";
        gameOverPanel.classList.add('lose');
        updateStats(losses, 1);
        updateStats(currentWinStreak, 0, 'set');
    } else {
        playSound(sfx.lose);
        gameOverPanel.querySelector('h2').textContent = "It's a Tie!";
        gameOverPanel.classList.add('tie');
        updateStats(ties, 1);
        updateStats(currentWinStreak, 0, 'set');
    }
    gameOverPanel.classList.add('load-in');
}

function addCellClickListener() {
    gameboardCells.forEach((cell, index) => {
        cell.addEventListener('click', () => {
            if (playerTurnActive && cell.classList.contains('empty')) {
                fillCell(index, currentCard);
                // Update player score if needed
                playerTurnActive = false;
                calculatePoints(index);
                nextTurn();
            }
        });
    });
}
function fillCell(cell, value) {
    let cellBlock = gameboardCells[cell];
    cellBlock.classList.remove('empty');
    cellBlock.classList.add('occupied');
    cellBlock.textContent = value;
    cellBlock.dataset.value = value;
}
function changeCell(cell, newClass) {
    let cellBlock = gameboardCells[cell];
    cellBlock.classList = "map-cell " + newClass;
}

startGame();
