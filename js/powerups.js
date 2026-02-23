const powerupFunctions = [skipAITurnActivate, replaceCardActivate, viewNextCardActivate, undoMoveActivate, pickCardActivate, doubleCreditsActivate];

powerUpButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (canAcivatePowerup(btn.dataset.powerupName)) {
            powerupFunctions[index]();
        }
    });
});
