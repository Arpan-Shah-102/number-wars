const powerupFunctions = [skipAITurnActivate, replaceCardActivate, viewNextCardActivate, undoMoveActivate, pickCardActivate, doubleCreditsActivate];
let powerUpButtons = document.querySelectorAll('.powerup.activate-menu');

powerUpButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (canAcivatePowerup(btn.dataset.powerupName)) {
            powerupFunctions[index]();
        }
    });
});
