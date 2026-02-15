function getCredits() {
    return parseFloat(localStorage.getItem('credits')) || 0;
}
function calcCredits(amount, operation = '+') {
    let currentCredits = getCredits();
    if (operation === 'add' || operation === '+') {
        localStorage.setItem('credits', currentCredits + amount);
    } else if (operation === 'subtract' || operation === '-') {
        localStorage.setItem('credits', currentCredits - amount);
    } else if (operation === 'set') {
        localStorage.setItem('credits', amount);
    } else if (operation === 'multiply' || operation === '*') {
        localStorage.setItem('credits', currentCredits * amount);
    } else if (operation === 'divide' || operation === '/') {
        localStorage.setItem('credits', currentCredits / amount);
    } else {
        return;
    }
}

function isPassAndPlayEnabled() {
    return localStorage.getItem('passAndPlay') == 'true';
}
function togglePassAndPlay() {
    let enabled = isPassAndPlayEnabled();
    localStorage.setItem('passAndPlay', !enabled);
}

function isMuted() {
    return localStorage.getItem('muted') == 'true';
}
function toggleMuted() {
    let muted = isMuted();
    localStorage.setItem('muted', !muted);
}

function getCurrentTheme() {
    return localStorage.getItem('theme') || 'default';
}
function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
}
function unlockTheme(theme) {
    let unlockedThemes = getUnlockedThemes();
    if (!unlockedThemes.includes(theme)) {
        unlockedThemes.push(theme);
        localStorage.setItem('unlockedThemes', JSON.stringify(unlockedThemes));
    }
}
function getUnlockedThemes() {
    return JSON.parse(localStorage.getItem('unlockedThemes')) || ['default', 'dark', 'light', 'nature', 'sunset', 'ocean'];
}

function getCurrentIconPack() {
    return localStorage.getItem('iconPack') || 'default';
}
function setIconPack(iconPack) {
    localStorage.setItem('iconPack', iconPack);
}
function unlockIconPack(iconPack) {
    let unlockedIconPacks = getUnlockedIconPacks();
    if (!unlockedIconPacks.includes(iconPack)) {
        unlockedIconPacks.push(iconPack);
        localStorage.setItem('unlockedIconPacks', JSON.stringify(unlockedIconPacks));
    }
}
function getUnlockedIconPacks() {
    return JSON.parse(localStorage.getItem('unlockedIconPacks')) || ['default'];
}

function getActiveModifiers() {
    return JSON.parse(localStorage.getItem('activeModifiers')) || [];
}
function getUnlockedModifiers() {
    return JSON.parse(localStorage.getItem('unlockedModifiers')) || ["helper-cells"];
}
function unlockModifier(modifier) {
    let unlockedModifiers = getUnlockedModifiers();
    if (!unlockedModifiers.includes(modifier)) {
        unlockedModifiers.push(modifier);
        localStorage.setItem('unlockedModifiers', JSON.stringify(unlockedModifiers));
    }
}
function addActiveModifier(modifier) {
    let activeModifiers = getActiveModifiers();
    if (!activeModifiers.includes(modifier)) {
        activeModifiers.push(modifier);
        localStorage.setItem('activeModifiers', JSON.stringify(activeModifiers));
    }
}
function removeActiveModifier(modifier) {
    let activeModifiers = getActiveModifiers();
    if (activeModifiers.includes(modifier)) {
        activeModifiers = activeModifiers.filter(mod => mod !== modifier);
        localStorage.setItem('activeModifiers', JSON.stringify(activeModifiers));
    }
}

function getGamemode() {
    return localStorage.getItem('gamemode') || 'classic';
}
function setGamemode(gamemode) {
    localStorage.setItem('gamemode', gamemode);
}
function getUnlockedGamemodes() {
    return JSON.parse(localStorage.getItem('unlockedGamemodes')) || ['classic', 'blitz', 'sudden-death'];
}
function unlockGamemode(gamemode) {
    let unlockedGamemodes = getUnlockedGamemodes();
    if (!unlockedGamemodes.includes(gamemode)) {
        unlockedGamemodes.push(gamemode);
        localStorage.setItem('unlockedGamemodes', JSON.stringify(unlockedGamemodes));
    }
}

