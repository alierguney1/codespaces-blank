/* ============================================
   VALENTINE'S DAY SITE - SCRIPT
   For Deniz, from Ali Osman
   ============================================ */

(function () {
    'use strict';

    // ==================== CONFIG ====================
    const RELATIONSHIP_START = new Date(2024, 10, 29); // Nov 29, 2024
    const SECTIONS = [
        'intro',
        'puzzle-section',
        'story-section',
        'qualities-section',
        'gallery-section',
        'letter-section',
        'counter-section',
        'future-section',
        'finale-section'
    ];

    const PUZZLE_ANSWER = 'BENEK';
    const PUZZLE_LETTERS_POOL = ['B', 'E', 'N', 'E', 'K', 'M', 'İ', 'S'];

    let currentSection = 0;
    let puzzleSolved = false;
    let selectedLetters = [];
    let counterInterval = null;

    // ==================== INIT ====================
    document.addEventListener('DOMContentLoaded', () => {
        createFloatingHearts();
        setupEnvelope();
        setupPuzzle();
        setupNavigation();
        setupButtons();
        setupIntersectionAnimations();
        startCounter();
    });

    // ==================== FLOATING HEARTS ====================
    function createFloatingHearts() {
        const container = document.getElementById('hearts-bg');
        const hearts = ['💕', '💗', '💖', '💘', '💝', '♥', '❤️', '🩷', '🤍'];

        function spawnHeart() {
            const heart = document.createElement('span');
            heart.className = 'floating-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (12 + Math.random() * 18) + 'px';
            heart.style.animationDuration = (8 + Math.random() * 12) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(heart);

            setTimeout(() => heart.remove(), 22000);
        }

        // Initial batch
        for (let i = 0; i < 8; i++) {
            setTimeout(spawnHeart, i * 500);
        }

        // Continuous
        setInterval(spawnHeart, 2500);
    }

    // ==================== ENVELOPE ====================
    function setupEnvelope() {
        const envelope = document.getElementById('envelope');
        const introCanvas = document.getElementById('intro-canvas');

        envelope.addEventListener('click', () => {
            if (envelope.classList.contains('opened')) return;
            envelope.classList.add('opened');

            // Sparkle effect on canvas
            createSparkles(introCanvas);

            setTimeout(() => {
                goToSection(1);
                showMusicPlayer();
            }, 1200);
        });
    }

    function createSparkles(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const sparkles = [];
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        for (let i = 0; i < 50; i++) {
            const angle = (Math.PI * 2 / 50) * i + Math.random() * 0.5;
            sparkles.push({
                x: cx,
                y: cy,
                vx: Math.cos(angle) * (2 + Math.random() * 4),
                vy: Math.sin(angle) * (2 + Math.random() * 4),
                size: 2 + Math.random() * 4,
                alpha: 1,
                color: `hsl(${340 + Math.random() * 40}, 80%, ${60 + Math.random() * 20}%)`
            });
        }

        function animateSparkles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            sparkles.forEach(s => {
                if (s.alpha <= 0) return;
                alive = true;
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.05;
                s.alpha -= 0.015;
                ctx.globalAlpha = Math.max(0, s.alpha);
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            });
            if (alive) requestAnimationFrame(animateSparkles);
        }

        animateSparkles();
    }

    // ==================== MUSIC PLAYER ====================
    function showMusicPlayer() {
        const player = document.getElementById('music-player');
        player.classList.remove('hidden');
        player.classList.add('visible');

        const toggle = document.getElementById('music-toggle');
        let audio = null;
        let isPlaying = false;

        toggle.addEventListener('click', () => {
            if (!audio) {
                // Use a royalty-free placeholder — user can replace with actual file
                audio = new Audio();
                // Try to load local file first, fallback notice
                audio.src = 'music.mp3';
                audio.loop = true;
                audio.volume = 0.5;
                audio.onerror = () => {
                    console.log('Müzik dosyası bulunamadı. "music.mp3" dosyasını aynı klasöre ekleyin.');
                };
            }

            if (isPlaying) {
                audio.pause();
                player.classList.remove('playing');
            } else {
                audio.play().catch(() => {
                    console.log('Müzik çalmak için kullanıcı etkileşimi gerekiyor.');
                });
                player.classList.add('playing');
            }
            isPlaying = !isPlaying;
        });
    }

    // ==================== PUZZLE ====================
    function setupPuzzle() {
        const lettersContainer = document.getElementById('puzzle-letters');
        const answerSlots = document.querySelectorAll('#puzzle-answer .answer-slot');
        const resetBtn = document.getElementById('puzzle-reset');

        // Shuffle letters
        const shuffled = [...PUZZLE_LETTERS_POOL].sort(() => Math.random() - 0.5);

        shuffled.forEach((letter, i) => {
            const el = document.createElement('div');
            el.className = 'puzzle-letter';
            el.textContent = letter;
            el.dataset.index = i;
            el.addEventListener('click', () => handleLetterClick(el));
            lettersContainer.appendChild(el);
        });

        resetBtn.addEventListener('click', resetPuzzle);

        function handleLetterClick(el) {
            if (puzzleSolved) return;
            if (el.classList.contains('selected')) return;
            if (selectedLetters.length >= 5) return;

            el.classList.add('selected');
            selectedLetters.push({ element: el, letter: el.textContent });

            const slot = answerSlots[selectedLetters.length - 1];
            slot.textContent = el.textContent;
            slot.classList.add('filled');

            if (selectedLetters.length === 5) {
                const answer = selectedLetters.map(s => s.letter).join('');
                if (answer === PUZZLE_ANSWER) {
                    puzzleSolved = true;
                    setTimeout(showPuzzleSuccess, 500);
                } else {
                    // Wrong answer - shake and reset
                    document.querySelector('.puzzle-answer').style.animation = 'shake 0.5s ease';
                    setTimeout(() => {
                        document.querySelector('.puzzle-answer').style.animation = '';
                        resetPuzzle();
                    }, 600);
                }
            }
        }

        function resetPuzzle() {
            selectedLetters.forEach(s => s.element.classList.remove('selected'));
            selectedLetters = [];
            answerSlots.forEach(slot => {
                slot.textContent = '';
                slot.classList.remove('filled');
            });
        }

        function showPuzzleSuccess() {
            document.querySelector('.puzzle-container').classList.add('hidden');
            document.getElementById('puzzle-success').classList.remove('hidden');

            // Celebration effect
            createCelebrationHearts();
        }
    }

    function createCelebrationHearts() {
        const container = document.getElementById('hearts-bg');
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.className = 'floating-heart';
                heart.textContent = ['💕', '💗', '🥰', '✨', '💖'][Math.floor(Math.random() * 5)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.fontSize = (20 + Math.random() * 20) + 'px';
                heart.style.animationDuration = (5 + Math.random() * 5) + 's';
                heart.style.animationDelay = '0s';
                container.appendChild(heart);
                setTimeout(() => heart.remove(), 12000);
            }, i * 100);
        }
    }

    // ==================== NAVIGATION ====================
    function setupNavigation() {
        const dotsContainer = document.getElementById('nav-dots');

        SECTIONS.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                // Only allow forward navigation to unlocked sections, or back to previous
                if (i <= currentSection || (i === 1 && !puzzleSolved && i > currentSection)) {
                    goToSection(i);
                } else if (puzzleSolved || i <= 1) {
                    goToSection(i);
                }
            });
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSection);
        });
    }

    function updateProgress() {
        const fill = document.getElementById('progress-fill');
        const pct = (currentSection / (SECTIONS.length - 1)) * 100;
        fill.style.width = pct + '%';
    }

    // ==================== SECTION TRANSITIONS ====================
    function goToSection(index) {
        if (index < 0 || index >= SECTIONS.length) return;

        const current = document.getElementById(SECTIONS[currentSection]);
        const next = document.getElementById(SECTIONS[index]);

        current.classList.remove('active');
        next.classList.add('active');

        currentSection = index;
        updateDots();
        updateProgress();

        // Show nav dots and progress bar after intro
        if (index > 0) {
            document.getElementById('nav-dots').classList.add('visible');
            document.getElementById('progress-bar').classList.add('visible');
        }

        // Trigger section-specific animations
        triggerSectionAnimations(SECTIONS[index]);
    }

    function triggerSectionAnimations(sectionId) {
        switch (sectionId) {
            case 'story-section':
                animateTimeline();
                break;
            case 'qualities-section':
                animateQualities();
                break;
            case 'letter-section':
                animateLetter();
                break;
            case 'future-section':
                animateDreams();
                break;
            case 'finale-section':
                animateFinale();
                break;
        }
    }

    // ==================== ANIMATIONS ====================
    function animateTimeline() {
        const items = document.querySelectorAll('.timeline-item');
        items.forEach((item, i) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, 300 + i * 250);
        });
    }

    function animateQualities() {
        const cards = document.querySelectorAll('.quality-card');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, 200 + i * 200);
        });
    }

    function animateLetter() {
        const paragraphs = document.querySelectorAll('.letter-body p');
        paragraphs.forEach((p, i) => {
            setTimeout(() => {
                p.classList.add('visible');
            }, 300 + i * 400);
        });
    }

    function animateDreams() {
        const cards = document.querySelectorAll('.dream-card');
        cards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('visible');
            }, 200 + i * 200);
        });
    }

    function animateFinale() {
        const canvas = document.getElementById('finale-canvas');
        createFinaleFireworks(canvas);
    }

    function createFinaleFireworks(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const colors = ['#e91e63', '#f8bbd0', '#c2185b', '#ff80ab', '#f50057', '#d4a373', '#ff4081'];

        function createBurst(x, y) {
            for (let i = 0; i < 40; i++) {
                const angle = (Math.PI * 2 / 40) * i;
                const speed = 1 + Math.random() * 3;
                particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 1.5 + Math.random() * 3,
                    alpha: 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    decay: 0.008 + Math.random() * 0.01
                });
            }
        }

        // Create heart-shaped particles
        function createHeartBurst(x, y) {
            for (let t = 0; t < Math.PI * 2; t += 0.15) {
                const hx = 16 * Math.pow(Math.sin(t), 3);
                const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
                particles.push({
                    x, y,
                    vx: hx * 0.15,
                    vy: hy * 0.15,
                    size: 2 + Math.random() * 2,
                    alpha: 1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    decay: 0.005 + Math.random() * 0.005
                });
            }
        }

        // Initial bursts
        setTimeout(() => createBurst(canvas.width * 0.3, canvas.height * 0.3), 200);
        setTimeout(() => createBurst(canvas.width * 0.7, canvas.height * 0.4), 600);
        setTimeout(() => createHeartBurst(canvas.width * 0.5, canvas.height * 0.5), 1000);
        setTimeout(() => createBurst(canvas.width * 0.2, canvas.height * 0.6), 1500);
        setTimeout(() => createBurst(canvas.width * 0.8, canvas.height * 0.3), 1900);

        // Continuous random bursts
        const burstInterval = setInterval(() => {
            const rx = Math.random() * canvas.width;
            const ry = Math.random() * canvas.height * 0.7;
            if (Math.random() > 0.5) {
                createBurst(rx, ry);
            } else {
                createHeartBurst(rx, ry);
            }
        }, 3000);

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.02; // gravity
                p.vx *= 0.99; // friction
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            requestAnimationFrame(animate);
        }

        animate();

        // Clean up on section change (optional)
        window._finaleInterval = burstInterval;
    }

    // ==================== INTERSECTION OBSERVER FOR SCROLL ANIMS ====================
    function setupIntersectionAnimations() {
        // Not needed for fixed sections, but keeping for potential enhancements
    }

    // ==================== COUNTER ====================
    function startCounter() {
        function update() {
            const now = new Date();
            const diff = now - RELATIONSHIP_START;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const daysEl = document.getElementById('counter-days');
            const hoursEl = document.getElementById('counter-hours');
            const minutesEl = document.getElementById('counter-minutes');
            const secondsEl = document.getElementById('counter-seconds');

            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
            if (secondsEl) secondsEl.textContent = seconds;
        }

        update();
        counterInterval = setInterval(update, 1000);
    }

    // ==================== BUTTONS ====================
    function setupButtons() {
        const btnMap = {
            'btn-to-story': 2,
            'btn-to-qualities': 3,
            'btn-to-gallery': 4,
            'btn-to-letter': 5,
            'btn-to-counter': 6,
            'btn-to-future': 7,
            'btn-to-finale': 8
        };

        Object.entries(btnMap).forEach(([id, sectionIndex]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => goToSection(sectionIndex));
            }
        });
    }

    // ==================== KEYBOARD NAVIGATION ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentSection === 0) return; // must click envelope
            if (currentSection === 1 && !puzzleSolved) return; // must solve puzzle
            goToSection(currentSection + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToSection(currentSection - 1);
        }
    });

    // ==================== RESIZE HANDLER ====================
    window.addEventListener('resize', () => {
        const introCanvas = document.getElementById('intro-canvas');
        if (introCanvas) {
            introCanvas.width = window.innerWidth;
            introCanvas.height = window.innerHeight;
        }
        const finaleCanvas = document.getElementById('finale-canvas');
        if (finaleCanvas) {
            finaleCanvas.width = window.innerWidth;
            finaleCanvas.height = window.innerHeight;
        }
    });

    // ==================== TOUCH SWIPE SUPPORT ====================
    let touchStartY = 0;
    let touchStartX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        const diffY = touchStartY - e.changedTouches[0].clientY;
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const threshold = 60;

        if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > threshold) {
            if (diffY > 0) {
                // Swipe up - next section
                if (currentSection === 0) return;
                if (currentSection === 1 && !puzzleSolved) return;
                goToSection(currentSection + 1);
            } else {
                // Swipe down - previous section
                goToSection(currentSection - 1);
            }
        }
    }, { passive: true });

})();
