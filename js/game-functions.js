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

function newGame() {
    gameOverPanel.classList.remove('load-in');
    currentCard = pullRandomCard();
    nextCard = pullRandomCard(cardDeck, "next");
    startGame();
}
function startGame() {
    createFullBoard();
    cardDisplay.textContent = currentCard;
    nextCardDisplay.textContent = `Next Card: ${nextCard}`;

    if (isPassAndPlayEnabled()) {
        alert("Pass and Play mode is not available yet. Please check back later for updates!");
    }
    else if (playerTurnActive) {
        playerTurn();
    } else {
        AITurn();
    }
}


function checkPaths() {

}
function pullRandomCard(cardDeckList = cardDeck, cardNum = "current") {
    if (cardNum === "current") {
        return cardDeckList[Math.floor(Math.random() * cardDeckList.length)];
    } else if (cardNum === "next") {
        return cardDeckList.filter(card => card !== currentCard)[Math.floor(Math.random() * cardDeckList.length)];
    }
}

function playerTurn() {

}
function AITurn() {

}

function endGame(result, playerScore, aiScore, creditsEarned) {
    gameOverPanel.classList.remove('win', 'lose', 'tie');
    gameOverPanel.querySelector('.final-your-score').textContent = `Your Score: ${playerScore}`;
    gameOverPanel.querySelector('.final-ai-score').textContent = `AI Score: ${aiScore}`;
    if (result === 'win') {
        playSound(sfx.win);
        gameOverPanel.querySelector('h2').textContent = "You Win!";
        gameOverPanel.classList.add('win');
        gameOverPanel.querySelector('.credits-result').textContent = `Credits Earned: ${creditsEarned}`;
    } else if (result === 'lose') {
        playSound(sfx.lose);
        gameOverPanel.querySelector('h2').textContent = "You Lose!";
        gameOverPanel.classList.add('lose');
    } else {
        gameOverPanel.querySelector('h2').textContent = "It's a Tie!";
        gameOverPanel.classList.add('tie');
    }
    gameOverPanel.classList.add('load-in');
}

startGame();
