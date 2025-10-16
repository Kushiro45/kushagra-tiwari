// Scroll animation observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate');
            }, index * 100);
        }
    });
}, observerOptions);

// Observe all animatable elements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.section-header, .card, .terminal-box, .video-item, .contact-item, .skill-tag');
    elements.forEach(el => {
        observer.observe(el);
    });
});

// Also observe elements added dynamically (for pages that load content from JSON)
window.addEventListener('load', () => {
    setTimeout(() => {
        const dynamicElements = document.querySelectorAll('.section-header, .card, .terminal-box, .video-item, .contact-item, .skill-tag');
        dynamicElements.forEach(el => {
            if (!el.classList.contains('animate')) {
                observer.observe(el);
            }
        });
    }, 500);
});