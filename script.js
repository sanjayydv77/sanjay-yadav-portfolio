document.addEventListener('DOMContentLoaded', () => {
    
    // --- NEW: Mobile Menu Functionality ---
    const menuIcon = document.getElementById('menu-icon');
    const navLinksList = document.querySelector('.nav-links'); // Renamed to avoid conflict
    
    if (menuIcon && navLinksList) {
        menuIcon.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinksList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinksList.classList.contains('active')) {
                    navLinksList.classList.remove('active');
                }
            });
        });
    }
    
    // --- NEW: Text Decode Effect ---
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '';
            let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="dud">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const phrases = [
        'Web Developer',
        'Creative Coder',
        'UI Designer',
        'Problem Solver'
    ];

    const el = document.querySelector('.multiple-text');
    const fx = new TextScramble(el);

    let counter = 0;
    const next = () => {
        fx.setText(phrases[counter]).then(() => {
            setTimeout(next, 2000); // Wait 2 seconds before scrambling to the next phrase
        });
        counter = (counter + 1) % phrases.length;
    };

    next();
    
    // --- Part 1: Carousel and Modal Functionality ---
    const carousel = document.querySelector('.carousel');
    const allNavLinks = document.querySelectorAll('.nav-link'); // MODIFIED VARIABLE NAME
    const panels = document.querySelectorAll('.carousel-panel');
    const panelRotations = {
        'home': 0, 'about': 72, 'skills': 144, 'projects': 216, 'contact': 288
    };
    const homePanel = document.querySelector('.panel-home');
    if (homePanel) homePanel.classList.add('active-panel');

    // --- MODIFIED: Navigation Logic for Responsiveness ---
    allNavLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = link.getAttribute('data-target');
            if (panelRotations.hasOwnProperty(target)) {
                // For Desktop
                if (window.innerWidth > 768) {
                    const rotation = panelRotations[target];
                    carousel.style.transform = `rotateY(-${rotation}deg)`;
                } 
                // For Mobile
                else {
                    const targetPanel = document.querySelector(`.panel-${target}`);
                    if (targetPanel) {
                        const targetPosition = targetPanel.offsetTop - document.querySelector('.navbar').offsetHeight + 1;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    const modalContainer = document.getElementById('about-modal');
    const readMoreBtn = document.getElementById('read-more-btn');
    const closeBtn = document.querySelector('.close-btn');
    if (readMoreBtn && modalContainer) { readMoreBtn.addEventListener('click', (event) => { event.preventDefault(); modalContainer.classList.add('active'); }); }
    function closeModal() { if (modalContainer) modalContainer.classList.remove('active'); }
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalContainer) modalContainer.addEventListener('click', (event) => { if (event.target === modalContainer) closeModal(); });

   /* ================================================================== */
/* --- REPLACEMENT: Advanced Project Card Logic (Desktop & Mobile) --- */
/* ================================================================== */

const projectCards = document.querySelectorAll('.project-card');
const linksPopup = document.getElementById('project-links-popup');
let cardLeaveTimeout;
let popupLeaveTimeout;

// --- Logic 1: Desktop Hover & Popup System ---
if (linksPopup && projectCards.length > 0) {
    projectCards.forEach(card => {
        const linksSource = card.querySelector('.project-links');
        if (!linksSource) return;

        card.addEventListener('mouseenter', () => {
            // NEW: Only run on desktop
            if (window.innerWidth <= 768) return; 
            
            clearTimeout(cardLeaveTimeout);
            clearTimeout(popupLeaveTimeout);

            projectCards.forEach(c => { if (c !== card) c.classList.remove('is-flipped'); });
            card.classList.add('is-flipped');

            linksPopup.innerHTML = linksSource.innerHTML;
            const cardRect = card.getBoundingClientRect();
            const popupTop = cardRect.bottom + 15;
            const popupLeft = cardRect.left + (cardRect.width / 2);
            linksPopup.style.top = `${popupTop}px`;
            linksPopup.style.left = `${popupLeft}px`;
            linksPopup.classList.add('active');
        });

        card.addEventListener('mouseleave', () => {
            // NEW: Only run on desktop
            if (window.innerWidth <= 768) return; 

            cardLeaveTimeout = setTimeout(() => {
                card.classList.remove('is-flipped');
                linksPopup.classList.remove('active');
            }, 300);
        });

        const cardBack = card.querySelector('.project-card-back');
        if (cardBack) { 
            cardBack.addEventListener('mouseenter', () => { 
                // NEW: Only run on desktop
                if (window.innerWidth <= 768) return;
                clearTimeout(cardLeaveTimeout); 
            }); 
        }
    });

    linksPopup.addEventListener('mouseenter', () => {
        // NEW: Only run on desktop
        if (window.innerWidth <= 768) return; 
        
        clearTimeout(cardLeaveTimeout);
        clearTimeout(popupLeaveTimeout);
    });

    linksPopup.addEventListener('mouseleave', () => {
        // NEW: Only run on desktop
        if (window.innerWidth <= 768) return; 
        
        popupLeaveTimeout = setTimeout(() => {
            linksPopup.classList.remove('active');
            projectCards.forEach(c => c.classList.remove('is-flipped'));
        }, 300);
    });
}

// --- Logic 2: Mobile Tap-to-Flip System ---
projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // NEW: Only run on mobile
        if (window.innerWidth > 768) return; 

        // Only toggle flip if the user is NOT clicking an actual link
        if (!e.target.closest('a')) {
            e.preventDefault();
            card.classList.toggle('is-flipped');
        }
    });
});
    
    // --- UPDATED: "Aura Pan" Effect with Tilt for Hero Image ---
    const heroImageContainer = document.querySelector('.hero-image-container');

    if (heroImageContainer) {
        const heroImage = heroImageContainer.querySelector('img');

        heroImageContainer.addEventListener('mousemove', (e) => {
            const rect = heroImageContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const panX = (x / rect.width - 0.5) * -30;
            const panY = (y / rect.height - 0.5) * -30;

            // NEW: Added rotateX(5deg) and rotateY(-5deg) for the static tilt
            heroImage.style.transform = `rotateX(5deg) rotateY(-5deg) translateX(${panX}px) translateY(${panY}px)`;
        });

        heroImageContainer.addEventListener('mouseleave', () => {
            // NEW: Reset all transform properties, including the rotation
            heroImage.style.transform = `rotateX(0deg) rotateY(0deg) translateX(0) translateY(0)`;
        });
    }
    
    // --- Part 2: Interactive Starfield Background ---
    const canvas = document.getElementById('matrix-canvas');
    if (typeof THREE !== 'undefined' && canvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 5000;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 100;
            positions[i3 + 1] = (Math.random() - 0.5) * 100;
            positions[i3 + 2] = (Math.random() - 0.5) * 100;
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, blending: THREE.AdditiveBlending, });
        const starfield = new THREE.Points(starGeometry, starMaterial);
        scene.add(starfield);
        const mouse = new THREE.Vector2();
        window.addEventListener('mousemove', (event) => { mouse.x = (event.clientX / window.innerWidth) * 2 - 1; mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; });
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            starfield.rotation.y = mouse.x * 0.2;
            starfield.rotation.x = mouse.y * 0.2;
            starfield.rotation.z += 0.0005;
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });
    }

    // // --- Part 3: Contact Form Functionality ---
    // const contactForm = document.getElementById('contactForm');
    // const successModal = document.getElementById('success-modal');
    // const closeModalBtn = document.getElementById('close-modal-btn');
    // if (contactForm && successModal && closeModalBtn) {
    //     contactForm.addEventListener('submit', (event) => {
    //         event.preventDefault();
    //         const name = contactForm.querySelector('[name="name"]').value.trim();
    //         const email = contactForm.querySelector('[name="email"]').value.trim();
    //         const subject = contactForm.querySelector('[name="subject"]').value.trim();
    //         const message = contactForm.querySelector('[name="message"]').value.trim();
    //         if (!name || !email || !subject || !message) { alert('Please fill out all required fields.'); return; }
    //         const formData = new FormData(contactForm);
    //         const formAction = contactForm.getAttribute('action');
    //         fetch(formAction, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' } })
    //         .then(response => {
    //             if (response.ok) {
    //                 successModal.classList.add('active');
    //                 contactForm.reset();
    //             } else {
    //                 response.json().then(data => { console.error('Form submission error:', data); alert('There was a problem with the server. Please try again.'); });
    //             }
    //         })
    //         .catch(error => { console.error('Network Error:', error); alert('Could not send message due to a network error.'); });
    //     });
    //     const closeTheModal = () => { successModal.classList.remove('active'); };
    //     closeModalBtn.addEventListener('click', closeTheModal);
    //     successModal.addEventListener('click', (event) => { if (event.target === successModal) closeTheModal(); });
    // }
});