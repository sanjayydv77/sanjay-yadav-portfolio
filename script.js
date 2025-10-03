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

    // --- Part 2: Interactive Network Background ---
    const canvas = document.getElementById('matrix-canvas');
    if (typeof THREE !== 'undefined' && canvas) {
        // ... (Your existing Three.js code remains here)
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 50;
        const PARTICLE_COUNT = 150;
        const CONNECTION_DISTANCE = 25;
        const particlesGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
        const particleVelocities = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 100;
            particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
            particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            particleVelocities.push({ x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, });
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const particlesMaterial = new THREE.PointsMaterial({ color: '#0077b6', size: 0.25, blending: THREE.AdditiveBlending, transparent: true, depthTest: false });
        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
        const linesGeometry = new THREE.BufferGeometry();
        const maxLines = PARTICLE_COUNT * PARTICLE_COUNT;
        const linePositions = new Float32Array(maxLines * 3);
        linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
        const linesMaterial = new THREE.LineBasicMaterial({ color: '#0a192f', transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthTest: false, });
        const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
        scene.add(lines);
        const mouse = new THREE.Vector2(-100, -100);
        window.addEventListener('mousemove', (event) => { mouse.x = (event.clientX / window.innerWidth) * 2 - 1; mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; });
        window.addEventListener('mouseout', () => { mouse.x = -100; mouse.y = -100; });
        function animate() {
            requestAnimationFrame(animate);
            let vertexPos = 0;
            const positions = particlesGeometry.attributes.position.array;
            const linePositions = linesGeometry.attributes.position.array;
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                positions[i * 3] += particleVelocities[i].x;
                positions[i * 3 + 1] += particleVelocities[i].y;
                if (positions[i * 3] > 50) positions[i * 3] = -50;
                if (positions[i * 3] < -50) positions[i * 3] = 50;
                if (positions[i * 3 + 1] > 50) positions[i * 3 + 1] = -50;
                if (positions[i * 3 + 1] < -50) positions[i * 3 + 1] = 50;
                for (let j = i + 1; j < PARTICLE_COUNT; j++) {
                    const dx = positions[i * 3] - positions[j * 3];
                    const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                    const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (dist < CONNECTION_DISTANCE) {
                        linePositions[vertexPos++] = positions[i * 3];
                        linePositions[vertexPos++] = positions[i * 3 + 1];
                        linePositions[vertexPos++] = positions[i * 3 + 2];
                        linePositions[vertexPos++] = positions[j * 3];
                        linePositions[vertexPos++] = positions[j * 3 + 1];
                        linePositions[vertexPos++] = positions[j * 3 + 2];
                    }
                }
            }
            camera.position.x += (mouse.x * 5 - camera.position.x) * 0.03;
            camera.position.y += (mouse.y * 5 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);
            linesGeometry.setDrawRange(0, vertexPos / 3);
            linesGeometry.attributes.position.needsUpdate = true;
            particlesGeometry.attributes.position.needsUpdate = true;
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

    // --- Part 3: New Contact Form Functionality ---
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // 1. Stop the default form submission (which causes a page reload)
            event.preventDefault();

            // 2. Send form data using Fetch API
            const formData = new FormData(contactForm);
            const formAction = contactForm.getAttribute('action');

            fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    // 3. If successful, show the success modal and clear the form
                    successModal.classList.add('active');
                    contactForm.reset();
                } else {
                    alert('Oops! There was a problem submitting your form. Please try again later.');
                }
            }).catch(error => {
                // 4. If there's a network error, show an alert
                console.error('Submission Error:', error);
                alert('Oops! There was a network error. Please try again.');
            });
        });
    }

    // 5. Logic to close the success modal
    const closeTheModal = () => {
        successModal.classList.remove('active');
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeTheModal);
    }
    if (successModal) {
        successModal.addEventListener('click', (event) => {
            // Also close if the user clicks on the dark background
            if (event.target === successModal) {
                closeTheModal();
            }
        });
    }
});