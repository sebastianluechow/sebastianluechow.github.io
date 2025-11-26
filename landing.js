const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: 0, y: 0 };

// STATE MANAGEMENT
// Modes: 'default', 'physics', 'jazz', 'photo'
let currentMode = 'default'; 

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initParticles();
}

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.baseX = this.x; // For physics grid
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.alpha = Math.random() * 0.5 + 0.1;
    }

    update() {
        // --- BEHAVIOR SWITCHING ---

        if (currentMode === 'default') {
            // DRIFTING (Entropy)
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        } 
        
        else if (currentMode === 'physics') {
            // LATTICE (Order)
            // Particles try to return to their grid position but react to mouse
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = 200;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < maxDistance) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to base
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx/20;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy/20;
                }
            }
        } 
        
        else if (currentMode === 'jazz') {
            // TURBULENCE (Flow)
            // Perlin-ish noise movement (simplified)
            let angle = (Math.cos(this.x * 0.005) + Math.sin(this.y * 0.005)) * Math.PI;
            this.vx = Math.cos(angle);
            this.vy = Math.sin(angle);
            this.x += this.vx * 2;
            this.y += this.vy * 2;

            // Wrap around screen
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        } 
        
        else if (currentMode === 'photo') {
            // FREEZE (Snapshot)
            // Particles stop moving completely.
            // Randomly flicker opacity to simulate grain/shutter
            if (Math.random() > 0.95) {
                this.alpha = Math.random();
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // COLOR SWITCHING
        if (currentMode === 'physics') ctx.fillStyle = `rgba(0, 243, 255, ${this.alpha})`; // Cyan
        else if (currentMode === 'jazz') ctx.fillStyle = `rgba(204, 51, 0, ${this.alpha})`; // Orange
        else if (currentMode === 'photo') ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; // White
        else ctx.fillStyle = `rgba(150, 150, 150, ${this.alpha})`; // Grey

        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    // Grid calculation for Physics mode
    let columns = Math.floor(width / 40);
    let rows = Math.floor(height / 40);
    
    // Create particles on a grid for the Physics effect
    for (let i = 0; i < columns * rows; i++) {
        let p = new Particle();
        // Override random position with grid position for physics mode
        p.baseX = (i % columns) * 40 + 20;
        p.baseY = Math.floor(i / columns) * 40 + 20;
        p.x = p.baseX; // Start at grid
        p.y = p.baseY;
        particles.push(p);
    }
}

function animate() {
    requestAnimationFrame(animate);
    // Trail effect
    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)'; // Low opacity clears for trails
    if(currentMode === 'photo') ctx.fillStyle = 'rgba(5, 5, 5, 1)'; // No trails in photo mode
    
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
}

// --- EVENT LISTENERS ---

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', resize);

// HOVER LOGIC
const portals = document.querySelectorAll('.portal');

portals.forEach(portal => {
    portal.addEventListener('mouseenter', () => {
        currentMode = portal.getAttribute('data-type');
    });
    
    portal.addEventListener('mouseleave', () => {
        currentMode = 'default';
    });
});

// Boot
resize();
animate();