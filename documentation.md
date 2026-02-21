# Number Battler Documentation

## customization.js
Manages all non-game UI elements including themes, icon packs, shop, stats, and settings dropdowns.

### updateThemeBtns()
Checks unlocked themes and disables/enables theme select buttons accordingly.

### updateIconPackBtns()
Checks unlocked icon packs and disables/enables icon pack select buttons accordingly.

### updateBoardSizeDropdown()
Checks unlocked board sizes and disables/enables options in the board size dropdown.

### updateAIDifficultyDropdown()
Checks unlocked AI difficulties and disables/enables options in the AI difficulty dropdown.

### updateGameModeDropdown()
Checks unlocked gamemodes and disables/enables options in the gamemode dropdown.

### updateModifierCheckboxes()
Syncs modifier checkboxes with active/unlocked modifiers in localStorage.

### updateStats()
Reads stats from localStorage and updates all `.stat` and `.hs-stat` elements in the DOM.

### updateCasinoGames()
Checks unlocked casino games and marks them as unlocked/unlockable in the UI.

### updatePowerupButtons()
Updates powerup button states based on remaining quantities. Disables buttons with 0 remaining.

### getShopItemMeta(button)
Reads a shop button's dataset and returns an object with `category`, `key`, and optionally `repeatable`.
- **Parameters:** `button` - The shop button element
- **Returns:** `{ category, key, repeatable? }` or `null` if unrecognized

### updateShopItems()
Updates all shop items to reflect bought/unlockable/locked states based on current credits.

### updateCreditsMultiplierDisplay()
Recalculates the total credits multiplier based on active AI difficulty, gamemode, and modifiers. Updates the multiplier display and expanded breakdown list.

### updateTotalPointDisplays()
Updates all `.credits-display` elements with the current credits from localStorage.

### initalizeCustomization()
Calls all update functions to fully sync the UI with the current saved state. Called on page load and after purchases.

---

## game-functions.js
Manages the core game loop including turns, scoring, AI, and game over logic.

### newGame()
Resets scores, cards, and flags then calls `startGame()`. Also hides the game over panel.

### startGame()
Calls `createFullBoard()`, updates card displays, adds click listeners, and triggers `AITurn()` if the `ai-first` modifier is active.

### pullRandomCard(cardDeckList, cardNum)
Returns a random card from the deck.
- `cardNum = "current"` → any card
- `cardNum = "next"` → any card that isn't the current card
- **Returns:** `number`

### shuffleCards()
Advances `currentCard` to `nextCard` and pulls a new `nextCard`. Updates the card display.

### AITurn()
Disables player clicks, triggers `makeAIMove()`, then re-enables clicks, calculates AI points, and calls `nextTurn()`.

### nextTurn()
Checks if the board is full or sudden-death conditions are met. If so, calls `addBonusPoints()` then `endGame()`. Otherwise triggers the next AI turn or restores the player's turn.

### makeAIMove(callback, chance)
Picks a random empty cell and places the AI's card after a delay.
- Delay is ~0ms on the first turn with `ai-first` modifier, otherwise ~1250ms ± 250ms
- **Parameters:** `callback` - Called with the cell index after the move

### calculatePoints(cell, side)
Calls `findPoints()` and adds the result to the appropriate score. Updates the terminal message and score display.
- **Parameters:** `cell` - Cell index, `side` - `'player'` or `'ai'`

### addBonusPoints(callback)
Animates bonus point cells with a scale pulse, then adds one bonus point per colored cell to each player's score. Triggers a gameboard color flash based on who is winning. Calls `callback` after completion.

### findPoints(cell, points, side)
Checks all connections for the placed cell. Awards 1 point for matching values, 2 points for values summing to 10. Changes connected cells to the appropriate color.
- **Parameters:** `cell` - Cell index, `points` - Starting point total, `side` - `'player'` or `'ai'`
- **Returns:** `number` - Total points earned

### endGame(result, playerScore, aiScore, creditsEarned)
Handles end-of-game logic: updates stats, awards credits, updates high scores, and shows the game over panel.
- **Parameters:** `result` - `'win'`, `'lose'`, or `'tie'`

### handleCellClick(cell, index)
Called when a player clicks a cell. Only acts if it's the player's turn and the cell is empty.

### addCellClickListener()
Attaches click handlers to all gameboard cells using a `Map` to store references for later removal.

