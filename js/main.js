console.log("Portfolio loaded");

// Mobile Navigation Toggle (Future Implementation)
// ...

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

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
        this.color = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
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
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Draw connecting lines if close
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
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

    // Projects Stagger
    // Projects Stagger - REMOVED to fix visibility issues
    /*
    gsap.from(".project-card", {
        scrollTrigger: {
            trigger: ".projects-grid",
            start: "top 75%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out"
    });
    */

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

    // Antigravity Float Effect
    gsap.to(".profile-image-placeholder", {
        y: 15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    gsap.to(".hero-title", {
        y: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5
    });
}
