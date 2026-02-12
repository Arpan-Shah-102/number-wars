let displayPanels = document.querySelectorAll('.main-display');
let displayPannelSector = Array.from(displayPanels).map(panel => document.querySelector('.'+panel.classList[2]));
let displayCloseBtns = Array.from(displayPanels).map(panel => panel.querySelector('.close'));

let tutorialBtn = document.querySelector('.tutorial');
let statsBtn = document.querySelector('.stats');
let optionsBtn = document.querySelector('.options');
let storeBtn = document.querySelector('.store');
let casinoBtn = document.querySelector('.casino');
let powerupsBtn = document.querySelector('.powerups-toggle');

let menuBtns = [statsBtn, tutorialBtn, optionsBtn, storeBtn, casinoBtn, powerupsBtn];
let multiplierDropdown = document.querySelector('.multiplier-display');
let allMultipliersDiv = document.querySelector('.all-multipliers');
let multiplierArrow = multiplierDropdown.querySelector('.triangle');
let switchToSettingsBtn = document.querySelector('.settings-floating');
let gameOverPanel = document.querySelector('.game-over');

menuBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        displayPannelSector[index].classList.add('load-in');
        playSound(sfx.action);
    });
});
displayPanels.forEach((panel, index) => {
    panel.addEventListener('click', (e) => {
        if (e.target === panel) {
            displayPannelSector[index].classList.remove('load-in');
        }
    });
});
displayCloseBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        displayPannelSector[index].classList.remove('load-in');
        playSound(sfx.action);
    });
});

multiplierDropdown.addEventListener('click', () => {
    if (allMultipliersDiv.style.display === 'block') {
        allMultipliersDiv.style.display = 'none';
        multiplierArrow.textContent = '▼';
    } else {
        allMultipliersDiv.style.display = 'block';
        multiplierArrow.textContent = '▲';
    }
    playSound(sfx.action);
});

switchToSettingsBtn.addEventListener('click', () => {
    displayPannelSector[3].classList.remove('load-in');
    displayPannelSector[2].classList.add('load-in');
    playSound(sfx.action);
});
gameOverPanel.addEventListener('click', (e) => {
    if (e.target === gameOverPanel) {
        gameOverPanel.classList.remove('load-in');
    }
});
