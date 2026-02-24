let playerTurnActive = true;
let isFirstTurn = true;
let score = {
    player: 0,
    ai: 0
}
let cardDeck = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let currentCard = pullRandomCard();
let modifiedCardDeck = [...cardDeck.filter(card => card !== currentCard)];
let nextCard = pullRandomCard(modifiedCardDeck, "next");

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
    isFirstTurn = true;
    playerTurnActive = true;
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
    if (getActiveModifiers().includes('ai-first')) {playerTurnActive = false;}

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
        return cardDeckList[Math.floor(Math.random() * cardDeckList.length)];
    }
}
function shuffleCards() {
    currentCard = nextCard;
    modifiedCardDeck = [...cardDeck.filter(card => card !== currentCard)];
    nextCard = pullRandomCard(modifiedCardDeck, "next");
    cardDisplay.textContent = currentCard;
    nextCardDisplay.textContent = `Next Card: ${nextCard}`;
}
let scorePopups = document.querySelectorAll('.floating-indicator');
function scorePopup(points, side = 'player') {
    let popup = side === 'player' ? scorePopups[0] : scorePopups[1];
    popup.textContent = `+${points}`;
    popup.classList.add('shown');
    setTimeout(() => {
        popup.classList.remove('shown');
    }, 1000);
}
let miniPopups = document.querySelectorAll('.mini-card');
function miniCardPopup(card, side = 'player') {
    let popup = side === 'player' ? miniPopups[1] : miniPopups[0];
    popup.textContent = card;
    popup.classList.add('shown');
    setTimeout(() => {
        popup.classList.remove('shown');
    }, 750);
}