### removeCellClickListener()
Removes all stored click handlers from gameboard cells and clears the handler map.

### fillCell(cell, value)
Marks a cell as occupied, sets its text content and `data-value` to the given value.

### changeCell(cell, newClass)
Replaces a cell's class list with `map-cell` + the given class (e.g. `'green'`, `'red'`).

---

## gameboard.js
Manages gameboard generation, connections, and SVG connection line rendering.

### generateConnectionsList(height, width, connectionChance)
Randomly generates connections between adjacent cells (horizontal and vertical). With the `maintained-paths` modifier, all possible connections are always created.
- **Default connectionChance:** `0.85`
- **Populates:** `gameboardConnections`

### generateConnections()
Reads `gameboardConnections` and draws SVG lines between connected cells on the `connectionLayer`. Uses `getBoundingClientRect()` for accurate positioning. Populates `connectionLineMap`.

### generateGameboardGrid()
Resets and rebuilds `gameboardGrid` as a 2D array of empty strings matching the current board dimensions.

### generateGameboard()
Clears the gameboard element, sets its grid class, and creates all `.map-cell` elements. Re-queries `gameboardCells` after generation.

### attachCellEventListeners()
Adds `mouseenter`/`mouseleave` listeners to cells to highlight connected cells and SVG lines on hover.

### isBoardFull()
Checks if any cells still have the `empty` class.
- **Returns:** `boolean`

### createFullBoard(height, width)
Master function that calls all generate/attach functions in order to fully build the board. Also saves the new board size to localStorage.

### debounce(func, delay)
Returns a debounced version of a function that delays execution until after `delay` ms have passed since the last call.

---

## main.js
Top-level event listeners that trigger `newGame()` when game settings are changed.

### Listeners
- **changeAIDifficultyDropdown** `change` → `newGame()`
- **changeBoardSizeDropdown** `change` → `newGame()`
- **changeGameModeDropdown** `change` → `newGame()`
- **modifierCheckboxes** `change` → `newGame()`
- **passAndPlayCheckbox** `change` → `newGame()`

---

## menus.js
Manages opening/closing display panels and UI interactions outside the game.

### Listeners
- **menuBtns** - Opens the corresponding display panel
- **displayPanels** - Closes panel when clicking the backdrop
- **displayCloseBtns** - Closes the corresponding panel
- **multiplierDropdown** - Toggles the expanded multiplier breakdown
- **switchToSettingsBtn** - Switches from store panel to options panel
- **gameOverPanel** - Closes panel when clicking the backdrop
- **resetDataBtn** - Double-confirms then clears localStorage and reloads

---

## powerups.js
Manages powerup button click handling and activation.

### powerupFunctions
Array mapping powerup button indices to their activation functions:
`[replaceCardActivate, skipAITurnActivate, viewNextCardActivate, undoMoveActivate, pickCardActivate, doubleCreditsActivate]`

### replaceCardActivate() *(in game-functions.js)*
*(Not yet implemented)* Will replace the current card with a new one.

### skipAITurnActivate() *(in game-functions.js)*
*(Not yet implemented)* Will skip the AI's next turn.

### viewNextCardActivate() *(in game-functions.js)*
*(Not yet implemented)* Will reveal the next card to the player.

### undoMoveActivate() *(in game-functions.js)*
*(Not yet implemented)* Will undo the player's last move.

### pickCardActivate() *(in game-functions.js)*
*(Not yet implemented)* Will allow the player to pick their card value.

### doubleCreditsActivate() *(in game-functions.js)*
*(Not yet implemented)* Will double credits earned for the current game.

---

## sfx-manager.js
Declares all sound effects and manages mute state.

### sfx
Object containing all `Audio` instances:
| Key | File |
|---|---|
| `win` | `win.mp3` |
| `lose` | `lose.mp3` |
| `placeCell` | `place-cell.mp3` |
| `action` | `action.mp3` |
| `mediumAction` | `medium-action.mp3` |
| `actionRejected` | `action-rejected.mp3` |

### playSound(sfx)
Clones and plays a sound if the game is not muted. Cleans up the audio node after playback ends.
- **Parameters:** `sfx` - An `Audio` object from the `sfx` map

---

## utils.js
Manages localStorage data access, game settings, stats, store items, and utility functions.

