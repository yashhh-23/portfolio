// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    rootElement.setAttribute('data-theme', savedTheme);
} else {
    rootElement.setAttribute('data-theme', 'dark');
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = rootElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        rootElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Mobile Navigation Toggle
const hamburgerBtn = document.querySelector('.hamburger-btn');
const navList = document.querySelector('.nav-list');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (hamburgerBtn && navList) {
    hamburgerBtn.addEventListener('click', () => {
        const isOpen = navList.classList.toggle('mobile-open');
        hamburgerBtn.classList.toggle('active');
        hamburgerBtn.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when a nav link is clicked
    navList.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('mobile-open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    // Close menu on Escape key (keyboard accessibility)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navList.classList.contains('mobile-open')) {
            navList.classList.remove('mobile-open');
            hamburgerBtn.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            hamburgerBtn.focus();
        }
    });
}

// Intersection Observer for Active Navigation
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

const observerOptions = {
    root: null,
    threshold: 0.3,
    rootMargin: "-50px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.dataset.section === id) {
                    link.classList.add("active");
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Canvas Background Effect (Antigravity Particles)
const canvas = document.getElementById("antigravity-canvas");
const ctx = canvas.getContext("2d");
let width, height;
let particles = [];
let animationId = null;
let isTabVisible = true;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Pause animation when tab is hidden to save CPU/battery
document.addEventListener("visibilitychange", () => {
    isTabVisible = !document.hidden;
    if (isTabVisible && !animationId) {
        animate();
    }
});

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.alpha = Math.random() * 0.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }

    draw() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const rgb = isLight ? '0, 0, 0' : '255, 255, 255';
        ctx.fillStyle = `rgba(${rgb}, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Adaptive particle count: fewer on mobile for battery/performance
const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 20 : 50;

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    if (!isTabVisible) {
        animationId = null;
        return;
    }

    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connecting lines only on desktop (skip on mobile for performance)
    if (!isMobile) {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const rgb = isLight ? '0, 0, 0' : '255, 255, 255';
        ctx.strokeStyle = `rgba(${rgb}, 0.05)`;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = dx * dx + dy * dy; // Skip sqrt for performance

                if (dist < 22500) { // 150 * 150
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    animationId = requestAnimationFrame(animate);
}

initParticles();
animate();

// GSAP Animations (Check if GSAP is loaded)
if (typeof gsap !== 'undefined') {
    gsap.from(".hero-title", {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: "power4.out",
        delay: 0.5
    });

    gsap.from(".hero-tagline", {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power4.out",
        delay: 0.8
    });

    gsap.from(".cta-group", {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: "power4.out",
        delay: 1.1
    });

    // Scroll Triggers
    gsap.utils.toArray(".section-title").forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // Timeline Items Stagger
    gsap.from(".timeline-item", {
        scrollTrigger: {
            trigger: ".timeline-grid",
            start: "top 75%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // Tech Categories – Reveal on Scroll (CSS-driven)
    const techCards = document.querySelectorAll(".tech-category");
    const techObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 120);
                techObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    techCards.forEach(card => techObserver.observe(card));

    // Project Cards – Reveal on Scroll (CSS-driven)
    const projectCards = document.querySelectorAll(".project-card");
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, index * 150);
                projectObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    projectCards.forEach(card => projectObserver.observe(card));

    // About/Contact Reveal
    gsap.from(".about-text p", {
        scrollTrigger: {
            trigger: ".about-grid",
            start: "top 75%",
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out"
    });

    gsap.from(".contact-card", {
        scrollTrigger: {
            trigger: ".contact-wrapper",
            start: "top 80%",
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
    });

    // Antigravity Float Effect - only if user hasn't opted for reduced motion
    if (!prefersReducedMotion.matches) {
        gsap.to(".profile-image-wrapper", {
            y: 15,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.6
        });

        gsap.to(".hero-title", {
            y: 12,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.6
        });
    }
}

// UX Enhancements (Progress Bar, Back to Top, Contact Form)
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    // Throttled Scroll Handler using rAF
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / docHeight) * 100;

                if (progressBar) {
                    progressBar.style.width = scrolled + "%";
                }

                if (winScroll > 300) {
                    if (backToTopBtn) backToTopBtn.classList.add('visible');
                } else {
                    if (backToTopBtn) backToTopBtn.classList.remove('visible');
                }

                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });

    // Back to Top Click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if(name && email && message) {
                const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                
                formStatus.textContent = 'Opening email client...';
                formStatus.className = 'form-status success';
                
                window.location.href = `mailto:yashdedhia05@gmail.com?subject=${subject}&body=${body}`;
                
                setTimeout(() => {
                    formStatus.textContent = '';
                    contactForm.reset();
                }, 3000);
            } else {
                formStatus.textContent = 'Please fill out all fields.';
                formStatus.className = 'form-status error';
            }
        });
    }

    // CV Modal Handler
    const viewCvBtn = document.getElementById('view-cv-btn');
    const cvModal = document.getElementById('cv-modal');
    const closeCvModalBtn = document.getElementById('close-cv-modal');

    if (viewCvBtn && cvModal && closeCvModalBtn) {
        const openModal = (e) => {
            if(e) e.preventDefault();
            cvModal.style.display = 'flex';
            // slight delay to allow display: flex to apply before opacity transition
            requestAnimationFrame(() => {
                cvModal.classList.add('open');
            });
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            cvModal.classList.remove('open');
            document.body.style.overflow = '';
            // wait for transition to finish before hiding
            setTimeout(() => {
                if(!cvModal.classList.contains('open')) {
                    cvModal.style.display = 'none';
                }
            }, 300);
        };

        viewCvBtn.addEventListener('click', openModal);
        closeCvModalBtn.addEventListener('click', closeModal);
        
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cvModal.classList.contains('open')) {
                closeModal();
            }
        });
    }

});