function getGameboardSize() {
    return JSON.parse(localStorage.getItem('gameboardSize')) || [5, 5];
}
function setGameboardSize(size) {
    localStorage.setItem('gameboardSize', JSON.stringify(size));
}
function getUnlockedGameboardSizes() {
    return JSON.parse(localStorage.getItem('unlockedGameboardSizes')) || [[4, 4], [5, 5], [6, 6]];
}
function unlockGameboardSize(size) {
    let unlockedSizes = getUnlockedGameboardSizes();
    if (!unlockedSizes.includes(size)) {
        unlockedSizes.push(size);
        localStorage.setItem('unlockedGameboardSizes', JSON.stringify(unlockedSizes));
    }
}

function getAIDificulty() {
    return localStorage.getItem('aiDifficulty') || "intermediate";
}
function setAIDifficulty(difficulty) {
    localStorage.setItem('aiDifficulty', difficulty);
}
function getUnlockedAIDifficulties() {
    return JSON.parse(localStorage.getItem('unlockedAIDifficulties')) || [0.4, 0.5, 0.6];
}
function unlockAIDifficulty(difficulty) {
    let unlockedDifficulties = getUnlockedAIDifficulties();
    if (!unlockedDifficulties.includes(difficulty)) {
        unlockedDifficulties.push(difficulty);
        localStorage.setItem('unlockedAIDifficulties', JSON.stringify(unlockedDifficulties));
    }
}

function getPowerups() {
    return JSON.parse(localStorage.getItem('powerups')) || {"skip-ai": 1, "replace-card": 3, "view-next": 1, "undo-move": 1, "pick-card": 0, "double-credits": 0};
}
function minimumPowerupQuantity() {
    return {
        "skip-ai": 1,
        "replace-card": 3,
        "view-next": 1,
        "undo-move": 1,
        "pick-card": 0,
        "double-credits": 0
    }
}
function addPowerup(powerup, quantity = 1) {
    let powerups = getPowerups();
    if (powerups[powerup]) {
        powerups[powerup] += quantity;
    } else {
        powerups[powerup] = quantity;
    }
    localStorage.setItem('powerups', JSON.stringify(powerups));
}
function removePowerup(powerup) {
    let powerups = getPowerups();
    if (powerups[powerup] && powerups[powerup] > 0) {
        powerups[powerup] -= 1;
        localStorage.setItem('powerups', JSON.stringify(powerups));
    }
}

function getStats() {
    return JSON.parse(localStorage.getItem('stats')) || {
        wins: 0,
        losses: 0,
        ties: 0,
        winRate: 0,
        gamesPlayed: 0,
        highestWinStreak: 0,
        currentWinStreak: 0,
        highScores: {
            overall: 0,
            classic: 0,
            blitz: 0,
            suddenDeath: 0,
            chainReaction: 0,
            reverseRules: 0,
            mirrorMatch: 0,
            subtraction: 0,
            ludicrouslyLucky: 0,
            fogOfWar: 0,
            territorial: 0
        }
    }
}
function updateStats(stat, amount, operation = 'add') {
    let stats = getStats();
    if (stats[stat] !== undefined) {
        if (operation === 'add') {
            stats[stat] += amount;
        } else if (operation === 'subtract') {
            stats[stat] -= amount;
        } else if (operation === 'set') {
            stats[stat] = amount;
        } else if (operation === 'reset') {
            stats[stat] = 0;
        }
        localStorage.setItem('stats', JSON.stringify(stats));
    }
}

function getUnlockedCasinoGames() {
    return JSON.parse(localStorage.getItem('unlockedCasinoGames')) || [];
}
function getAllCasinoGames() {
    return ['coin-flip', 'higher-lower', 'slots', 'blackjack', 'dice-duel', 'roulette'];
}
function getCasinoGamePrices() {
    return {
        'coin-flip': 10,
        'higher-lower': 20,
        'slots': 30,
        'blackjack': 40,
        'dice-duel': 50,
        'roulette': 60
    }
}
function unlockCasinoGame(game) {
    let unlockedGames = getUnlockedCasinoGames();
    if (!unlockedGames.includes(game)) {
        unlockedGames.push(game);
        localStorage.setItem('unlockedCasinoGames', JSON.stringify(unlockedGames));
    }
}