function AITurn() {
    playerTurnActive = true;
    removeCellClickListener();
    makeAIMove((cell) => {
        addCellClickListener();
        calculatePoints(cell, 'ai');
        nextTurn();
    });
}
function nextTurn() {
    setTimeout(() => {
        if (isBoardFull() || (getGamemode() == 'sudden-death' && (score.player >= 10 || score.ai >= 10))) {
            addBonusPoints(() => {
                if (score.player > score.ai) {
                    endGame('win', score.player, score.ai, score.player * 0.1.toFixed(1));
                } else if (score.player < score.ai) {
                    endGame('lose', score.player, score.ai, 0);
                } else {
                    endGame('tie', score.player, score.ai, 0);
                }
            });
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
    let aiCard = pullRandomCard();
    let timeoutDuration = isFirstTurn && getActiveModifiers().includes('ai-first') ? 100 : 1250 + ((Math.random() * 500) - 250);
    isFirstTurn = false;
    // Placeholder AI logic: Random move with chance influenced by difficulty
    // if (Math.random() < chance) {

    // }
    if (Math.random() < chance) {
        cellIndex = Math.floor(Math.random() * gameboardCells.length);
        while (!gameboardCells[cellIndex].classList.contains('empty')) {
            cellIndex = Math.floor(Math.random() * gameboardCells.length);
        }
    } else {
        cellIndex = Math.floor(Math.random() * gameboardCells.length);
        while (!gameboardCells[cellIndex].classList.contains('empty')) {
            cellIndex = Math.floor(Math.random() * gameboardCells.length);
        }
    }
    setTimeout(() => {
        fillCell(cellIndex, aiCard, 'ai');
        if (callback) callback(cellIndex);
    }, timeoutDuration);
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
        scorePopup(pointsEarned, side);
        setTimeout(() => {
            playSound(sfx.mediumAction);
        }, 300);
    }
}
function addBonusPoints(callback) {
    let playerCells = document.querySelectorAll('.map-cell.green');
    let aiCells = document.querySelectorAll('.map-cell.red');
    let playerBonus = 0;
    let aiBonus = 0;
    if (!getActiveModifiers().includes('no-bonus-points')) {
        playerCells.forEach((cell, index) => {
            playerBonus++;
            setTimeout(() => {
                cell.classList.add('bonus-point');
                setTimeout(() => {cell.classList.remove('bonus-point');}, 250);
            }, 100 * index);
        });
        setTimeout(() => {
            aiCells.forEach((cell, index) => {
                aiBonus++;
                setTimeout(() => {
                    cell.classList.add('bonus-point');
                    setTimeout(() => {cell.classList.remove('bonus-point');}, 250);
                }, 100 * index);
            });
        }, 100 * playerCells.length);
        setTimeout(() => {
            scorePopup(playerBonus, 'player');
        }, 100 * playerCells.length);
        setTimeout(() => {
            scorePopup(aiBonus, 'ai');
        }, 100 * (playerCells.length + aiCells.length));
    } else {
        terminal.textContent = "No bonus points awarded due to active modifier.";
    }
    setTimeout(() => {
        score.player += playerBonus;
        score.ai += aiBonus;
        playerPointsLabel.textContent = score.player;
        aiPointsLabel.textContent = score.ai;

        if (score.player > score.ai) {
            gameboard.classList.add('green-fade');
            setTimeout(() => {
                gameboard.classList.remove('green-fade');
            }, 750);
        } else if (score.player < score.ai) {
            gameboard.classList.add('red-fade');
            setTimeout(() => {
                gameboard.classList.remove('red-fade');
            }, 750);
        } else if (score.player === score.ai) {
            gameboard.classList.add('yellow-fade');
            setTimeout(() => {
                gameboard.classList.remove('yellow-fade');
            }, 750);
        }
        if (callback) {
            setTimeout(callback, 750);
        }
    }, 100 * (playerCells.length + aiCells.length) + 500);
}
function findPoints(cell, points, side = playerTurnActive ? 'player' : 'ai') {
    let cellColumn = cell % gameboardWidth;
    let cellRow = Math.floor(cell / gameboardWidth);
    let cellValue = parseInt(gameboardCells[cell].dataset.value);
    let adjacentCells = gameboardConnections[`${cellRow},${cellColumn}`] || [];
    let cellsToClaim = new Set();
    
    adjacentCells.forEach(connectedCellKey => {
        const [r, c] = connectedCellKey.split(',').map(Number);
        const connectedCellIndex = r * gameboardWidth + c;
        // Skip empty cells to avoid NaN values
        if (!gameboardCells[connectedCellIndex] || gameboardCells[connectedCellIndex].classList.contains('empty')) return;
        const connectedCellValue = parseInt(gameboardCells[connectedCellIndex].dataset.value);

        if (connectedCellValue === cellValue) {
            points++;
            cellsToClaim.add(connectedCellIndex);
            cellsToClaim.add(cell);
        }

        if (connectedCellValue + cellValue == 10) {
            points += 2;
            cellsToClaim.add(connectedCellIndex);
            cellsToClaim.add(cell);
        }
    });

    function getCellIndex(key) {
        const [r, c] = key.split(',').map(Number);
        return r * gameboardWidth + c;
    }

    function getCellKey(index) {
        const r = Math.floor(index / gameboardWidth);
        const c = index % gameboardWidth;
        return `${r},${c}`;
    }

    function getOccupiedNeighbors(cellIndex) {
        const key = getCellKey(cellIndex);
        const neighbors = gameboardConnections[key] || [];
        const result = [];
        neighbors.forEach(nKey => {
            const nIndex = getCellIndex(nKey);
            if (gameboardCells[nIndex] && !gameboardCells[nIndex].classList.contains('empty')) {
                result.push(nIndex);
            }
        });
        return result;
    }

    function walkChain(currentIndex, currentValue, direction, visited) {
        const expectedNext = (currentValue + direction + 10) % 10;
        const neighbors = getOccupiedNeighbors(currentIndex);

        let bestChain = [];

        for (const nIndex of neighbors) {
            if (visited.has(nIndex)) continue;

            const nValue = parseInt(gameboardCells[nIndex].dataset.value);

            if (nValue !== expectedNext) continue;

            visited.add(nIndex);

            const subChain = walkChain(nIndex, nValue, direction, visited);

            const candidate = [nIndex, ...subChain];

            if (candidate.length > bestChain.length) {
                bestChain = candidate;
            }

            visited.delete(nIndex);
        }

        return bestChain;
    }

    let visitedUp = new Set([cell]);
    let upChain = walkChain(cell, cellValue, +1, visitedUp);

    let visitedDown = new Set([cell]);
    let downChain = walkChain(cell, cellValue, -1, visitedDown);

    let fullSequence = [...downChain.reverse(), cell, ...upChain];

    if (fullSequence.length >= 3) {
        points += fullSequence.length;
        fullSequence.forEach(idx => cellsToClaim.add(idx));
    }

    // --- Claim all scored cells ---
    cellsToClaim.forEach(idx => {
        changeCell(idx, side === 'player' ? 'red' : 'green');
    });

    return points;
}

function endGame(result, playerScore, aiScore, creditsEarned) {
    gameOverPanel.classList.remove('win', 'lose', 'tie');
    gameOverPanel.querySelector('.final-your-score').textContent = `Your Score: ${playerScore}`;
    gameOverPanel.querySelector('.final-ai-score').textContent = `AI Score: ${aiScore}`;
    updateStatsData('gamesPlayed', 1);
    calcCredits(creditsEarned);
    updateTotalPointDisplays();

    if (result === 'win') {
        playSound(sfx.win);
        gameOverPanel.querySelector('h2').textContent = "You Win!";
        gameOverPanel.classList.add('win');
        gameOverPanel.querySelector('.credits-result').textContent = `Credits Earned: ${creditsEarned}`;
        updateStatsData('wins', 1);
        updateStatsData('currentWinStreak', 1);
        if (getStats().currentWinStreak > getStats().highestWinStreak) {
            updateStatsData('highestWinStreak', 1);
        }
    } else if (result === 'lose') {
        playSound(sfx.lose);
        gameOverPanel.querySelector('h2').textContent = "You Lose!";
        gameOverPanel.classList.add('lose');
        updateStatsData('losses', 1);
        updateStatsData('currentWinStreak', 0, 'set');
    } else {
        playSound(sfx.lose);
        gameOverPanel.querySelector('h2').textContent = "It's a Tie!";
        gameOverPanel.classList.add('tie');
        updateStatsData('ties', 1);
        updateStatsData('currentWinStreak', 0, 'set');
    }

    gameOverPanel.classList.add('load-in');
    updateStatsData('winRate', calculateWinRate(), 'set');
    if (getStats().highScores.overall < playerScore) {updateStatsData('overall', playerScore, 'set');}
    if (getStats().highScores.classic < playerScore && getGamemode() === 'classic') {updateStatsData('classic', playerScore, 'set');}
    if (getStats().highScores.blitz < playerScore && getGamemode() === 'blitz') {updateStatsData('blitz', playerScore, 'set');}
    if (getStats().highScores.suddenDeath < playerScore && getGamemode() === 'sudden-death') {updateStatsData('suddenDeath', playerScore, 'set');}
    if (getStats().highScores.chainReaction < playerScore && getGamemode() === 'chain-reaction') {updateStatsData('chainReaction', playerScore, 'set');}
    if (getStats().highScores.reverseRules < playerScore && getGamemode() === 'reverse-rules') {updateStatsData('reverseRules', playerScore, 'set');}
    if (getStats().highScores.mirrorMatch < playerScore && getGamemode() === 'mirror-match') {updateStatsData('mirrorMatch', playerScore, 'set');}
    if (getStats().highScores.subtraction < playerScore && getGamemode() === 'subtraction') {updateStatsData('subtraction', playerScore, 'set');}
    if (getStats().highScores.ludicrouslyLucky < playerScore && getGamemode() === 'ludicrously-lucky') {updateStatsData('ludicrouslyLucky', playerScore, 'set');}
    if (getStats().highScores.forOfWar < playerScore && getGamemode() === 'for-of-war') {updateStatsData('forOfWar', playerScore, 'set');}
    if (getStats().highScores.territorial < playerScore && getGamemode() === 'territorial') {updateStatsData('territorial', playerScore, 'set');}
    updateStats();
    updateShopItems();
}

function handleCellClick(cell, index) {
    if (playerTurnActive && cell.classList.contains('empty')) {
        fillCell(index, currentCard);
        playerTurnActive = false;
        calculatePoints(index);
        nextTurn();
    }
}
let cellClickHandlers = new Map();
function addCellClickListener() {
    gameboardCells.forEach((cell, index) => {
        const handler = () => handleCellClick(cell, index);
        cellClickHandlers.set(index, handler);
        cell.addEventListener('click', handler);
    });
}
function removeCellClickListener() {
    gameboardCells.forEach((cell, index) => {
        const handler = cellClickHandlers.get(index);
        if (handler) {
            cell.removeEventListener('click', handler);
            cellClickHandlers.delete(index);
        }
    });
}
function fillCell(cell, value, side = 'player') {
    let cellBlock = gameboardCells[cell];
    cellBlock.classList.remove('empty');
    cellBlock.classList.add('occupied');
    cellBlock.textContent = value;
    cellBlock.dataset.value = value;
    cellBlock.classList.add('placing');
    setTimeout(() => {
        cellBlock.classList.remove('placing');
    }, 500);
    if (side === 'player') {
        miniCardPopup(value, 'player');
    } else if (side === 'ai') {
        miniCardPopup(value, 'ai');
    }
}
function changeCell(cell, newClass) {
    let cellBlock = gameboardCells[cell];
    cellBlock.classList = "map-cell " + newClass;
    cellBlock.classList.add('matched');
    setTimeout(() => {
        cellBlock.classList.remove('matched');
    }, 500);
}

startGame();


let powerUpButtons = document.querySelectorAll('.powerup.activate-menu');
function replaceCardActivate() {
}
function skipAITurnActivate() {
}
function viewNextCardActivate() {
}
function undoMoveActivate() {
}
function pickCardActivate() {
}
function doubleCreditsActivate() {
}
