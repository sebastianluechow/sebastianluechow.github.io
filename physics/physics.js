// --- PHYSICS SIMULATION (Harmonic Waves) ---
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let time = 0;

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, width, height);
    
    // Check Theme for Color
    const isLight = document.body.classList.contains('light-mode');
    
    // Cyan for Dark Mode, Teal for Light Mode
    const waveColor = isLight ? 'rgba(0, 140, 158, 0.25)' : 'rgba(0, 243, 255, 0.25)';
    const echoColor = isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)';

    // Settings for the wave
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = waveColor;

    // We draw a superposition of two sine waves
    ctx.beginPath();
    for (let x = 0; x < width; x++) {
        
        // Wave 1: Slow and long
        const y1 = 40 * Math.sin(0.005 * x + time);
        
        // Wave 2: Fast and short
        const y2 = 20 * Math.sin(0.02 * x - time * 1.5);
        
        // Vertical centering + Superposition
        const y = height / 2 + y1 + y2;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Draw a second "echo" wave for visual depth
    ctx.beginPath();
    ctx.strokeStyle = echoColor;
    for (let x = 0; x < width; x++) {
        const y = height / 2 + 60 * Math.sin(0.003 * x + time * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.stroke();

    time += 0.02; // Animation speed
}

window.addEventListener('resize', resize);
resize();
animate();


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