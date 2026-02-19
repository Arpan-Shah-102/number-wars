let themeSelectBtns = document.querySelectorAll('.theme-select');
document.body.className = getCurrentTheme();
themeSelectBtns.forEach(b => b.classList.remove('selected'));
document.querySelector(`.theme-select[data-theme="${getCurrentTheme()}"]`).classList.add('selected');

function updateThemeBtns() {
    let unlockedThemes = getUnlockedThemes();
    themeSelectBtns.forEach(btn => {
        let theme = btn.dataset.theme;
        if (unlockedThemes.includes(theme)) {
            btn.classList.remove('locked');
            btn.disabled = false;
            btn.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
        } else {
            btn.classList.add('locked');
            btn.disabled = true;
        }
    });
}
themeSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let theme = btn.dataset.theme;
        setTheme(theme);
        playSound(sfx.action);
        themeSelectBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

let iconPackSelectBtns = document.querySelectorAll('.icon-pack.light');
iconPackSelectBtns.forEach(b => b.classList.remove('selected'));
document.querySelector(`.icon-pack.light[data-icon-pack="${getCurrentIconPack()}"]`).classList.add('selected');

function updateIconPackBtns() {
    let unlockedIconPacks = getUnlockedIconPacks();
    iconPackSelectBtns.forEach(btn => {
        let iconPack = btn.dataset.iconPack;
        if (unlockedIconPacks.includes(iconPack)) {
            btn.classList.remove('locked');
            btn.disabled = false;
            btn.querySelector(' p').textContent = iconPack.charAt(0).toUpperCase() + iconPack.slice(1);
        } else {
            btn.classList.add('locked');
            btn.disabled = true;
        }
    });
}
iconPackSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let iconPack = btn.dataset.iconPack;
        setIconPack(iconPack);
        playSound(sfx.action);
        iconPackSelectBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});

let changeBoardSizeDropdown = document.querySelector('.board-size-select');
changeBoardSizeDropdown.value = `${getGameboardSize()[0]}x${getGameboardSize()[1]}`;
function updateBoardSizeDropdown() {
    let unlockedSizes = getUnlockedGameboardSizes();
    changeBoardSizeDropdown.querySelectorAll('option').forEach(option => {
        let size = option.value.split('x').map(Number);
        if (unlockedSizes.some(s => s[0] === size[0] && s[1] === size[1])) {
            option.disabled = false;
            option.classList.remove('locked');
            option.textContent = option.textContent.replace('🔒 ', '');
        } else {
            option.disabled = true;
            option.classList.add('locked');
        }
    });
}
changeBoardSizeDropdown.addEventListener('change', () => {
    let [newHeight, newWidth] = changeBoardSizeDropdown.value.split('x').map(Number);
    createFullBoard(newHeight, newWidth);
    playSound(sfx.action);
});

let changeAIDifficultyDropdown = document.querySelector('.ai-difficulty-select');
changeAIDifficultyDropdown.value = getAIDificulty();
function updateAIDifficultyDropdown() {
    let unlockedDifficulties = getUnlockedAIDifficulties();
    changeAIDifficultyDropdown.querySelectorAll('option').forEach(option => {
        let difficulty = parseFloat(option.value);
        if (unlockedDifficulties.includes(difficulty)) {
            option.disabled = false;
            option.classList.remove('locked');
            option.textContent = option.textContent.replace('🔒 ', '');
        } else {
            option.disabled = true;
            option.classList.add('locked');
        }
    });
}
changeAIDifficultyDropdown.addEventListener('change', () => {
    setAIDifficulty(changeAIDifficultyDropdown.value);
    playSound(sfx.action);
    updateCreditsMultiplierDisplay();
});

let changeGameModeDropdown = document.querySelector('.gamemode-select');
changeGameModeDropdown.value = getGamemode();
function updateGameModeDropdown() {
    let unlockedGamemodes = getUnlockedGamemodes();
    changeGameModeDropdown.querySelectorAll('option').forEach(option => {
        let gamemode = option.value;
        if (unlockedGamemodes.includes(gamemode)) {
            option.disabled = false;
            option.classList.remove('locked');
            option.textContent = option.textContent.replace('🔒 ', '');
        } else {
            option.disabled = true;
            option.classList.add('locked');
        }
    });
}
changeGameModeDropdown.addEventListener('change', () => {
    setGamemode(changeGameModeDropdown.value);
    playSound(sfx.action);
    updateCreditsMultiplierDisplay();
});

