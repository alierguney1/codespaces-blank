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
        'dictionary-section',
        'gallery-section',
        'letter-section',
        'counter-section',
        'map-section',
        'beach-section',
        'memory-game-section',
        'future-section',
        'finale-section'
    ];

    const PUZZLE_ANSWER = 'BENEK';
    const PUZZLE_LETTERS_POOL = ['B', 'E', 'N', 'E', 'K', 'M', 'İ', 'S'];

    let currentSection = 0;
    let puzzleSolved = false;
    let selectedLetters = [];
    let counterInterval = null;
    let starsCanvas = null;
    let stars = [];
    let mouseX = 0;
    let mouseY = 0;
    let memoryCards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let moveCount = 0;

    // ==================== INIT ====================
    document.addEventListener('DOMContentLoaded', () => {
        createFloatingHearts();
        setupEnvelope();
        setupPuzzle();
        setupNavigation();
        setupButtons();
        setupIntersectionAnimations();
        startCounter();
        setupMap();
        setupBeachParallax();
        setupMemoryGame();
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
            case 'dictionary-section':
                animateDictionary();
                break;
            case 'letter-section':
                animateLetter();
                break;
            case 'counter-section':
                initStarryBackground();
                break;
            case 'map-section':
                animateMap();
                break;
            case 'beach-section':
                animateBeach();
                break;
            case 'memory-game-section':
                // Game is already set up
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

    function animateDictionary() {
        const categories = document.querySelectorAll('.dict-category');
        categories.forEach((cat, i) => {
            setTimeout(() => {
                cat.classList.add('visible');
                // Animate cards within each category
                const cards = cat.querySelectorAll('.dict-card');
                cards.forEach((card, j) => {
                    const delay = parseInt(card.dataset.delay || 0);
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, delay + 100);
                });
            }, 200 + i * 300);
        });

        // Show footer
        const footer = document.querySelector('.dict-footer');
        if (footer) {
            setTimeout(() => footer.classList.add('visible'), 800 + categories.length * 300);
        }

        // Setup tap-to-flip for mobile
        document.querySelectorAll('.dict-card').forEach(card => {
            card.addEventListener('click', () => {
                // Remove flipped from all others
                document.querySelectorAll('.dict-card.flipped').forEach(c => {
                    if (c !== card) c.classList.remove('flipped');
                });
                card.classList.toggle('flipped');
            });
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
            'btn-to-dictionary': 4,
            'btn-to-gallery': 5,
            'btn-to-letter': 6,
            'btn-to-counter': 7,
            'btn-to-map': 8,
            'btn-to-beach': 9,
            'btn-to-memory-game': 10,
            'btn-to-future': 11,
            'btn-to-finale': 12
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
        if (starsCanvas) {
            starsCanvas.width = window.innerWidth;
            starsCanvas.height = window.innerHeight;
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

    // ==================== STARRY BACKGROUND ====================
    function initStarryBackground() {
        starsCanvas = document.getElementById('stars-canvas');
        if (!starsCanvas || stars.length > 0) return;

        const ctx = starsCanvas.getContext('2d');
        starsCanvas.width = window.innerWidth;
        starsCanvas.height = window.innerHeight;

        // Create stars
        for (let i = 0; i < 200; i++) {
            stars.push({
                x: Math.random() * starsCanvas.width,
                y: Math.random() * starsCanvas.height,
                radius: Math.random() * 2,
                vx: 0,
                vy: 0,
                alpha: Math.random(),
                alphaChange: (Math.random() * 0.02) + 0.005
            });
        }

        // Mouse move listener for parallax
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / 100;
            mouseY = (e.clientY - window.innerHeight / 2) / 100;
        });

        animateStars(ctx);
    }

    function animateStars(ctx) {
        if (!starsCanvas) return;

        ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);

        stars.forEach(star => {
            // Parallax effect
            const parallaxX = star.x + mouseX * star.radius * 2;
            const parallaxY = star.y + mouseY * star.radius * 2;

            // Twinkling effect
            star.alpha += star.alphaChange;
            if (star.alpha <= 0 || star.alpha >= 1) {
                star.alphaChange = -star.alphaChange;
            }

            ctx.globalAlpha = star.alpha;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(parallaxX, parallaxY, star.radius, 0, Math.PI * 2);
            ctx.fill();

            // Add some pink/purple stars
            if (Math.random() > 0.95) {
                ctx.fillStyle = '#f8bbd0';
                ctx.beginPath();
                ctx.arc(parallaxX + 1, parallaxY + 1, star.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(() => animateStars(ctx));
    }

    // ==================== INTERACTIVE MAP ====================
    function setupMap() {
        const markers = document.querySelectorAll('.city-marker');
        const tooltip = document.getElementById('map-tooltip');

        markers.forEach(marker => {
            marker.addEventListener('mouseenter', (e) => {
                const memory = marker.dataset.memory;
                const rect = marker.getBoundingClientRect();
                const container = document.querySelector('.map-container').getBoundingClientRect();

                tooltip.textContent = memory;
                tooltip.classList.add('visible');
                
                // Position tooltip
                const tooltipWidth = 280;
                const leftPos = rect.left - container.left + (rect.width / 2) - (tooltipWidth / 2);
                const topPos = rect.top - container.top - 80;
                
                tooltip.style.left = Math.max(10, Math.min(leftPos, container.width - tooltipWidth - 10)) + 'px';
                tooltip.style.top = Math.max(10, topPos) + 'px';
            });

            marker.addEventListener('mouseleave', () => {
                tooltip.classList.remove('visible');
            });

            marker.addEventListener('click', (e) => {
                const memory = marker.dataset.memory;
                const city = marker.dataset.city;
                alert(`❤️ ${city.toUpperCase()}\n\n${memory}`);
            });
        });
    }

    function animateMap() {
        // Map already has CSS animations
    }

    // ==================== BEACH PARALLAX ====================
    function setupBeachParallax() {
        const beachSection = document.getElementById('beach-section');
        if (!beachSection) return;

        beachSection.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX - window.innerWidth / 2) / 50;
            const moveY = (e.clientY - window.innerHeight / 2) / 50;

            const skyLayer = beachSection.querySelector('.sky-layer');
            const seaBack = beachSection.querySelector('.sea-back');
            const seaMid = beachSection.querySelector('.sea-mid');
            const seaFront = beachSection.querySelector('.sea-front');
            const beachLayer = beachSection.querySelector('.beach-layer');

            if (skyLayer) skyLayer.style.transform = `translate(${moveX * 0.5}px, ${moveY * 0.5}px)`;
            if (seaBack) seaBack.style.transform = `translate(${moveX * 1}px, ${moveY * 0.8}px)`;
            if (seaMid) seaMid.style.transform = `translate(${moveX * 1.5}px, ${moveY * 1}px)`;
            if (seaFront) seaFront.style.transform = `translate(${moveX * 2}px, ${moveY * 1.2}px)`;
            if (beachLayer) beachLayer.style.transform = `translate(${moveX * 2.5}px, ${moveY * 1.5}px)`;
        });
    }

    function animateBeach() {
        // Beach animations are CSS-based
    }

    // ==================== MEMORY GAME ====================
    function setupMemoryGame() {
        const grid = document.getElementById('memory-game-grid');
        const resetBtn = document.getElementById('game-reset');
        
        // Card emojis (8 pairs = 16 cards)
        const cardEmojis = ['💕', '💗', '💖', '💘', '💝', '🥰', '😍', '❤️'];
        
        resetBtn.addEventListener('click', initMemoryGame);
        initMemoryGame();

        function initMemoryGame() {
            // Reset game state
            matchedPairs = 0;
            moveCount = 0;
            flippedCards = [];
            memoryCards = [];
            
            // Update UI
            document.getElementById('move-count').textContent = '0';
            document.getElementById('match-count').textContent = '0/8';
            document.getElementById('game-complete').classList.add('hidden');
            
            // Create card pairs and shuffle
            const cards = [...cardEmojis, ...cardEmojis]
                .sort(() => Math.random() - 0.5)
                .map((emoji, index) => ({ emoji, id: index }));
            
            // Clear grid
            grid.innerHTML = '';
            
            // Create card elements
            cards.forEach(card => {
                const cardEl = document.createElement('div');
                cardEl.className = 'memory-card';
                cardEl.dataset.emoji = card.emoji;
                cardEl.dataset.id = card.id;
                
                cardEl.innerHTML = `
                    <div class="card-face card-back">💌</div>
                    <div class="card-face card-front">${card.emoji}</div>
                `;
                
                cardEl.addEventListener('click', () => handleCardClick(cardEl));
                grid.appendChild(cardEl);
                memoryCards.push(cardEl);
            });
        }

        function handleCardClick(card) {
            // Prevent clicking same card twice or more than 2 cards
            if (card.classList.contains('flipped') || 
                card.classList.contains('matched') || 
                flippedCards.length >= 2) {
                return;
            }
            
            // Flip card
            card.classList.add('flipped');
            flippedCards.push(card);
            
            // Check for match when 2 cards are flipped
            if (flippedCards.length === 2) {
                moveCount++;
                document.getElementById('move-count').textContent = moveCount;
                
                setTimeout(checkMatch, 600);
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const emoji1 = card1.dataset.emoji;
            const emoji2 = card2.dataset.emoji;
            
            if (emoji1 === emoji2) {
                // Match!
                card1.classList.add('matched');
                card2.classList.add('matched');
                matchedPairs++;
                
                document.getElementById('match-count').textContent = `${matchedPairs}/8`;
                
                // Check if game is complete
                if (matchedPairs === 8) {
                    setTimeout(() => {
                        document.getElementById('game-complete').classList.remove('hidden');
                        createCelebrationHearts();
                    }, 500);
                }
            } else {
                // No match - flip back
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
            }
            
            flippedCards = [];
        }
    }

})();
