const powerupFunctions = [replaceCardActivate, skipAITurnActivate, viewNextCardActivate, undoMoveActivate, pickCardActivate, doubleCreditsActivate];
let powerUpButtons = document.querySelectorAll('.powerup');

powerUpButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (canAcivatePowerup(btn.dataset.powerupName)) {
            
        }
    });
});