function getStoreBoughtItems() {
    return JSON.parse(localStorage.getItem('storeBoughtItems')) || {
        boardSizes: [],
        gamemodes: [],
        modifiers: [],
        aiDifficulties: [],
        themes: [],
        iconPacks: [],
        bundles: [],
    };
}
function isStoreItemBought(category, itemKey) {
    const bought = getStoreBoughtItems();
    return Array.isArray(bought[category]) && bought[category].includes(itemKey);
}
function buyStoreItem(category, itemKey) {
    const bought = getStoreBoughtItems();
    if (!Array.isArray(bought[category])) {
        bought[category] = [];
    }
    if (!bought[category].includes(itemKey)) {
        bought[category].push(itemKey);
        localStorage.setItem('storeBoughtItems', JSON.stringify(bought));
    }
}
function getMultiplierUpgradeStats() {
    return JSON.parse(localStorage.getItem('multiplierUpgradeStats')) || {
        level: 0,
        multiplier: 1.0,
        price: 25,
    };
}
function getStoreItemsAndPrices() {
    return {
        powerups: [
            {name: "skip-ai", price: 1},
            {name: "replace-card", price: 0.5},
            {name: "view-next", price: 1.5},
            {name: "undo-move", price: 2},
            {name: "pick-card", price: 3},
            {name: "double-credits", price: 10}
        ],
        boardSizes: [
            {name: "3x3", price: 2.5},
            {name: "7x7", price: 5},
            {name: "8x8", price: 7.5},
            {name: "9x9", price: 10},
            {name: "10x10", price: 15}
        ],
        gamemodes: [
            {name: "chain-reaction", price: 7.5},
            {name: "reverse-rules", price: 10},
            {name: "mirror-match", price: 15},
            {name: "subtraction", price: 20},
            {name: "ludicrously-lucky", price: 30},
            {name: "fog-of-war", price: 50},
            {name: "territorial", price: 50}
        ],
        modifiers: [
            {name: "ai-first", price: 1},
            {name: "no-bonus-points", price: 2.5},
            {name: "no-powerups", price: 2.5},
            {name: "maintained-paths", price: 7.5},
        ],
        aiDifficulties: [
            {name: 0.2, price: 1},
            {name: 0.3, price: 2},
            {name: 0.7, price: 3},
            {name: 0.8, price: 5},
            {name: 0.9, price: 7.5}
        ],
        themes: [
            {name: "fire", price: 2.5},
            {name: "midnight", price: 5},
            {name: "royal", price: 7.5},
            {name: "lava", price: 12.5},
            {name: "cosmic", price: 25},
            {name: "seafoam", price: 50}
        ],
        iconPacks: [
            {name: "emoji", price: 1},
            {name: "roman", price: 2.5},
            {name: "sci-fi", price: 5}
        ],
        bundles: [
            {
                name: "out-of-this-world",
                themes: ["cosmic"],
                iconPacks: ["sci-fi"],
                modifiers: ["ai-first"],
                boardSizes: ["8x8"],
                price: 35,
            },
            {
                name: "power-booster",
                powerups: [
                    {name: "skip-ai", quantity: 2},
                    {name: "replace-card", quantity: 3},
                    {name: "view-next", quantity: 2},
                    {name: "undo-move", quantity: 2},
                    {name: "pick-card", quantity: 1},
                    {name: "double-credits", quantity: 1}
                ],
                price: 20
            }
        ],
        multiplierUpgrade: {
            name: "buy-multiplier-upgrade",
            level: getMultiplierUpgradeStats().level,
            multiplier: getMultiplierUpgradeStats().multiplier,
            price: getMultiplierUpgradeStats().price
        }
    }
}

function exportData() {}

function importData() {}
