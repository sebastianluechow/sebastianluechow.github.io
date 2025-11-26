// --- DYNAMIC SPOTLIGHT LOGIC ---
const body = document.body;

// Only run this on desktop to save battery on mobile devices
if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Update CSS Variables for the gradient position
        body.style.setProperty('--x', `${x}px`);
        body.style.setProperty('--y', `${y}px`);
    });
}

// --- THEME TOGGLE LOGIC ---
const themeBtn = document.getElementById('theme-toggle');
const themeBody = document.body;

// 1. Check LocalStorage on Load
if (localStorage.getItem('theme') === 'light') {
    themeBody.classList.add('light-mode');
    if(themeBtn) themeBtn.innerText = "DARK";
}

// 2. Button Click
if(themeBtn) {
    themeBtn.addEventListener('click', () => {
        themeBody.classList.toggle('light-mode');
        
        if (themeBody.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            themeBtn.innerText = "DARK";
        } else {
            localStorage.setItem('theme', 'dark');
            themeBtn.innerText = "LIGHT";
        }
    });
}