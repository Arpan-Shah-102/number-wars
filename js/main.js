alert("This game is still in development. Some aspects may not be added or work properly. Please check back later for updates!");
alert("This game is not optimized for mobile devices at this moment. For the best experience, please play on a desktop or laptop computer. Mobile support will be added in the future.");

changeAIDifficultyDropdown.addEventListener('change', () => {
    newGame();
});
changeBoardSizeDropdown.addEventListener('change', () => {
    newGame();
});
changeGameModeDropdown.addEventListener('change', () => {
    newGame();
});
modifierCheckboxes.forEach(checkbox => {
    checkbox.checked = getActiveModifiers().includes(checkbox.value);
    checkbox.addEventListener('change', () => {
        newGame();
    });
});
passAndPlayCheckbox.addEventListener('change', () => {
    newGame();
});
