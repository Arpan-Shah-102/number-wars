let sfx = {
    win: new Audio('./assets/sounds/win.mp3'),
    lose: new Audio('./assets/sounds/lose.mp3'),
    // tie: new Audio('./assets/sounds/tie.mp3'),
    placeCell: new Audio('./assets/sounds/place-cell.mp3'),
    action: new Audio('./assets/sounds/action.mp3'),
    mediumAction: new Audio('./assets/sounds/medium-action.mp3'),
    actionRejected: new Audio('./assets/sounds/action-rejected.mp3'),
}
let sfxCheckbox = document.querySelector('.sfx-toggle');
sfxCheckbox.addEventListener('change', () => {
    toggleMuted();
});

let passAndPlayCheckbox = document.querySelector('.pass-and-play-toggle');
passAndPlayCheckbox.addEventListener('change', () => {
    togglePassAndPlay();
});

function playSound(sfx) {
    if (!isMuted()) {
        let sound = sfx.cloneNode();
        sound.play();
        sound.addEventListener('ended', () => {
            sound.remove();
        });
    }
}

window.onload = () => {
    if (isMuted()) {
        sfxCheckbox.checked = false;
    }
    if (isPassAndPlayEnabled()) {
        passAndPlayCheckbox.checked = true;
    }
}