let modifierCheckboxes = document.querySelectorAll('input.modifier');
function updateModifierCheckboxes() {
    let activeModifiers = getActiveModifiers();
    modifierCheckboxes.forEach(checkbox => {
        if (activeModifiers.includes(checkbox.value)) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
    let unlockedModifiers = getUnlockedModifiers();
    modifierCheckboxes.forEach(checkbox => {
        if (unlockedModifiers.includes(checkbox.value)) {
            checkbox.disabled = false;
            checkbox.classList.remove('locked');
            checkbox.parentElement.querySelector('span').textContent = checkbox.parentElement.querySelector('span').textContent.replace('🔒 ', '');
        } else {
            checkbox.disabled = true;
            checkbox.classList.add('locked');
        }
    });
}
modifierCheckboxes.forEach(checkbox => {
    checkbox.checked = getActiveModifiers().includes(checkbox.value);
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            addActiveModifier(checkbox.value);
        } else {
            removeActiveModifier(checkbox.value);
        }
        playSound(sfx.action);
        updateCreditsMultiplierDisplay();
    });
});

let normalStats = document.querySelectorAll('.stat');
let highScoreStats = document.querySelectorAll('.hs-stat');
function updateStats() {
    let stats = getStats();
    normalStats.forEach(stat => {
        let key = stat.dataset.statKey;
        stat.querySelector(' h3').textContent = stats[key];

        if (key === 'winRate') {
            stat.querySelector(' h3').textContent = stats[key] + '%';
        }
    });
    highScoreStats.forEach(stat => {
        let key = stat.dataset.statKey;
        stat.querySelector(' h3').textContent = stats.highScores[key];
    });
}
updateStats();

let casinoGameBtns = document.querySelectorAll('.casino-game-btn');
function updateCasinoGames() {
    casinoGameBtns.forEach(game => {
        let gameType = game.dataset.casinoGame;
        if (getUnlockedCasinoGames().includes(gameType)) {
            game.classList.add('unlocked');
        }
        if (getCasinoGamePrices()[gameType] <= getCredits()) {
            game.classList.add('unlockable');
        }
    });
}

let powerupBtns = document.querySelectorAll('.powerups-display .powerup');
function updatePowerupButtons() {
    powerupBtns.forEach(btn => {
        let powerupName = btn.dataset.powerupName;
        let remaining = getPowerups(powerupName);
        btn.querySelector('.remaining').textContent = remaining[powerupName];
        if (remaining[powerupName] > 0) {
            btn.classList.remove('disabled');
            disabled = false;
        } else {
            btn.classList.add('disabled');
            disabled = true;
        }
        updateCreditsMultiplierDisplay();
    });
}

let shopItems = document.querySelectorAll('.shop-itm');
function getShopItemMeta(button) {
    const ds = button.dataset;
    if (ds.powerup) return { category: "powerups", key: ds.powerup, repeatable: true };
    if (ds.size) return { category: "boardSizes", key: ds.size };
    if (ds.gamemode) return { category: "gamemodes", key: ds.gamemode };
    if (ds.modifier) return { category: "modifiers", key: ds.modifier };
    if (ds.difficulty) return { category: "aiDifficulties", key: ds.difficulty };
    if (ds.theme) return { category: "themes", key: ds.theme };
    if (ds.pack) return { category: "iconPacks", key: ds.pack };
    if (ds.bundle) return { category: "bundles", key: ds.bundle, repeatable: true };
    if (ds.multiplierUpgrade) return { category: "multiplierUpgrade", key: ds.multiplierUpgrade, repeatable: true };
    return null;
}
function updateShopItems() {
    const credits = getCredits();

    shopItems.forEach(item => {
        const button = item.querySelector('button');
        const price = parseFloat(button.dataset.price);
        const meta = getShopItemMeta(button);

        item.classList.remove('bought', 'unlockable');
        button.disabled = false;

        if (!meta) return;

        const bought = !meta.repeatable && isStoreItemBought(meta.category, meta.key);
        if (bought) {
            item.classList.add('bought');
            button.disabled = true;
            return;
        }

        if (price <= credits) {
            item.classList.add('unlockable');
        } else {
            button.disabled = true;
        }
    });
}
shopItems.forEach(item => {
    item.querySelector('button').addEventListener('click', () => {
        const button = item.querySelector('button');
        const price = parseFloat(button.dataset.price);
        const meta = getShopItemMeta(button);

        if (price <= getCredits()) {
            calcCredits(price, '-');

            if (meta) {
                if (!meta.repeatable) {
                    buyStoreItem(meta.category, meta.key);
                }

                // Actually unlock the item
                switch (meta.category) {
                    case 'boardSizes':
                        let [h, w] = meta.key.split('x').map(Number);
                        unlockGameboardSize([h, w]);
                        break;
                    case 'gamemodes':
                        unlockGamemode(meta.key);
                        break;
                    case 'modifiers':
                        unlockModifier(meta.key);
                        break;
                    case 'aiDifficulties':
                        unlockAIDifficulty(parseFloat(meta.key));
                        break;
                    case 'themes':
                        unlockTheme(meta.key);
                        break;
                    case 'iconPacks':
                        unlockIconPack(meta.key);
                        break;
                    case 'powerups':
                        addPowerup(meta.key, 1);
                        break;
                    case 'bundles':
                        let bundleData = getStoreItemsAndPrices().bundles.find(b => b.name === meta.key);
                        if (bundleData) {
                            if (bundleData.themes) bundleData.themes.forEach(t => unlockTheme(t));
                            if (bundleData.iconPacks) bundleData.iconPacks.forEach(ip => unlockIconPack(ip));
                            if (bundleData.modifiers) bundleData.modifiers.forEach(m => unlockModifier(m));
                            if (bundleData.boardSizes) bundleData.boardSizes.forEach(s => {
                                let [bh, bw] = s.split('x').map(Number);
                                unlockGameboardSize([bh, bw]);
                            });
                            if (bundleData.powerups) bundleData.powerups.forEach(p => addPowerup(p.name, p.quantity));
                        }
                        break;
                    case 'multiplierUpgrade':
                        let upgradeStats = getMultiplierUpgradeStats();
                        upgradeStats.level += 1;
                        upgradeStats.multiplier += 0.1;
                        upgradeStats.price = Math.round(upgradeStats.price * 1.5);
                        localStorage.setItem('multiplierUpgradeStats', JSON.stringify(upgradeStats));
                        break;
                }
            }

            initalizeCustomization();
            playSound(sfx.action);
        } else {
            alert("You don't have enough credits to buy this item.");
        }
    });
});

