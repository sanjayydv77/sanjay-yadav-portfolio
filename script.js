document.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Carousel and Modal Functionality ---
    const carousel = document.querySelector('.carousel');
    const navLinks = document.querySelectorAll('.nav-link');
    const panels = document.querySelectorAll('.carousel-panel');
    const panelRotations = {
        'home': 0, 'about': 72, 'skills': 144, 'projects': 216, 'contact': 288
    };
    const homePanel = document.querySelector('.panel-home');
    if (homePanel) {
        homePanel.classList.add('active-panel');
    }
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = link.getAttribute('data-target');
            if (panelRotations.hasOwnProperty(target)) {
                const rotation = panelRotations[target];
                carousel.style.transform = `rotateY(-${rotation}deg)`;
                panels.forEach(panel => {
                    panel.classList.remove('active-panel');
                });
                const targetPanel = document.querySelector(`.panel-${target}`);
                if (targetPanel) {
                    targetPanel.classList.add('active-panel');
                }
            }
        });
    });
    const modalContainer = document.getElementById('about-modal');
    const readMoreBtn = document.getElementById('read-more-btn');
    const closeBtn = document.querySelector('.close-btn');
    if (readMoreBtn && modalContainer) {
        readMoreBtn.addEventListener('click', (event) => {
            event.preventDefault();
            modalContainer.classList.add('active');
        });
    }
    function closeModal() {
        if (modalContainer) {
            modalContainer.classList.remove('active');
        }
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    if (modalContainer) {
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                closeModal();
            }
        });
    }

    // --- UPDATED: Performance-Tuned Project Card Logic ---
    const projectCards = document.querySelectorAll('.project-card');
    let leaveTimeout; // Use a single, shared timeout variable.

    projectCards.forEach(card => {
        const cardBack = card.querySelector('.project-card-back');

        card.addEventListener('mouseenter', () => {
            // Cancel any pending action to close a different card.
            clearTimeout(leaveTimeout);

            // Instantly un-flip any other card that might still be open.
            projectCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('is-flipped');
                }
            });

            // Flip the current card.
            card.classList.add('is-flipped');
        });

        card.addEventListener('mouseleave', () => {
            // When leaving, set a timer to un-flip this card.
            leaveTimeout = setTimeout(() => {
                card.classList.remove('is-flipped');
            }, 300);
        });

        // If the mouse enters the back content to scroll, cancel the un-flip timer.
        if (cardBack) {
            cardBack.addEventListener('mouseenter', () => {
                clearTimeout(leaveTimeout);
            });
        }
    });


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
        window.addEventListener('mousemove', (event) => {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });
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

    // --- Part 3: Contact Form Functionality ---
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    if (contactForm && successModal && closeModalBtn) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = contactForm.querySelector('[name="name"]').value.trim();
            const email = contactForm.querySelector('[name="email"]').value.trim();
            const subject = contactForm.querySelector('[name="subject"]').value.trim();
            const message = contactForm.querySelector('[name="message"]').value.trim();
            if (!name || !email || !subject || !message) {
                alert('Please fill out all required fields.');
                return;
            }
            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action');
            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    successModal.classList.add('active');
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        console.error('Form submission error:', data);
                        alert('There was a problem with the server. Please try again.');
                    });
                }
            })
            .catch(error => {
                console.error('Network Error:', error);
                alert('Could not send message due to a network error.');
            });
        });
        const closeTheModal = () => {
            successModal.classList.remove('active');
        };
        closeModalBtn.addEventListener('click', closeTheModal);
        successModal.addEventListener('click', (event) => {
            if (event.target === successModal) {
                closeTheModal();
            }
        });
    }
});