document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // 1. Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
        toggleBtn.innerText = "DARK";
    }

    // 2. Handle Click
    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            toggleBtn.innerText = "DARK";
        } else {
            localStorage.setItem('theme', 'dark');
            toggleBtn.innerText = "LIGHT";
        }
    });
});

// 3. Scroll Observer for Images (Kept here so it runs on any page with photos)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); 
        }
    });
}, observerOptions);

const photos = document.querySelectorAll('.photo-item');
if (photos.length > 0) {
    photos.forEach(item => observer.observe(item));
}

