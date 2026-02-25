const powerupFunctions = [skipAITurnActivate, replaceCardActivate, viewNextCardActivate, undoMoveActivate, pickCardActivate, doubleCreditsActivate];

powerUpButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        if (powerUpsActivateable()[index] && canAcivatePowerup(btn.dataset.powerupName)) {
            setPowerUpActivateable(index, false);
            btn.classList.add('disabled');
            console.log(`Power-up ${btn.dataset.powerupName} activated.`);
        } else if (!powerUpsActivateable()[index] && canAcivatePowerup(btn.dataset.powerupName)) {
            setPowerUpActivateable(index, true);
            btn.classList.remove('disabled');
            console.log(`Power-up ${btn.dataset.powerupName} deactivated.`);
        }
        if (canAcivatePowerup(btn.dataset.powerupName)) {
            powerupFunctions[index]();
        }
    });
});
