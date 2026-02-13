function getCredits() {
    return parseFloat(localStorage.getItem('credits')) || 0;
}
function calcCredits(operation, amount) {
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
    localStorage.setItem('gameboardSize', size);
}
function getUnlockedGameboardSizes() {
    return JSON.parse(localStorage.getItem('unlockedGameboardSizes')) || [[5, 5]];
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
    return JSON.parse(localStorage.getItem('unlockedAIDifficulties')) || ["intermediate", "skilled", "advanced"];
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
        highScores: {
            overall: 0,
            classic: 0,
            blitz: 0,
            suddenDeath: 0,
            chainReaction: 0,
            reverseRules: 0,
            mirrorMatch: 0,
            subtraction: 0,
            ludicrouslyLucky: 0
        }
    }
}
