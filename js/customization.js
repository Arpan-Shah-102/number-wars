let themeSelectBtns = document.querySelectorAll('.theme-select');
document.body.className = getCurrentTheme();
themeSelectBtns.forEach(b => b.classList.remove('selected'));
document.querySelector(`.theme-select[data-theme="${getCurrentTheme()}"]`).classList.add('selected');

themeSelectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let theme = btn.dataset.theme;
        setTheme(theme);
        playSound(sfx.action);
        themeSelectBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    });
});
