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
        'travel-section',
        'gallery-section',
        'counter-section',
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
        createScatteredPhotos();
        setupEnvelope();
        setupPuzzle();
        setupNavigation();
        setupButtons();
        setupIntersectionAnimations();
        startCounter();
        setupMemoryGame();
        setupBoardingPasses();
        setupGalleryLightbox();
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

    // ==================== SCATTERED MINI PHOTOS ====================
    const TRAVEL_THUMBS = [
        '../thumbs/Kayseri/3680B452-DB9F-49D5-82FC-5F306ABAB5B6_1_105_c.jpeg',
        '../thumbs/Malaga/451ADC0C-F51B-43B5-AFCF-23B5D308A503_1_105_c.jpeg',
        '../thumbs/Malaga/5BB4DF3E-9C66-4F90-9026-21AD93CFB002_1_105_c.jpeg',
        '../thumbs/Positano/4EDACF22-11BF-4399-AD2C-9ACECB68A7F0.JPG',
        '../thumbs/Positano/FB176F85-F1B5-4D01-ABD0-422FA8DBB204_1_105_c.jpeg',
        '../thumbs/Atina/6C636F48-322C-42AF-B601-5700C993C5C5_1_105_c.jpeg',
        '../thumbs/Atina/7AF728E7-0A8E-47F0-984D-480E46FBF485_1_105_c.jpeg',
        '../thumbs/Marsilya/9C400CD9-E6EE-4F55-A2C1-9BCE1F46D0FF_1_105_c.jpeg',
        '../thumbs/Napoli/39589054-8615-4D20-B75E-FD316AAE2080.JPG',
        '../thumbs/Izmir/EC8ACB1A-BBDE-46BE-8E57-B23B09A0C000_1_105_c.jpeg',
        '../thumbs/Antalya/98AAFEC6-2BBA-4DE6-80F3-658178101024_1_105_c.jpeg',
        '../thumbs/Tiflis/5B676161-457C-4625-A89F-A67D08A65175.JPG',
        '../thumbs/Tiflis/2BF6EDA1-29AB-4121-AE2F-304287712813.JPG',
        '../thumbs/Antalya/002DC462-D371-4FC2-BA6D-E2B66F573C3F_1_105_c.jpeg',
    ];

    const DENIZ_PHOTOS = [
        '../deniz_photos/25A10030-6490-4988-85FB-DCE316C6E1B3_1_105_c.jpeg',
        '../deniz_photos/26818E10-CACC-4EDA-BAF9-A9BCF1CF298C_1_105_c.jpeg',
        '../deniz_photos/395AB4E4-8A72-4C0B-81F5-AD174BD0C5EA_1_105_c.jpeg',
        '../deniz_photos/43A80C78-47AE-49C4-9528-746790C60CFF_1_105_c.jpeg',
        '../deniz_photos/469CC6E6-A6FE-4327-98B9-F408742C344A_1_105_c.jpeg',
        '../deniz_photos/47F98484-2600-4F3F-982C-6C027C42F28F_1_105_c.jpeg',
        '../deniz_photos/6653BC16-6F2D-4D94-AF0D-9EBFDD1B722B_1_105_c.jpeg',
        '../deniz_photos/689A13C0-60C9-43C2-8434-F0BD2278F55B_1_105_c.jpeg',
        '../deniz_photos/6CEB7411-2281-47F5-91C7-B02AAFD1E6C8_1_105_c.jpeg',
        '../deniz_photos/6E0AEB10-A1DE-41EA-B563-027955CB9DC3_1_105_c.jpeg',
        '../deniz_photos/70ED6808-CF1B-49CE-B7D2-D0C215F0B206_1_105_c.jpeg',
        '../deniz_photos/7ECB8907-EA28-4530-8EA2-4196AC764A2F_1_105_c.jpeg',
        '../deniz_photos/8A1E6B14-8C96-477E-BE0F-B09F36629B49_1_105_c.jpeg',
        '../deniz_photos/8C34C355-8738-4169-8383-5A6A61B1197D_1_105_c.jpeg',
        '../deniz_photos/A234EF95-A3D2-426B-8350-28DD03893A22_1_105_c.jpeg',
        '../deniz_photos/A242E4C4-66BF-44B7-8DDB-B6AE822453ED_1_105_c.jpeg',
        '../deniz_photos/A374C5CB-18BF-42E0-ACF2-E2774CBEFC29_1_105_c.jpeg',
        '../deniz_photos/B095CA4A-9F96-4F5C-AAF1-BC62CBF8B958_1_105_c.jpeg',
        '../deniz_photos/BB6C042E-4CB5-44C3-BF85-FFFF7F7D4EAF_1_105_c.jpeg',
        '../deniz_photos/CA08C8E0-8A3F-4B3A-819B-110F99EE7BFA_1_105_c.jpeg',
        '../deniz_photos/CA226851-9AF4-45EE-83EC-60581C09CBA8_1_105_c.jpeg',
        '../deniz_photos/D161D9AD-DBAF-48BF-B707-784D8D0D1D88_1_105_c.jpeg',
        '../deniz_photos/D6B11428-3F89-4EE8-BF33-66D4A16DED30_1_105_c.jpeg',
        '../deniz_photos/E40D207E-5297-4FF9-ABCB-6691CDE934CE_1_105_c.jpeg',
        '../deniz_photos/E984F14C-4D67-4877-9C26-C2A8BB54B137_1_105_c.jpeg',
        '../deniz_photos/F3E0F8EF-AAE6-450E-B21C-9F0A96DFCE7C_1_105_c.jpeg',
        '../deniz_photos/F4819540-EDCE-4782-BF70-3A67C2768D55_1_102_a.jpeg',
        '../deniz_photos/F61B65D5-6AB8-4A3A-ACD5-ADB92155EE18_1_105_c.jpeg',
    ];

    function scatterPhotos(containerId, photoList, count, sizeMin, sizeMax) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const shuffled = [...photoList].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));

        // Generate random positions around edges
        const allPositions = [];
        // Top edge
        for (let i = 0; i < 6; i++) allPositions.push({ top: (2 + Math.random() * 12) + '%', left: (2 + Math.random() * 90) + '%' });
        // Bottom edge
        for (let i = 0; i < 6; i++) allPositions.push({ bottom: (2 + Math.random() * 12) + '%', left: (2 + Math.random() * 90) + '%' });
        // Left edge
        for (let i = 0; i < 4; i++) allPositions.push({ top: (15 + Math.random() * 65) + '%', left: (1 + Math.random() * 8) + '%' });
        // Right edge
        for (let i = 0; i < 4; i++) allPositions.push({ top: (15 + Math.random() * 65) + '%', right: (1 + Math.random() * 8) + '%' });

        const shuffledPos = allPositions.sort(() => Math.random() - 0.5);

        selected.forEach((src, i) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'mini-photo';

            const img = document.createElement('img');
            img.src = src;
            img.alt = '';
            img.loading = 'lazy';
            wrapper.appendChild(img);

            const pos = shuffledPos[i % shuffledPos.length];
            if (pos.top) wrapper.style.top = pos.top;
            if (pos.bottom) wrapper.style.bottom = pos.bottom;
            if (pos.left) wrapper.style.left = pos.left;
            if (pos.right) wrapper.style.right = pos.right;

            const rotation = -15 + Math.random() * 30;
            wrapper.style.setProperty('--rotation', rotation + 'deg');

            const size = sizeMin + Math.floor(Math.random() * (sizeMax - sizeMin));
            wrapper.style.setProperty('--size', size + 'px');

            wrapper.style.animationDelay = (0.2 + i * 0.1) + 's';

            container.appendChild(wrapper);
        });
    }

    function createScatteredPhotos() {
        // Intro: seyahat fotoğrafları, seyrek
        scatterPhotos('scattered-photos', TRAVEL_THUMBS, 8, 50, 80);
        // Qualities (Sende Sevdiklerim): deniz fotoğrafları, yoğun
        scatterPhotos('scattered-photos-qualities', DENIZ_PHOTOS, 20, 45, 75);
        // Finale: seyahat fotoğrafları, orta yoğunluk
        scatterPhotos('scattered-photos-finale', TRAVEL_THUMBS, 10, 45, 70);
        // Counter: seyahat fotoğrafları, seyrek
        scatterPhotos('scattered-photos-counter', TRAVEL_THUMBS, 6, 40, 65);
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
    let audio = null;
    let isPlaying = false;

    function showMusicPlayer() {
        const player = document.getElementById('music-player');
        player.classList.remove('hidden');
        player.classList.add('visible');

        const toggle = document.getElementById('music-toggle');

        if (!audio) {
            audio = new Audio();
            audio.src = 'music.mp3';
            audio.loop = true;
            audio.volume = 0.5;
            audio.onerror = () => {
                console.log('Müzik dosyası bulunamadı. "music.mp3" dosyasını aynı klasöre ekleyin.');
            };
        }

        // Zarf açılınca otomatik çal
        audio.play().then(() => {
            isPlaying = true;
            player.classList.add('playing');
        }).catch(() => {
            console.log('Müzik çalmak için kullanıcı etkileşimi gerekiyor.');
        });

        toggle.addEventListener('click', () => {
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
            case 'travel-section':
                animateBoardingPasses();
                break;
            case 'counter-section':
                initStarryBackground();
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

    // ==================== BOARDING PASSES ====================
    function setupBoardingPasses() {
        // Click to flip
        document.querySelectorAll('.boarding-pass').forEach(bp => {
            bp.addEventListener('click', (e) => {
                // Don't flip if clicking a photo
                if (e.target.tagName === 'IMG') return;
                bp.classList.toggle('flipped');
            });
        });

        // Lightbox for photos
        const lightbox = document.createElement('div');
        lightbox.className = 'bp-lightbox';
        lightbox.innerHTML = '<img src="" alt="">';
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        document.querySelectorAll('.bp-photos img').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                const fullSrc = img.src.replace('/thumbs/', '/photos/');
                lightbox.querySelector('img').src = fullSrc;
                lightbox.classList.add('active');
            });
        });
    }

    function animateBoardingPasses() {
        const passes = document.querySelectorAll('.boarding-pass');
        passes.forEach((bp, i) => {
            setTimeout(() => {
                bp.classList.add('visible');
            }, 200 + i * 150);
        });

        // Show footer
        const footer = document.querySelector('.travel-footer');
        if (footer) {
            setTimeout(() => footer.classList.add('visible'), 400 + passes.length * 150);
        }
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
            'btn-to-travel': 5,
            'btn-to-gallery': 6,
            'btn-to-counter': 7,
            'btn-to-memory-game': 8,
            'btn-to-future': 9,
            'btn-to-finale': 10
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
    let touchStartScrollTop = 0;
    let startedAtBoundary = false; // Was the user already at the boundary when touch started?
    let contentDidScroll = false;
    let sectionChangeCooldown = false;

    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        contentDidScroll = false;
        startedAtBoundary = false;

        // Remember scroll position of the active section at touch start
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            touchStartScrollTop = activeSection.scrollTop;
            const scrollHeight = activeSection.scrollHeight;
            const clientHeight = activeSection.clientHeight;
            const isScrollable = scrollHeight > clientHeight + 10;

            if (!isScrollable) {
                // Not scrollable — always at boundary
                startedAtBoundary = true;
            } else {
                // Check if already at top or bottom when touch starts
                const atTop = activeSection.scrollTop <= 3;
                const atBottom = activeSection.scrollTop + clientHeight >= scrollHeight - 3;
                startedAtBoundary = atTop || atBottom;
            }
        } else {
            touchStartScrollTop = 0;
            startedAtBoundary = true;
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        // Check if section content actually scrolled during this touch
        const activeSection = document.querySelector('.section.active');
        if (activeSection) {
            const scrollDiff = Math.abs(activeSection.scrollTop - touchStartScrollTop);
            if (scrollDiff > 5) {
                contentDidScroll = true;
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        // If there's a cooldown active, ignore
        if (sectionChangeCooldown) return;

        const diffY = touchStartY - e.changedTouches[0].clientY;
        const diffX = touchStartX - e.changedTouches[0].clientX;
        const threshold = 120; // Higher threshold to avoid accidental triggers

        // If mostly horizontal swipe, ignore
        if (Math.abs(diffX) > Math.abs(diffY)) return;
        // Not enough vertical distance
        if (Math.abs(diffY) < threshold) return;

        const activeSection = document.querySelector('.section.active');

        if (activeSection) {
            const scrollTop = activeSection.scrollTop;
            const scrollHeight = activeSection.scrollHeight;
            const clientHeight = activeSection.clientHeight;
            const isScrollable = scrollHeight > clientHeight + 10;

            if (isScrollable) {
                // If content scrolled during this touch, it was a content scroll — NOT a section swipe
                if (contentDidScroll) return;

                // The user must have STARTED at the boundary to trigger a section change.
                // This prevents changing sections when a scroll gesture reaches the boundary mid-swipe.
                if (!startedAtBoundary) return;

                // Double-check: make sure we're at the correct boundary for the swipe direction
                if (diffY > 0) {
                    // Swiping up (next): only if truly at bottom
                    const atBottom = scrollTop + clientHeight >= scrollHeight - 5;
                    if (!atBottom) return;
                }
                if (diffY < 0) {
                    // Swiping down (prev): only if truly at top
                    const atTop = scrollTop <= 3;
                    if (!atTop) return;
                }
            }
        }

        // Apply cooldown to prevent double-triggers
        sectionChangeCooldown = true;
        setTimeout(() => { sectionChangeCooldown = false; }, 1000);

        if (diffY > 0) {
            // Swipe up - next section
            if (currentSection === 0) return;
            if (currentSection === 1 && !puzzleSolved) return;
            goToSection(currentSection + 1);
        } else {
            // Swipe down - previous section
            goToSection(currentSection - 1);
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
                alphaChange: (Math.random() * 0.02) + 0.005,
                isPink: Math.random() > 0.95
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
            if (star.isPink) {
                ctx.fillStyle = '#f8bbd0';
                ctx.beginPath();
                ctx.arc(parallaxX + 1, parallaxY + 1, star.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(() => animateStars(ctx));
    }

    // ==================== BEACH PARALLAX ==
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
        
        // City-photo pairs for matching (8 pairs = 16 cards)
        const cityPhotoPairs = [
            { city: 'Kayseri', emoji: '⛷️', photo: '../thumbs/Kayseri/3680B452-DB9F-49D5-82FC-5F306ABAB5B6_1_105_c.jpeg' },
            { city: 'Malaga', emoji: '🇪🇸', photo: '../thumbs/Malaga/451ADC0C-F51B-43B5-AFCF-23B5D308A503_1_105_c.jpeg' },
            { city: 'Positano', emoji: '🇮🇹', photo: '../thumbs/Positano/4EDACF22-11BF-4399-AD2C-9ACECB68A7F0.JPG' },
            { city: 'Atina', emoji: '🇬🇷', photo: '../thumbs/Atina/6C636F48-322C-42AF-B601-5700C993C5C5_1_105_c.jpeg' },
            { city: 'Marsilya', emoji: '🇫🇷', photo: '../thumbs/Marsilya/9C400CD9-E6EE-4F55-A2C1-9BCE1F46D0FF_1_105_c.jpeg' },
            { city: 'İzmir', emoji: '🏖️', photo: '../thumbs/Izmir/EC8ACB1A-BBDE-46BE-8E57-B23B09A0C000_1_105_c.jpeg' },
            { city: 'Antalya', emoji: '🌊', photo: '../thumbs/Antalya/98AAFEC6-2BBA-4DE6-80F3-658178101024_1_105_c.jpeg' },
            { city: 'Tiflis', emoji: '🇬🇪', photo: '../thumbs/Tiflis/5B676161-457C-4625-A89F-A67D08A65175.JPG' }
        ];
        
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
            
            // Create cards: one city card + one photo card per pair
            const cards = [];
            cityPhotoPairs.forEach((pair, idx) => {
                // City name card
                cards.push({
                    type: 'city',
                    pairId: idx,
                    city: pair.city,
                    emoji: pair.emoji,
                    photo: null
                });
                // Photo card
                cards.push({
                    type: 'photo',
                    pairId: idx,
                    city: pair.city,
                    emoji: null,
                    photo: pair.photo
                });
            });
            
            // Shuffle
            cards.sort(() => Math.random() - 0.5);
            
            // Clear grid
            grid.innerHTML = '';
            
            // Create card elements
            cards.forEach((card, index) => {
                const cardEl = document.createElement('div');
                cardEl.className = 'memory-card';
                cardEl.dataset.pairId = card.pairId;
                cardEl.dataset.id = index;
                
                if (card.type === 'city') {
                    cardEl.innerHTML = `
                        <div class="card-face card-back">💌</div>
                        <div class="card-face card-front card-city">
                            <span class="card-emoji">${card.emoji}</span>
                            <span class="card-city-name">${card.city}</span>
                        </div>
                    `;
                } else {
                    cardEl.innerHTML = `
                        <div class="card-face card-back">💌</div>
                        <div class="card-face card-front card-photo">
                            <img src="${card.photo}" alt="${card.city}" loading="lazy">
                        </div>
                    `;
                }
                
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
                
                setTimeout(checkMatch, 800);
            }
        }

        function checkMatch() {
            const [card1, card2] = flippedCards;
            const pairId1 = card1.dataset.pairId;
            const pairId2 = card2.dataset.pairId;
            
            if (pairId1 === pairId2) {
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

    // ==================== GALLERY LIGHTBOX ====================
    function setupGalleryLightbox() {
        // Create lightbox element
        const lightbox = document.createElement('div');
        lightbox.className = 'gallery-lightbox';
        lightbox.innerHTML = '<img src="" alt="">';
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });

        // Attach click to all gallery photos
        document.querySelectorAll('.gallery-container .photo-placeholder.has-photo img').forEach(img => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                lightbox.querySelector('img').src = img.src;
                lightbox.classList.add('active');
            });
        });
    }

})();
