document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('ph-list', 'ph-x');
            } else {
                icon.classList.replace('ph-x', 'ph-list');
            }
        });
    }

    // Set active nav link based on current page
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Simple matching logic
        if (currentPath.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if ((currentPath.endsWith('/') || currentPath.endsWith('index.html')) && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
});

// Format Price as INR
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
}