### Credits
| Function | Description |
|---|---|
| `getCredits()` | Returns current credits as a float |
| `calcCredits(amount, operation)` | Modifies credits using `+`, `-`, `*`, `/`, or `set` |

### Themes
| Function | Description |
|---|---|
| `getCurrentTheme()` | Returns active theme string |
| `setTheme(theme)` | Saves theme and applies it to `document.body` |
| `unlockTheme(theme)` | Adds theme to unlocked list |
| `getUnlockedThemes()` | Returns array of unlocked theme strings |

### Icon Packs
| Function | Description |
|---|---|
| `getCurrentIconPack()` | Returns active icon pack string |
| `setIconPack(iconPack)` | Saves icon pack to localStorage |
| `unlockIconPack(iconPack)` | Adds icon pack to unlocked list |
| `getUnlockedIconPacks()` | Returns array of unlocked icon pack strings |

### Modifiers
| Function | Description |
|---|---|
| `getActiveModifiers()` | Returns array of active modifier strings |
| `getUnlockedModifiers()` | Returns array of unlocked modifier strings |
| `unlockModifier(modifier)` | Adds modifier to unlocked list |
| `addActiveModifier(modifier)` | Activates a modifier |
| `removeActiveModifier(modifier)` | Deactivates a modifier |

### Gamemodes
| Function | Description |
|---|---|
| `getGamemode()` | Returns current gamemode string |
| `setGamemode(gamemode)` | Saves gamemode to localStorage |
| `getUnlockedGamemodes()` | Returns array of unlocked gamemode strings |
| `unlockGamemode(gamemode)` | Adds gamemode to unlocked list |

### Gameboard Size
| Function | Description |
|---|---|
| `getGameboardSize()` | Returns `[height, width]` array |
| `setGameboardSize(size)` | Saves `[height, width]` to localStorage |
| `getUnlockedGameboardSizes()` | Returns array of unlocked `[h, w]` pairs |
| `unlockGameboardSize(size)` | Adds size to unlocked list |

### AI Difficulty
| Function | Description |
|---|---|
| `getAIDificulty()` | Returns AI difficulty as a float (0.2–0.9) |
| `setAIDifficulty(difficulty)` | Saves difficulty to localStorage |
| `getUnlockedAIDifficulties()` | Returns array of unlocked difficulty values |
| `unlockAIDifficulty(difficulty)` | Adds difficulty to unlocked list |
| `getAIDificultyName()` | Returns map of difficulty floats to name strings |

### Powerups
| Function | Description |
|---|---|
| `getPowerups()` | Returns object of all powerup quantities |
| `addPowerup(powerup, quantity)` | Adds quantity to a powerup |
| `removePowerup(powerup)` | Decrements a powerup by 1 |
| `canAcivatePowerup(powerup)` | Returns `true` if powerup quantity > 0 |
| `powerUpsActivateable()` | Returns array of booleans for each powerup slot |

### Stats
| Function | Description |
|---|---|
| `getStats()` | Returns full stats object from localStorage |
| `updateStatsData(stat, amount, operation)` | Updates a stat by key using `add`, `subtract`, `set`, or `reset` |
| `calculateWinRate()` | Calculates and returns win rate as a percentage string |

### Store
| Function | Description |
|---|---|
| `getStoreBoughtItems()` | Returns object of all purchased items by category |
| `isStoreItemBought(category, itemKey)` | Returns `true` if item has been purchased |
| `buyStoreItem(category, itemKey)` | Marks an item as purchased |
| `getMultiplierUpgradeStats()` | Returns `{ level, multiplier, price }` for the multiplier upgrade |
| `getStoreItemsAndPrices()` | Returns full store catalog with names and prices |
| `getMultiplierAmounts()` | Returns map of modifier/gamemode/difficulty keys to their multiplier effect values |

### Misc
| Function | Description |
|---|---|
| `isPassAndPlayEnabled()` | Returns `true` if pass-and-play is enabled |
| `togglePassAndPlay()` | Toggles pass-and-play in localStorage |
| `isMuted()` | Returns `true` if sound is muted |
| `toggleMuted()` | Toggles mute state in localStorage |
| `formatText(text)` | Converts kebab-case to Title Case |
| `exportData()` | *(Not yet implemented)* |
| `importData()` | *(Not yet implemented)* |