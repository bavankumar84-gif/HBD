/**
 * Digital Birthday Surprise Engine — Bakkiya
 * Interactive Gift Opening | Heart Cursor Trail | Audio Manager | 3D Memory Cards | Cake Physics
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 01. CONFIGURATION & STATE
    // -------------------------------------------------------------------------
    const config = window.BIRTHDAY_CONFIG || {};

    const state = {
        audioStarted: false,
        isAudioPlaying: false,
        giftOpened: false,
        mainExperienceStarted: false,
        candlesBlown: false,
        typewriterDone: false
    };

    // DOM Elements
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    const bgAudio = document.getElementById('bg-audio');
    const audioBtn = document.getElementById('audio-toggle-btn');
    const heartContainer = document.getElementById('heart-cursor-container');

    // -------------------------------------------------------------------------
    // 02. HEART CURSOR TRAIL EFFECT
    // -------------------------------------------------------------------------
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isTouchDevice && !prefersReducedMotion && heartContainer) {
        let lastHeartTime = 0;

        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            // Throttle heart creation to every 65ms for optimal performance
            if (now - lastHeartTime < 65) return;
            lastHeartTime = now;

            // Cap active hearts to 18 max
            if (heartContainer.children.length > 18) {
                heartContainer.removeChild(heartContainer.firstChild);
            }

            const heart = document.createElement('div');
            heart.className = 'cursor-heart';
            heart.textContent = '❤️';

            // Check if hovering over important interactive elements
            const target = e.target.closest('.interactive-hover-btn, .interactive-gift-box, button, .memory-card');
            if (target) {
                heart.classList.add('large-glow');
            }

            // Slight random offset & rotation
            const offsetX = (Math.random() - 0.5) * 12;
            const offsetY = (Math.random() - 0.5) * 12;

            heart.style.left = `${e.clientX + offsetX}px`;
            heart.style.top = `${e.clientY + offsetY}px`;

            heartContainer.appendChild(heart);

            // Clean up heart after animation completes
            setTimeout(() => {
                if (heart.parentNode === heartContainer) {
                    heartContainer.removeChild(heart);
                }
            }, 1200);
        });
    }


    // -------------------------------------------------------------------------
    // 03. CANVAS PARTICLE ENGINE (Stars, Ambient Floating Orbs, Confetti, Smoke)
    // -------------------------------------------------------------------------
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const confetti = [];
    const smokeParticles = [];

    // Background Stars & Ambient Glowing Particles
    for (let i = 0; i < 90; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            color: Math.random() > 0.4 ? 'rgba(244, 114, 182, ' : 'rgba(192, 132, 252, ',
            alpha: Math.random() * 0.7 + 0.2,
            speedY: (Math.random() - 0.5) * 0.3,
            speedX: (Math.random() - 0.5) * 0.3,
            pulseSpeed: Math.random() * 0.02 + 0.005
        });
    }

    // Confetti Physics Generator
    function createConfettiBurst(originX, originY, count = 130) {
        const colors = ['#ec4899', '#f472b6', '#c084fc', '#fb923c', '#fbbf24', '#38bdf8', '#ffffff'];
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 12 + 4;
            confetti.push({
                x: originX,
                y: originY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10,
                gravity: 0.18,
                drag: 0.98,
                alpha: 1,
                decay: Math.random() * 0.008 + 0.004
            });
        }
    }

    // Candle Smoke Generator
    function createSmokeBurst(startX, startY, count = 25) {
        for (let i = 0; i < count; i++) {
            smokeParticles.push({
                x: startX + (Math.random() - 0.5) * 10,
                y: startY,
                vx: (Math.random() - 0.5) * 0.8,
                vy: -Math.random() * 1.8 - 0.8,
                radius: Math.random() * 6 + 3,
                maxRadius: Math.random() * 25 + 15,
                alpha: 0.6,
                decay: 0.008
            });
        }
    }

    // Canvas Render Loop
    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        // 1. Draw Ambient Particles / Stars
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
            const currentAlpha = Math.max(0.1, Math.min(0.9, p.alpha));

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + currentAlpha + ')';
            ctx.fill();
        });

        // 2. Draw Confetti Particles
        for (let i = confetti.length - 1; i >= 0; i--) {
            const c = confetti[i];
            c.vx *= c.drag;
            c.vy *= c.drag;
            c.vy += c.gravity;
            c.x += c.vx;
            c.y += c.vy;
            c.rotation += c.rotSpeed;
            c.alpha -= c.decay;

            if (c.alpha <= 0) {
                confetti.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate((c.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, c.alpha);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size * 0.7);
            ctx.restore();
        }

        // 3. Draw Smoke Particles
        for (let i = smokeParticles.length - 1; i >= 0; i--) {
            const sm = smokeParticles[i];
            sm.x += sm.vx;
            sm.y += sm.vy;
            if (sm.radius < sm.maxRadius) sm.radius += 0.3;
            sm.alpha -= sm.decay;

            if (sm.alpha <= 0) {
                smokeParticles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(sm.x, sm.y, sm.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(226, 232, 240, ${Math.max(0, sm.alpha)})`;
            ctx.fill();
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();


    // -------------------------------------------------------------------------
    // 04. AUDIO MANAGER (music.mp3 Smooth Fade-In & Web Audio Synth Fallback)
    // -------------------------------------------------------------------------
    let audioCtx = null;
    let musicSynthInterval = null;

    function initWebAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // Play Ambient Melody via Web Audio API (Fallback if music.mp3 is unavailable)
    const synthNotes = [261.63, 261.63, 293.66, 261.63, 349.23, 329.63, 261.63, 261.63, 293.66, 261.63, 392.00, 349.23];
    let synthIdx = 0;

    function playSynthNote(freq, duration = 1.2) {
        if (!audioCtx || !state.isAudioPlaying) return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
    }

    function startAudio() {
        if (state.isAudioPlaying) return;
        state.isAudioPlaying = true;
        state.audioStarted = true;
        audioBtn.classList.remove('muted');

        // Attempt HTML5 Audio Playback with smooth fade in
        if (bgAudio) {
            bgAudio.volume = 0;
            const playPromise = bgAudio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Smooth volume fade-in over 1.2 seconds to maximum 1.0 volume
                    let vol = 0;
                    const targetVol = (config.audio && config.audio.defaultVolume) !== undefined ? config.audio.defaultVolume : 1.0;
                    const fadeInterval = setInterval(() => {
                        vol += 0.1;
                        if (vol >= targetVol) {
                            bgAudio.volume = targetVol;
                            clearInterval(fadeInterval);
                        } else {
                            bgAudio.volume = vol;
                        }
                    }, 80);
                }).catch(() => {
                    // Fallback to Web Audio Synth if music.mp3 fails or is blocked
                    initWebAudio();
                    if (!musicSynthInterval) {
                        musicSynthInterval = setInterval(() => {
                            if (state.isAudioPlaying) {
                                playSynthNote(synthNotes[synthIdx % synthNotes.length]);
                                synthIdx++;
                            }
                        }, 700);
                    }
                });
            }
        }
    }

    function pauseAudio() {
        state.isAudioPlaying = false;
        audioBtn.classList.add('muted');
        if (bgAudio) bgAudio.pause();
        if (musicSynthInterval) clearInterval(musicSynthInterval);
    }

    // Floating Audio Button Toggle Handler
    audioBtn.addEventListener('click', () => {
        if (state.isAudioPlaying) {
            pauseAudio();
        } else {
            startAudio();
        }
    });


    // -------------------------------------------------------------------------
    // 05. 🎁 SECTION 01 — INTERACTIVE GIFT BOX OPENING
    // -------------------------------------------------------------------------
    const giftBox = document.getElementById('interactive-gift-box');
    const giftPromptWrap = document.getElementById('gift-prompt-wrap');
    const giftRevealContent = document.getElementById('gift-reveal-content');
    const letsBeginBtn = document.getElementById('lets-begin-btn');

    // 3D Gift Box Mouse Move Hover Reaction
    if (giftBox && !isTouchDevice) {
        giftBox.addEventListener('mousemove', (e) => {
            if (state.giftOpened) return;
            const rect = giftBox.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = (-y / rect.height) * 20;
            const rotateY = (x / rect.width) * 20;

            const gift3d = giftBox.querySelector('.gift-3d');
            if (gift3d) {
                gift3d.style.transform = `translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.06)`;
            }
        });

        giftBox.addEventListener('mouseleave', () => {
            if (state.giftOpened) return;
            const gift3d = giftBox.querySelector('.gift-3d');
            if (gift3d) {
                gift3d.style.transform = '';
            }
        });
    }

    // Gift Opening Click Interaction
    function handleGiftClick() {
        if (state.giftOpened) return;
        state.giftOpened = true;

        // Start background music immediately on user's first gesture!
        startAudio();

        // 1. Shake gift box
        giftBox.classList.add('shaking');

        setTimeout(() => {
            // 2. Open lid
            giftBox.classList.remove('shaking');
            giftBox.classList.add('opened');

            // 3. Launch confetti & sparkles burst from center
            const rect = giftBox.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            createConfettiBurst(centerX, centerY, 150);

            // 4. Smoothly fade prompt out and reveal text
            setTimeout(() => {
                giftPromptWrap.style.opacity = '0';
                giftPromptWrap.style.transform = 'translateY(-20px)';

                setTimeout(() => {
                    giftPromptWrap.style.display = 'none';
                    giftRevealContent.classList.remove('hidden-content');
                }, 500);
            }, 600);
        }, 500);
    }

    if (giftBox) {
        giftBox.addEventListener('click', handleGiftClick);
    }

    // "Let's Begin →" Button Click (Transitions to main experience)
    const mainExperience = document.getElementById('main-experience');

    letsBeginBtn.addEventListener('click', () => {
        if (state.mainExperienceStarted) return;
        state.mainExperienceStarted = true;

        // Reveal Main Experience
        mainExperience.classList.remove('hidden-experience');

        // Render dynamic sections
        renderMemoryCards();
        renderLetter();
        renderFinalComposition();

        // Smooth scroll down to birthday reveal stage
        const revealStage = document.getElementById('reveal-stage');
        if (revealStage) {
            revealStage.scrollIntoView({ behavior: 'smooth' });
        }
    });


    // -------------------------------------------------------------------------
    // 06. SECTION 02 — MEMORY CARDS RENDERER (3D Tilt)
    // -------------------------------------------------------------------------
    const memoriesContainer = document.getElementById('memories-container');

    function renderMemoryCards() {
        if (!config.photos || config.photos.length === 0 || memoriesContainer.children.length > 0) return;

        config.photos.forEach((photo) => {
            const card = document.createElement('div');
            card.className = `memory-card ${photo.layout || 'full-width'} interactive-hover-btn`;

            if (photo.layout === 'polaroid') {
                card.innerHTML = `
                    <div class="polaroid-frame">
                        <div class="polaroid-tape"></div>
                        <img src="${photo.src}" alt="${photo.title}">
                        <div class="polaroid-note">${photo.title}</div>
                    </div>
                    <div class="card-content">
                        <span class="accent-pill" style="margin-bottom: 0;">${photo.tag || 'Memory'}</span>
                        <p class="card-caption">${photo.caption}</p>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="card-img-wrap">
                        <img src="${photo.src}" alt="${photo.title}">
                    </div>
                    <div class="card-content">
                        <span class="accent-pill" style="margin-bottom: 0;">${photo.tag || 'Memory'}</span>
                        <h3 class="card-title">${photo.title}</h3>
                        <p class="card-caption">${photo.caption}</p>
                    </div>
                `;
            }

            // 3D Tilt Effect on mouse hover
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
            });

            memoriesContainer.appendChild(card);
        });
    }


    // -------------------------------------------------------------------------
    // 07. SECTION 03 — PERSONAL LETTER TYPEWRITER
    // -------------------------------------------------------------------------
    const typewriterElement = document.getElementById('typewriter-text');
    const letterSideImg = document.getElementById('letter-side-img');

    function renderLetter() {
        if (config.photos && config.photos.length >= 2 && letterSideImg) {
            letterSideImg.src = config.photos[1].src;
        }

        const fullText = config.letter ? config.letter.message : '';
        let charIdx = 0;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !state.typewriterDone) {
                    state.typewriterDone = true;
                    if (typewriterElement) {
                        typewriterElement.textContent = '';
                        function typeNextChar() {
                            if (charIdx < fullText.length) {
                                typewriterElement.textContent += fullText.charAt(charIdx);
                                charIdx++;
                                const speed = Math.random() * 35 + 25;
                                setTimeout(typeNextChar, speed);
                            }
                        }
                        typeNextChar();
                    }
                }
            });
        }, { threshold: 0.3 });

        const letterStage = document.getElementById('letter-stage');
        if (letterStage) observer.observe(letterStage);
    }


    // -------------------------------------------------------------------------
    // 08. SECTION 04 — INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWING
    // -------------------------------------------------------------------------
    const blowCandlesBtn = document.getElementById('blow-candles-btn');
    const wishStatusBadge = document.getElementById('wish-status-badge');
    const cakeMainHeading = document.getElementById('cake-main-heading');
    const cakeSubHeading = document.getElementById('cake-sub-heading');

    if (blowCandlesBtn) {
        blowCandlesBtn.addEventListener('click', () => {
            if (state.candlesBlown) return;
            state.candlesBlown = true;

            // Extinguish flames
            const flames = document.querySelectorAll('.candle-flame');
            flames.forEach(f => f.classList.add('extinguished'));

            // Emit smoke particles from candle positions
            const cakeSvg = document.querySelector('.svg-cake');
            if (cakeSvg) {
                const cakeRect = cakeSvg.getBoundingClientRect();
                createSmokeBurst(cakeRect.left + cakeRect.width * 0.37, cakeRect.top + cakeRect.height * 0.25, 20);
                createSmokeBurst(cakeRect.left + cakeRect.width * 0.50, cakeRect.top + cakeRect.height * 0.20, 20);
                createSmokeBurst(cakeRect.left + cakeRect.width * 0.63, cakeRect.top + cakeRect.height * 0.25, 20);
            }

            // Confetti burst
            createConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.5, 130);

            // Update UI
            blowCandlesBtn.style.display = 'none';
            if (cakeMainHeading) cakeMainHeading.textContent = "Your Wish Is Made! ✨";
            if (cakeSubHeading) cakeSubHeading.textContent = "May all your dreams come true this year.";
            if (wishStatusBadge) wishStatusBadge.classList.add('active');
        });
    }


    // -------------------------------------------------------------------------
    // 09. SECTION 05 — FINAL COMPOSITION & REPLAY
    // -------------------------------------------------------------------------
    const floatingPhotosGrid = document.getElementById('floating-photos-grid');
    const finalWishText = document.getElementById('final-wish-text');
    const footerText = document.getElementById('footer-text');
    const replayBtn = document.getElementById('replay-btn');

    function renderFinalComposition() {
        if (!config.photos || !floatingPhotosGrid || floatingPhotosGrid.children.length > 0) return;

        config.photos.forEach(photo => {
            const item = document.createElement('div');
            item.className = 'float-photo-item interactive-hover-btn';
            item.innerHTML = `<img src="${photo.src}" alt="${photo.title}">`;
            floatingPhotosGrid.appendChild(item);
        });

        if (finalWishText) finalWishText.textContent = config.finalWish || '';
        if (footerText) footerText.textContent = config.footerText || '';
    }

    // Replay Button Handler
    if (replayBtn) {
        replayBtn.addEventListener('click', () => {
            // Reset states
            state.giftOpened = false;
            state.mainExperienceStarted = false;
            state.candlesBlown = false;
            state.typewriterDone = false;

            // Reset gift screen UI
            giftBox.classList.remove('opened', 'shaking');
            giftPromptWrap.style.display = 'flex';
            giftPromptWrap.style.opacity = '1';
            giftPromptWrap.style.transform = 'translateY(0)';
            giftRevealContent.classList.add('hidden-content');

            // Hide main experience
            mainExperience.classList.add('hidden-experience');

            // Reset cake UI
            const flames = document.querySelectorAll('.candle-flame');
            flames.forEach(f => f.classList.remove('extinguished'));
            if (blowCandlesBtn) blowCandlesBtn.style.display = 'inline-flex';
            if (cakeMainHeading) cakeMainHeading.textContent = "One more thing...";
            if (cakeSubHeading) cakeSubHeading.textContent = "Make a wish ✨";
            if (wishStatusBadge) wishStatusBadge.classList.remove('active');

            // Scroll back to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
