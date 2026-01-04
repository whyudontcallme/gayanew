// ========================================
// GAIA Website - Animations
// Scroll-triggered animations and effects
// ========================================

document.addEventListener('DOMContentLoaded', function () {

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with .reveal class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Parallax effect removed - was causing scroll issues

    // Counter Animation for Statistics
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        const timer = setInterval(function () {
            start += increment;
            if (start >= target) {
                element.textContent = Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    // Observe counters
    const counters = document.querySelectorAll('[data-counter]');
    const counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.counter);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    // Card Hover 3D Effect
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function () {
            card.style.transform = '';
        });
    });

    // Stagger Animation for Grid Items
    function staggerAnimation(selector, delay = 100) {
        const items = document.querySelectorAll(selector);
        items.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in-up');
            }, index * delay);
        });
    }

    // Apply stagger to grid items when they come into view
    const gridObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gridItems = entry.target.querySelectorAll('.card, .product-card');
                gridItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, index * 100);
                });
                gridObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const grids = document.querySelectorAll('.grid');
    grids.forEach(grid => {
        // Set initial state for grid items
        const items = grid.querySelectorAll('.card, .product-card');
        items.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.6s ease-out';
        });
        gridObserver.observe(grid);
    });

    // Typing Effect for Hero Title (optional)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }

        type();
    }

    // Smooth Number Increment
    function smoothIncrement(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = end;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Progress Bar Animation
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.progress || '0';
                bar.style.width = width + '%';
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        bar.style.width = '0%';
        bar.style.transition = 'width 1.5s ease-out';
        progressObserver.observe(bar);
    });

    // Image Fade In on Load
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in';

        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', function () {
                this.style.opacity = '1';
            });
        }
    });

    // Ripple Effect on Buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    console.log('Animations initialized!');
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
  .btn {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