let creditsMultiplierDisplay = document.querySelector('.multiplier-value');
let creditsMultiplierExpanded = document.querySelector('.custom-multipliers');
let totalMultiplierDisplay = document.querySelector('.total-multiplier p span');
function updateCreditsMultiplierDisplay() {
    creditsMultiplierExpanded.innerHTML = '';
    let multiplier = getMultiplierUpgradeStats().multiplier;
    let multiplierAmounts = getMultiplierAmounts();

    let aiDifficulty = getAIDificulty();
    let gamemode = getGamemode();
    let modifiers = getActiveModifiers();

    for (let key in multiplierAmounts) {
        if (key == getAIDificultyName()[aiDifficulty] || key == gamemode || modifiers.includes(key)) {
            multiplier += multiplierAmounts[key];

            let multiplierElement = document.createElement('div');
            multiplierElement.classList.add('multiplier');
            multiplierElement.classList.add(multiplierAmounts[key] > 0 ? 'positive' : 'negative');

            let p1 = document.createElement('p');
            if (key == getAIDificultyName()[aiDifficulty]) {
                p1.textContent = `${formatText(key)} AI`;
            } else if (key == gamemode) {
                p1.textContent = `${formatText(key)} Gamemode`;
            } else {
                p1.textContent = `${formatText(key)} Modifier`;
            }
            let p2 = document.createElement('p');
            p2.textContent = `${multiplierAmounts[key] > 0 ? '+' : ''}${multiplierAmounts[key]}`;
            
            multiplierElement.appendChild(p1);
            multiplierElement.appendChild(p2);
            creditsMultiplierExpanded.appendChild(multiplierElement);
        }
    }
    creditsMultiplierDisplay.textContent = multiplier.toFixed(2);
    totalMultiplierDisplay.textContent = `${multiplier.toFixed(2)}x`;
    if (multiplier > 1) {
        totalMultiplierDisplay.parentElement.parentElement.classList.add('positive');
        totalMultiplierDisplay.parentElement.parentElement.classList.remove('negative');
    } else if (multiplier < 1) {
        totalMultiplierDisplay.parentElement.parentElement.classList.add('negative');
        totalMultiplierDisplay.parentElement.parentElement.classList.remove('positive');
    }
}

let allCreditsDisplays = document.querySelectorAll('.credits-display');
function updateTotalPointDisplays() {
    let credits = getCredits();
    allCreditsDisplays.forEach(display => {
        display.textContent = credits.toFixed(1);
    });
}

function initalizeCustomization() {
    updateThemeBtns();
    updateIconPackBtns();
    updateBoardSizeDropdown();
    updateAIDifficultyDropdown();
    updateGameModeDropdown();
    updateModifierCheckboxes();
    updateShopItems();
    updateCreditsMultiplierDisplay();
    updateCasinoGames();
    updatePowerupButtons();
    updateTotalPointDisplays();
}
initalizeCustomization();
