
window.addEventListener('error', (e) => {
    const l = document.getElementById('loading');
    if (l) { l.classList.remove('hide'); l.style.whiteSpace = 'pre-wrap'; l.textContent = 'ERROR: ' + e.message + '\n(line ' + e.lineno + ')'; }
});


(() => {

// ============ DIFFICULTY ============
const DIFFICULTY = {
    SUPER_EASY: { name: 'SUPER EASY', icon: '🟢', color: '#2ecc71', desc: 'Very easy!', gravity: 0.18, jump: -5.8, gapBonus: 100, speedMultiplier: 0.65, spawnMultiplier: 1.6 },
    EASY: { name: 'EASY', icon: '🟡', color: '#f1c40f', desc: 'Relaxed mode', gravity: 0.28, jump: -6.5, gapBonus: 50, speedMultiplier: 0.8, spawnMultiplier: 1.3 },
    NORMAL: { name: 'NORMAL', icon: '🟠', color: '#e67e22', desc: 'Balanced', gravity: 0.42, jump: -7.5, gapBonus: 0, speedMultiplier: 1.0, spawnMultiplier: 1.0 },
    HARD: { name: 'HARD', icon: '🔴', color: '#e74c3c', desc: 'For pros!', gravity: 0.55, jump: -8.5, gapBonus: -25, speedMultiplier: 1.25, spawnMultiplier: 0.85 }
};

// ============ LEVELS ============
const LEVELS = [
    { name: 'EASY', icon: '🟢', minScore: 0, maxScore: 9, speed: 1.6, gap: 230, spawn: 130, color: '#2ecc71', bg: '#98FB98' },
    { name: 'MEDIUM', icon: '🟡', minScore: 10, maxScore: 24, speed: 2.0, gap: 200, spawn: 110, color: '#f1c40f', bg: '#f9e79f' },
    { name: 'HARD', icon: '🟠', minScore: 25, maxScore: 44, speed: 2.7, gap: 170, spawn: 95, color: '#e67e22', bg: '#f5b041' },
    { name: 'INSANE', icon: '🔴', minScore: 45, maxScore: 69, speed: 3.5, gap: 145, spawn: 80, color: '#e74c3c', bg: '#ec7063' },
    { name: 'EXTREME', icon: '💀', minScore: 70, maxScore: 9999, speed: 4.5, gap: 125, spawn: 70, color: '#9b59b6', bg: '#bb8fce' }
];

// ============ SKINS (with abilities) ============
const BIRD_SKINS = [
    { id: 'classic', name: 'Classic', body: '#ffd700', wing: '#ffb700', beak: '#ff8c00', eye: '#fff', price: 0, ability: 'coin_bonus', abilityDesc: '+15% coin spawn' },
    { id: 'fire', name: 'Fire', body: '#ff4757', wing: '#c0392b', beak: '#ffa502', eye: '#fff', price: 0, ability: 'fire_boost', abilityDesc: '1.15x speed, +10% score' },
    { id: 'ice', name: 'Ice', body: '#4dabf7', wing: '#1c7ed6', beak: '#ffa502', eye: '#fff', price: 0, ability: 'ice_glide', abilityDesc: '-20% gravity' },
    { id: 'ninja', name: 'Ninja', body: '#2d3436', wing: '#1e272e', beak: '#ffa502', eye: '#ffd700', price: 0, ability: 'ninja_dodge', abilityDesc: 'Smaller hitbox' },
    { id: 'rainbow', name: 'Rainbow', body: '#ff6b9d', wing: '#c44569', beak: '#ffd700', eye: '#fff', price: 50, ability: 'rainbow_trail', abilityDesc: 'Longer trail' },
    { id: 'galaxy', name: 'Galaxy', body: '#5f27cd', wing: '#341f97', beak: '#feca57', eye: '#fff', price: 75, ability: 'star_power', abilityDesc: 'Starts with shield' },
    { id: 'gold', name: 'Gold', body: '#ffd700', wing: '#f39c12', beak: '#e74c3c', eye: '#fff', price: 100, ability: 'gold_rush', abilityDesc: '2x coin value' },
    { id: 'toxic', name: 'Toxic', body: '#26de81', wing: '#20bf6b', beak: '#f7b731', eye: '#000', price: 125, ability: 'toxic_fumes', abilityDesc: 'Pipes 10% slower' },
    { id: 'phantom', name: 'Phantom', body: '#1e1e2e', wing: '#4a4a6a', beak: '#ff6b9d', eye: '#ff6b9d', price: 150, ability: 'phase', abilityDesc: '5% chance to phase through' },
    { id: 'legendary', name: 'Legendary', body: '#ff0844', wing: '#c44569', beak: '#ffd700', eye: '#fff', price: 200, ability: 'legend', abilityDesc: 'All bonuses +10%' }
];

// ============ TRAILS ============
const TRAILS = [
    { id: 'none', name: 'None', color: null, price: 0 },
    { id: 'rainbow', name: 'Rainbow', color: 'rainbow', price: 30 },
    { id: 'fire', name: 'Fire Trail', color: '#ff4757', price: 40 },
    { id: 'sparkle', name: 'Sparkle', color: '#ffd700', price: 50 },
    { id: 'star', name: 'Star Trail', color: '#3498db', price: 60 },
    { id: 'cosmic', name: 'Cosmic', color: '#9b59b6', price: 80 }
];

// ============ ACHIEVEMENTS ============
const ACHIEVEMENTS = [
    { id: 'first_flap', name: 'First Flap', icon: '🐣', desc: 'Flap for the first time', check: (s) => s.totalFlaps >= 1 },
    { id: 'score_10', name: 'Getting Started', icon: '⭐', desc: 'Score 10 points', check: (s) => s.bestScore >= 10 },
    { id: 'score_25', name: 'Rising Star', icon: '🌟', desc: 'Score 25 points', check: (s) => s.bestScore >= 25 },
    { id: 'score_50', name: 'Pro Player', icon: '💫', desc: 'Score 50 points', check: (s) => s.bestScore >= 50 },
    { id: 'score_100', name: 'Legend', icon: '👑', desc: 'Score 100 points', check: (s) => s.bestScore >= 100 },
    { id: 'score_150', name: 'Unstoppable', icon: '🔥', desc: 'Score 150 points', check: (s) => s.bestScore >= 150 },
    { id: 'combo_5', name: 'Combo Master', icon: '🎯', desc: 'Get combo x5', check: (s) => s.bestCombo >= 5 },
    { id: 'combo_10', name: 'Combo God', icon: '⚡', desc: 'Get combo x10', check: (s) => s.bestCombo >= 10 },
    { id: 'coins_50', name: 'Coin Collector', icon: '🪙', desc: 'Collect 50 coins total', check: (s) => s.totalCoins >= 50 },
    { id: 'coins_200', name: 'Rich Bird', icon: '💰', desc: 'Collect 200 coins total', check: (s) => s.totalCoins >= 200 },
    { id: 'play_10', name: 'Dedicated', icon: '🎮', desc: 'Play 10 games', check: (s) => s.totalGames >= 10 },
    { id: 'play_50', name: 'Addicted', icon: '🎯', desc: 'Play 50 games', check: (s) => s.totalGames >= 50 },
    { id: 'powerup_5', name: 'Powered Up', icon: '⚡', desc: 'Use 5 power-ups', check: (s) => s.powerupsUsed >= 5 },
    { id: 'boss_kill', name: 'Boss Slayer', icon: '👹', desc: 'Defeat the boss', check: (s) => s.bossKills >= 1 }
];

// ============ POWERUPS ============
const POWERUPS = {
    SHIELD: { id: 'shield', name: 'Shield', icon: '🛡️', color: '#3498db', duration: 0 },
    SLOWMO: { id: 'slowmo', name: 'Slow Motion', icon: '⏱️', color: '#9b59b6', duration: 300 },
    MAGNET: { id: 'magnet', name: 'Magnet', icon: '🧲', color: '#e74c3c', duration: 300 },
    DOUBLE: { id: 'double', name: '2x Score', icon: '✨', color: '#f39c12', duration: 300 }
};
function PU(type) { return POWERUPS[String(type).toUpperCase()]; }

// ============ MISSION POOL ============
const MISSION_POOL = [
    { id: 'collect_coins', text: 'Collect 10 coins in one run', target: 10, type: 'coins' },
    { id: 'reach_score', text: 'Reach score 15', target: 15, type: 'score' },
    { id: 'combo_3', text: 'Get combo x3', target: 3, type: 'combo' },
    { id: 'use_powerup', text: 'Use 2 power-ups', target: 2, type: 'powerups' },
    { id: 'reach_score_30', text: 'Reach score 30', target: 30, type: 'score' }
];

// ============ THEMES ============
const THEMES = {
    day: { skyTop: '#87CEEB', skyBottom: '#98FB98', ground: '#8B4513', groundDark: '#654321', cloud: 'rgba(255,255,255,0.7)', star: null },
    night: { skyTop: '#0f0f23', skyBottom: '#1a1a3e', ground: '#2c1810', groundDark: '#1a0f0a', cloud: 'rgba(108, 92, 231, 0.3)', star: '#fff' }
};

// ============ GAME MODES ============  
const GAME_MODES = {
    CLASSIC: { name: 'Classic', icon: '🎯', color: '#3498db', desc: 'Endless survival' },
    TIME_ATTACK: { name: 'Time Attack', icon: '⏰', color: '#e74c3c', desc: '60s max score', duration: 3600 },
    ZEN: { name: 'Zen Mode', icon: '🧘', color: '#9b59b6', desc: 'No collision, relax' }
};

// ============ BOSS CONFIG ============
const BOSS_CONFIG = { triggerScore: 100, health: 5, name: 'PIPE KING', icon: '👹', color: '#e74c3c' };

// ============ EVENTS ============
const EVENTS = {
    current: { name: 'Coin Frenzy', icon: '🪙', desc: 'Collect 30 coins in one run', target: 30, type: 'coins', reward: 100, color: '#ffd700' }
};



const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ============ STATE ============
const STATE = {
    MENU: 'menu', DIFFICULTY_SELECT: 'difficulty_select', MODE_SELECT: 'mode_select',
    PLAYING: 'playing', PAUSED: 'paused', GAME_OVER: 'gameover',
    SETTINGS: 'settings', LEADERBOARD: 'leaderboard', SKINS: 'skins',
    ACHIEVEMENTS: 'achievements', SHOP: 'shop', MISSIONS: 'missions', DAILY: 'daily',
    TRAILS: 'trails', EVENT: 'event', TUTORIAL: 'tutorial'
};
let currentState = STATE.MENU;

// ============ GAME VARIABLES ============
let currentDifficulty = 'SUPER_EASY';
let currentMode = 'CLASSIC';
let modeTimer = 0;
let currentLevelIndex = 0;
let levelUpAnimation = 0;
let bird = { x: 80, y: 300, width: 40, height: 30, velocity: 0, rotation: 0 };
let pipes = [];
let coins = [];
let powerupItems = [];
let score = 0;
let scoreFrac = 0;
let frameCount = 0;
let combo = 0;
let comboTimeout = 0;
let screenShake = 0;
let particles = [];
let stars = [];
let floatingTexts = [];
let trail = [];
let activePowerups = { shield: false, slowmo: 0, magnet: 0, double: 0 };
let runCoins = 0;
let runPowerups = 0;
let currentComboMax = 0;
let settings = { sound: true, particles: true, screenShake: true, music: true };
let currentTheme = 'day';
let achievementPopup = null;
let boss = null;
let bossDefeated = false;
let musicNode = null;
let musicPlaying = false;
let fpsDisplay = 60;

// ============ SAVE DATA ============
let saveData = {
    coins: 0, totalCoins: 0, bestScore: 0, bestCombo: 0,
    totalFlaps: 0, totalGames: 0, powerupsUsed: 0, bossKills: 0,
    unlockedSkins: ['classic', 'fire', 'ice', 'ninja'],
    currentSkin: 'classic', achievements: [],
    dailyStreak: 0, lastDailyClaim: null, missions: [],
    currentTrail: 'none', unlockedTrails: ['none'],
    leaderboardNames: [],
    eventClaimed: false,
    tutorialDone: false
};

function loadSave() {
    const saved = localStorage.getItem('flappyUltimateSave');
    if (saved) { try { saveData = { ...saveData, ...JSON.parse(saved) }; } catch (e) {} }
    if (!saveData.missions || saveData.missions.length === 0) generateMissions();
    if (!saveData.leaderboardNames) saveData.leaderboardNames = [];
    if (!saveData.unlockedTrails) saveData.unlockedTrails = ['none'];
}
function writeSave() { localStorage.setItem('flappyUltimateSave', JSON.stringify(saveData)); }
function generateMissions() {
    saveData.missions = [];
    const shuffled = [...MISSION_POOL].sort(() => Math.random() - 0.5);
    for (let i = 0; i < 3; i++) saveData.missions.push({ ...shuffled[i], progress: 0, completed: false });
    writeSave();
}
loadSave();

function getCurrentLevel() { return LEVELS[currentLevelIndex]; }
function getDiff() { return DIFFICULTY[currentDifficulty]; }
function getCurrentSkin() { return BIRD_SKINS.find(s => s.id === saveData.currentSkin) || BIRD_SKINS[0]; }
function getCurrentTrail() { return TRAILS.find(t => t.id === saveData.currentTrail) || TRAILS[0]; }

// ============ PERFORMANCE LIMITS ============
const MAX_PARTICLES = 100;
const MAX_FLOATING = 25;
const MAX_COINS = 30;
const MAX_POWERUPS = 15;
const MAX_PIPES = 15;

// ============ ABILITY EFFECTS ============

let modsCache = { id: null, mods: null };
function getAbilityModifiers() {
    const skin = getCurrentSkin();
    if (modsCache.id === skin.id) return modsCache.mods;
    const mods = {
        coinMultiplier: 1, scoreMultiplier: 1, gravityMultiplier: 1,
        speedMultiplier: 1, hitboxMultiplier: 1, trailLength: 15,
        startShield: false, phaseChance: 0
    };
    switch (skin.ability) {
        case 'coin_bonus': mods.coinMultiplier = 1.15; break;
        case 'fire_boost': mods.speedMultiplier = 1.15; mods.scoreMultiplier = 1.1; break;
        case 'ice_glide': mods.gravityMultiplier = 0.8; break;
        case 'ninja_dodge': mods.hitboxMultiplier = 0.75; break;
        case 'rainbow_trail': mods.trailLength = 30; break;
        case 'star_power': mods.startShield = true; break;
        case 'gold_rush': mods.coinMultiplier = 2; break;
        case 'toxic_fumes': mods.speedMultiplier = 0.9; break;
        case 'phase': mods.phaseChance = 0.05; break;
        case 'legend':
            mods.coinMultiplier = 1.1; mods.scoreMultiplier = 1.1;
            mods.gravityMultiplier = 0.9; mods.hitboxMultiplier = 0.9;
            break;
    }
    modsCache = { id: skin.id, mods };
    return mods;
}

// ============ SOUND ============

let audioCtx = null;
function getAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}
let lastSoundTime = 0;

function playSound(freq, dur, type = 'sine', vol = 0.15) {
    if (!settings.sound) return;
    const now = Date.now();
    if (now - lastSoundTime < 20) return;
    lastSoundTime = now;
    try {
        const ac = getAudio();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = type; osc.frequency.value = freq;
        osc.connect(gain); gain.connect(ac.destination);
        gain.gain.setValueAtTime(vol, ac.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
        osc.start(); osc.stop(ac.currentTime + dur);
    } catch (e) {}
}
function sfxFlap() { playSound(600, 0.1, 'square'); }
function sfxScore() { playSound(880, 0.1, 'sine'); }
function sfxHit() { playSound(150, 0.3, 'sawtooth'); }
function sfxClick() { playSound(1000, 0.05, 'sine', 0.08); }
function sfxCombo() { playSound(1200, 0.1, 'sine'); }
function sfxCoin() { playSound(1500, 0.08, 'square', 0.1); }
function sfxPowerup() { [600, 800, 1000].forEach((f, i) => setTimeout(() => playSound(f, 0.12, 'sine', 0.12), i * 50)); }
function sfxAchievement() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSound(f, 0.15, 'sine', 0.15), i * 70)); }
function sfxLevelUp() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playSound(f, 0.15, 'sine', 0.15), i * 80)); }
function sfxBossHit() { playSound(200, 0.4, 'sawtooth', 0.2); }
function sfxBossKill() { [300, 400, 500, 700, 900].forEach((f, i) => setTimeout(() => playSound(f, 0.2, 'square', 0.2), i * 100)); }

// ============ MUSIC ============
function startMusic() {
    if (!settings.music || musicPlaying) return;
    try {
        getAudio();
        musicPlaying = true;
        playMusicLoop();
    } catch (e) { musicPlaying = false; }
}
function playMusicLoop() {
    if (!musicPlaying || !settings.music) return;
    const notes = [262, 330, 392, 523, 392, 330];
    let i = 0;
    musicNode = setInterval(() => {
        if (!musicPlaying || !settings.music) { stopMusic(); return; }
        try {
            const ac = getAudio();
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.type = 'triangle'; osc.frequency.value = notes[i % notes.length];
            osc.connect(gain); gain.connect(ac.destination);
            gain.gain.setValueAtTime(0.03, ac.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.3);
            osc.start(); osc.stop(ac.currentTime + 0.3);
            i++;
        } catch (e) {}
    }, 400);
}
function stopMusic() {
    musicPlaying = false;
    if (musicNode) clearInterval(musicNode);
    musicNode = null;
}

// ============ STARS ============
function initStars() {
    stars = [];
    for (let i = 0; i < 40; i++) {
        stars.push({
            x: Math.random() * canvas.width, y: Math.random() * (canvas.height - 100),
            size: Math.random() * 2 + 1, speed: Math.random() * 0.5 + 0.2, twinkle: Math.random() * Math.PI * 2
        });
    }
}
initStars();

// ============ ACHIEVEMENTS ============
function checkAchievements() {
    ACHIEVEMENTS.forEach(ach => {
        if (!saveData.achievements.includes(ach.id) && ach.check(saveData)) {
            saveData.achievements.push(ach.id);
            achievementPopup = { ach, timer: 180 };
            sfxAchievement();
            writeSave();
        }
    });
}

// ============ MISSIONS ============
function updateMissions() {
    saveData.missions.forEach(m => {
        if (m.completed) return;
        let val = 0;
        if (m.type === 'coins') val = runCoins;
        if (m.type === 'score') val = score;
        if (m.type === 'combo') val = currentComboMax;
        if (m.type === 'powerups') val = runPowerups;
        m.progress = Math.min(val, m.target);
        if (m.progress >= m.target) {
            m.completed = true;
            saveData.coins += 20;
            writeSave();
            addFloatingText(canvas.width / 2, canvas.height / 2, '+20 coins!', '#ffd700', 24);
        }
    });
}

// ============ EVENT ============
function updateEvent() {
    if (saveData.eventClaimed) return;
    if (EVENTS.current.type === 'coins' && runCoins >= EVENTS.current.target) {
        saveData.eventClaimed = true;
        saveData.coins += EVENTS.current.reward;
        writeSave();
        addFloatingText(canvas.width / 2, canvas.height / 2 - 30, `EVENT! +${EVENTS.current.reward} coins`, '#ffd700', 26);
    }
}

// ============ RESET ============
function resetGame() {
    bird.y = 300; bird.velocity = 0; bird.rotation = 0;
    pipes = []; coins = []; powerupItems = []; particles = []; floatingTexts = []; trail = [];
    score = 0; scoreFrac = 0; combo = 0; frameCount = 0; screenShake = 0;
    currentLevelIndex = 0; levelUpAnimation = 0;
    runCoins = 0; runPowerups = 0; currentComboMax = 0; modeTimer = 0;
    activePowerups = { shield: false, slowmo: 0, magnet: 0, double: 0 };
    achievementPopup = null;
    boss = null; bossDefeated = false;
    if (getAbilityModifiers().startShield) activePowerups.shield = true;
}

function startGame() {
    resetGame();
    currentState = STATE.PLAYING;
    startMusic();
}

// ============ FLAP ============
function flap() {
    if (currentState === STATE.GAME_OVER) { startGame(); return; }
    if (currentState === STATE.PLAYING) {
        bird.velocity = getDiff().jump;
        sfxFlap();
        saveData.totalFlaps++;
    }
}

// ============ INPUT ============
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (currentState === STATE.PAUSED) { currentState = STATE.PLAYING; sfxClick(); }
        else if (currentState === STATE.PLAYING || currentState === STATE.GAME_OVER) flap();
        else if (currentState === STATE.TUTORIAL) { saveData.tutorialDone = true; writeSave(); startGame(); }
    }
    if (e.code === 'Escape' || e.code === 'KeyP') {
        e.preventDefault();
        if (currentState === STATE.PLAYING) { currentState = STATE.PAUSED; sfxClick(); }
        else if (currentState === STATE.PAUSED) { currentState = STATE.PLAYING; sfxClick(); }
    }
});
// FIX: GAME_OVER 
canvas.addEventListener('mousedown', () => {
    if (currentState === STATE.PLAYING) flap();
});
canvas.addEventListener('touchstart', (e) => {
    if (currentState === STATE.PLAYING) { e.preventDefault(); flap(); }
}, { passive: false });

// ============ PARTICLES ============
function createParticles(x, y, count = 15, colors = null) {
    if (!settings.particles) return;
    if (particles.length > MAX_PARTICLES) return;
    const actualCount = Math.min(count, MAX_PARTICLES - particles.length);
    for (let i = 0; i < actualCount; i++) {
        particles.push({
            x, y, vx: (Math.random() - 0.5) * 8, vy: (Math.random() - 0.5) * 8 - 2,
            life: 40, maxLife: 40, size: Math.random() * 4 + 2,
            color: colors ? colors[Math.floor(Math.random() * colors.length)] : `hsl(${Math.random() * 360}, 100%, 60%)`
        });
    }
}
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.25; p.vx *= 0.98; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }
}
function drawParticles() {
    particles.forEach(p => {
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// ============ FLOATING TEXT ============
function addFloatingText(x, y, text, color = '#ffd700', size = 22) {
    if (floatingTexts.length >= MAX_FLOATING) floatingTexts.shift();
    floatingTexts.push({ x, y, text, color, size, life: 60, maxLife: 60, vy: -2 });
}
function updateFloatingTexts() {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const t = floatingTexts[i];
        t.y += t.vy; t.life--;
        if (t.life <= 0) floatingTexts.splice(i, 1);
    }
}
function drawFloatingTexts() {
    floatingTexts.forEach(t => {
        ctx.globalAlpha = t.life / t.maxLife;
        ctx.fillStyle = t.color;
        ctx.font = `bold ${t.size}px Poppins, Arial`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
        ctx.strokeText(t.text, t.x, t.y);
        ctx.fillText(t.text, t.x, t.y);
    });
    ctx.globalAlpha = 1;
}

// ============ TRAIL ============
function updateTrail() {
    const maxTrail = getAbilityModifiers().trailLength;
    const trailSkin = getCurrentTrail();
    if (settings.particles && trail.length < maxTrail && trailSkin.id !== 'none') {
        let color = trailSkin.color;
        if (color === 'rainbow') color = `hsl(${(frameCount * 5) % 360}, 100%, 60%)`;
        trail.push({ x: bird.x, y: bird.y, life: 20, maxLife: 20, color });
    }
    for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life--;
        if (trail[i].life <= 0) trail.splice(i, 1);
    }
}
function drawTrail() {
    trail.forEach(t => {
        ctx.globalAlpha = (t.life / t.maxLife) * 0.7;
        ctx.fillStyle = t.color;
        ctx.beginPath(); ctx.arc(t.x, t.y, 8 * (t.life / t.maxLife), 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
}

// ============ HELPERS ============
function shadeColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return `#${((R << 16) | (G << 8) | B).toString(16).padStart(6, '0')}`;
}
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath(); this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r); this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r); this.arcTo(x, y, x + w, y, r);
        this.closePath(); return this;
    };
}
function drawButton(x, y, w, h, text, color = '#667eea', small = false) {
    const gradient = ctx.createLinearGradient(x, y, x, y + h);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, shadeColor(color, -20));
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 12); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${small ? 13 : 18}px Poppins, Arial`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
}

// ============ BACKGROUND ============

let bgCache = { key: '', grad: null };
function getBgGradient(theme, level) {
    const key = currentTheme + '|' + level.bg + '|' + canvas.height;
    if (bgCache.key !== key) {
        const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (currentTheme === 'day') {
            g.addColorStop(0, theme.skyTop);
            g.addColorStop(0.6, theme.skyBottom);
            g.addColorStop(1, level.bg);
        } else {
            g.addColorStop(0, theme.skyTop);
            g.addColorStop(1, theme.skyBottom);
        }
        bgCache = { key, grad: g };
    }
    return bgCache.grad;
}
function drawBackground() {
    const theme = THEMES[currentTheme];
    const level = getCurrentLevel();
    ctx.fillStyle = getBgGradient(theme, level);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (theme.star) {
        stars.forEach(s => {
            s.twinkle += 0.05; s.x -= s.speed * 0.3;
            if (s.x < 0) s.x = canvas.width;
            ctx.globalAlpha = 0.5 + Math.sin(s.twinkle) * 0.5;
            ctx.fillStyle = theme.star;
            ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
    ctx.fillStyle = theme.cloud;
    const cloudOffset = (frameCount * 0.3) % (canvas.width + 100);
    drawCloud(canvas.width - cloudOffset + 50, 80, 40);
    drawCloud(canvas.width - cloudOffset - 200, 150, 30);
    ctx.fillStyle = theme.ground;
    ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    ctx.fillStyle = theme.groundDark;
    for (let i = 0; i < canvas.width; i += 20) ctx.fillRect(i, canvas.height - 30, 10, 30);
}
function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size, y, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x - size, y, size * 0.7, 0, Math.PI * 2);
    ctx.arc(x, y - size * 0.5, size * 0.7, 0, Math.PI * 2);
    ctx.fill();
}

// ============ AIM ASSIST ============
function getAimAssistColor() {
    if (currentDifficulty !== 'SUPER_EASY' && currentDifficulty !== 'EASY') return null;
    const nextPipe = pipes.find(p => p.x + 60 > bird.x - 20);
    if (!nextPipe) return null;
    const gapCenter = nextPipe.topHeight + (getCurrentLevel().gap + getDiff().gapBonus) / 2;
    const diff = Math.abs(bird.y - gapCenter);
    if (diff < 50) return '#2ecc71';
    if (diff < 100) return '#f1c40f';
    return '#e74c3c';
}
function drawAimAssist() {
    if (currentDifficulty !== 'SUPER_EASY' && currentDifficulty !== 'EASY') return;
    const nextPipe = pipes.find(p => p.x + 60 > bird.x - 20);
    if (!nextPipe) return;
    const gap = getCurrentLevel().gap + getDiff().gapBonus;
    const gapCenter = nextPipe.topHeight + gap / 2;
    ctx.save();
    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bird.x, bird.y); ctx.lineTo(nextPipe.x, gapCenter); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
    ctx.beginPath(); ctx.arc(nextPipe.x, gapCenter, 8, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
}


// ============ DRAW BIRD (REALISTIC) ============
function drawBird() {
    const skin = getCurrentSkin();
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);

    // Drop shadow (soft)
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Body gradient (realistic lighting)
    const bodyGrad = ctx.createRadialGradient(-6, -8, 2, 0, 0, 26);
    bodyGrad.addColorStop(0, shadeColor(skin.body, 45));
    bodyGrad.addColorStop(0.5, skin.body);
    bodyGrad.addColorStop(1, shadeColor(skin.body, -35));

    // Main body (oval)
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, bird.width / 2, bird.height / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Belly (lighter underside)
    ctx.fillStyle = shadeColor(skin.body, 25);
    ctx.beginPath();
    ctx.ellipse(2, 5, bird.width / 3.5, bird.height / 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // === TAIL FEATHERS (behind body) ===
    ctx.fillStyle = shadeColor(skin.body, -25);
    ctx.beginPath();
    ctx.moveTo(-15, -4);
    ctx.lineTo(-26, -2);
    ctx.lineTo(-24, 2);
    ctx.lineTo(-26, 6);
    ctx.lineTo(-15, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = shadeColor(skin.body, -45);
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Tail feather details
    ctx.strokeStyle = shadeColor(skin.body, -50);
    ctx.lineWidth = 0.8;
    for (let i = -3; i <= 3; i += 2) {
        ctx.beginPath();
        ctx.moveTo(-16, i);
        ctx.lineTo(-23, i * 0.8);
        ctx.stroke();
    }

    // === WING (with detailed feathers) ===
    const flap = Math.sin(frameCount * 0.3) * 3;
    ctx.save();
    ctx.translate(-5, 3 + flap);
    ctx.rotate(-0.35);

    // Wing base
    ctx.fillStyle = shadeColor(skin.wing, -5);
    ctx.beginPath();
    ctx.ellipse(0, 0, 13, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = shadeColor(skin.wing, -35);
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Wing feather lines (3 curved feathers)
    ctx.strokeStyle = shadeColor(skin.wing, -30);
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i += 4) {
        ctx.beginPath();
        ctx.moveTo(-9, i);
        ctx.quadraticCurveTo(0, i + 2, 9, i);
        ctx.stroke();
    }

    // Wing highlight
    ctx.fillStyle = shadeColor(skin.wing, 30);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(-3, -2, 6, 3, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();

    // === HEAD (slightly separate for realistic look) ===
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(8, -7, 11, 0, Math.PI * 2);
    ctx.fill();

    // Head highlight
    ctx.fillStyle = shadeColor(skin.body, 40);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(4, -12, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // === EYE (realistic with iris) ===
    // Eye white (sclera)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(11, -9, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Iris (colored)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(12.5, -9, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(12.5, -9, 2, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight (sparkle - top left)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(11.5, -10.5, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Small second highlight (bottom right)
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(13.5, -8, 0.6, 0, Math.PI * 2);
    ctx.fill();

    // === EYE RING (like real birds) ===
    ctx.strokeStyle = shadeColor(skin.beak, -20);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(11, -9, 6, 0, Math.PI * 2);
    ctx.stroke();

    // === BEAK (detailed 3D look) ===
    // Upper beak
    ctx.fillStyle = skin.beak;
    ctx.beginPath();
    ctx.moveTo(17, -5);
    ctx.quadraticCurveTo(26, -2, 28, 1);
    ctx.lineTo(17, 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = shadeColor(skin.beak, -40);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Upper beak highlight
    ctx.fillStyle = shadeColor(skin.beak, 30);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(18, -3);
    ctx.quadraticCurveTo(24, -1, 26, 0);
    ctx.lineTo(18, 0);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Lower beak
    ctx.fillStyle = shadeColor(skin.beak, -15);
    ctx.beginPath();
    ctx.moveTo(17, 2);
    ctx.quadraticCurveTo(24, 4, 25, 5);
    ctx.lineTo(17, 5);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = shadeColor(skin.beak, -50);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Beak split line
    ctx.strokeStyle = shadeColor(skin.beak, -50);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(17, 2);
    ctx.lineTo(25, 3);
    ctx.stroke();

    // === NOSTRIL (small detail) ===
    ctx.fillStyle = shadeColor(skin.beak, -60);
    ctx.beginPath();
    ctx.arc(19, -2, 1, 0, Math.PI * 2);
    ctx.fill();

    // === SHIELD EFFECT ===
    if (activePowerups.shield) {
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#3498db';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Shield shimmer
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.stroke();
    }

    // === MAGNET EFFECT ===
    if (activePowerups.magnet > 0) {
        ctx.strokeStyle = 'rgba(231, 76, 60, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(0, 0, 60, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    ctx.restore();
}

// ============ DRAW COINS ============
function drawCoins() {
    coins.forEach(c => {
        const wobble = Math.sin(frameCount * 0.1 + c.id) * 2;
        ctx.save();
        ctx.translate(c.x, c.y + wobble);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f39c12';
        ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 1);
        ctx.restore();
    });
}

// ============ DRAW POWERUP ITEMS ============
function drawPowerupItems() {
    powerupItems.forEach(p => {
        const pu = PU(p.type);
        if (!pu) return;
        const wobble = Math.sin(frameCount * 0.15 + p.id) * 3;
        ctx.save();
        ctx.translate(p.x, p.y + wobble);
        ctx.fillStyle = pu.color;
        ctx.beginPath(); ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(pu.icon, 0, 2);
        ctx.restore();
    });
}

// ============ BOSS ============
function drawBoss() {
    if (!boss) return;
    const cx = canvas.width / 2;
    const by = 175 + Math.sin(frameCount * 0.08) * 6;
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '34px Poppins';
    ctx.fillText(BOSS_CONFIG.icon, cx, by);
    ctx.fillStyle = BOSS_CONFIG.color; ctx.font = 'bold 12px Poppins';
    ctx.fillText(BOSS_CONFIG.name, cx, by + 28);
    const bw = 140, bh = 10, bx = cx - bw / 2, byBar = by + 40;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.roundRect(bx, byBar, bw, bh, 5); ctx.fill();
    ctx.fillStyle = BOSS_CONFIG.color;
    const w = Math.max(0, bw * (boss.hp / BOSS_CONFIG.health));
    if (w > 0) { ctx.beginPath(); ctx.roundRect(bx, byBar, Math.max(w, 6), bh, 5); ctx.fill(); }
    ctx.restore();
}

// ============ COLLISION ============
function checkCollision() {
    const mods = getAbilityModifiers();
    const gap = getCurrentLevel().gap + getDiff().gapBonus;
    const hw = (bird.width / 2) * mods.hitboxMultiplier;
    const hh = (bird.height / 2) * mods.hitboxMultiplier;
    if (currentMode !== 'ZEN') {
        if (bird.y + hh >= canvas.height - 30) return true;
        if (bird.y - hh <= 0) return true;
    }
    for (let pipe of pipes) {
        if (bird.x + hw > pipe.x && bird.x - hw < pipe.x + 60) {
            if (bird.y - hh < pipe.topHeight || bird.y + hh > pipe.topHeight + gap) {
                if (currentMode === 'ZEN') continue;
                if (pipe.phase === undefined) pipe.phase = Math.random() < mods.phaseChance;
                if (pipe.phase) continue;
                if (activePowerups.shield) {
                    activePowerups.shield = false;
                    createParticles(bird.x, bird.y, 20, ['#3498db', '#fff']);
                    addFloatingText(bird.x, bird.y - 40, 'SHIELD USED!', '#3498db');
                    pipe.passed = true; pipe.x = -100;
                    return false;
                }
                return true;
            }
        }
    }
    return false;
}

// ============ UPDATE ============
function addScore(base) {
    const mods = getAbilityModifiers();
    score += base;
    scoreFrac += base * (mods.scoreMultiplier - 1);
    while (scoreFrac >= 1) { score++; scoreFrac -= 1; }
}

function update() {
    if (currentState !== STATE.PLAYING) return;

    const mods = getAbilityModifiers();
    const level = getCurrentLevel();
    const diff = getDiff();
    const effectiveGap = level.gap + diff.gapBonus;
    let effectiveSpeed = level.speed * diff.speedMultiplier * mods.speedMultiplier;
    const effectiveSpawn = Math.max(1, Math.floor(level.spawn * diff.spawnMultiplier));

    if (activePowerups.slowmo > 0) { effectiveSpeed *= 0.5; activePowerups.slowmo--; }
    if (activePowerups.magnet > 0) activePowerups.magnet--;
    if (activePowerups.double > 0) activePowerups.double--;

    if (currentMode === 'TIME_ATTACK') {
        modeTimer++;
        if (modeTimer >= GAME_MODES.TIME_ATTACK.duration) {
            currentState = STATE.GAME_OVER;
            sfxHit(); saveScore(); return;
        }
    }

    bird.velocity += diff.gravity * mods.gravityMultiplier;
    bird.y += bird.velocity;
    bird.rotation = Math.min(Math.max(bird.velocity * 0.05, -0.5), 0.8);

    if (currentMode === 'ZEN') {
        const minY = bird.height / 2;
        const maxY = canvas.height - 30 - bird.height / 2;
        if (bird.y < minY) { bird.y = minY; bird.velocity = 0; }
        if (bird.y > maxY) { bird.y = maxY; bird.velocity = 0; }
    }

    updateTrail();

    frameCount++;
    if (frameCount % effectiveSpawn === 0 && pipes.length < MAX_PIPES) {
        const topHeight = Math.random() * (canvas.height - effectiveGap - 100) + 50;
        pipes.push({ x: canvas.width, topHeight, passed: false });

        if (Math.random() < Math.min(0.95, 0.6 * mods.coinMultiplier) && coins.length < MAX_COINS) {
            const coinY = topHeight + effectiveGap / 2 + (Math.random() - 0.5) * (effectiveGap - 60);
            coins.push({ x: canvas.width + 60, y: coinY, id: Math.random() * 1000, collected: false });
        }
        if (Math.random() < 0.15 && powerupItems.length < MAX_POWERUPS) {
            const types = ['shield', 'slowmo', 'magnet', 'double'];
            const type = types[Math.floor(Math.random() * types.length)];
            powerupItems.push({ x: canvas.width + 60, y: topHeight + effectiveGap / 2, type, id: Math.random() * 1000 });
        }
    }

    // Pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.x -= effectiveSpeed;
        if (!pipe.passed && pipe.x + 60 < bird.x) {
            pipe.passed = true;
            addScore(activePowerups.double > 0 ? 2 : 1);
            combo++; comboTimeout = 120;
            currentComboMax = Math.max(currentComboMax, combo);
            if (combo >= 3) {
                addScore(1); sfxCombo();
                addFloatingText(bird.x + 30, bird.y - 30, `COMBO x${combo}`, '#ff6b6b');
                createParticles(bird.x, bird.y, 15, ['#ff6b6b', '#ffd700', '#fff']);
            } else {
                sfxScore(); createParticles(bird.x, bird.y, 10);
            }
            if (score > saveData.bestScore) saveData.bestScore = score;
            checkLevelUp();

            // Boss:
            if (boss) {
                boss.hp--;
                sfxBossHit();
                createParticles(canvas.width / 2, 175, 12, [BOSS_CONFIG.color, '#fff']);
                if (boss.hp <= 0) {
                    boss = null; bossDefeated = true;
                    saveData.bossKills++; saveData.coins += 50;
                    sfxBossKill(); screenShake = 20;
                    addFloatingText(canvas.width / 2, canvas.height / 2, 'BOSS DEFEATED! +50 🪙', '#ffd700', 24);
                    writeSave();
                }
            }
        }
        if (pipe.x + 60 < 0) pipes.splice(i, 1);
    }

    // Boss spawn
    if (!boss && !bossDefeated && currentMode !== 'ZEN' && score >= BOSS_CONFIG.triggerScore) {
        boss = { hp: BOSS_CONFIG.health };
        addFloatingText(canvas.width / 2, canvas.height / 2, `${BOSS_CONFIG.name} appears!`, BOSS_CONFIG.color, 26);
        screenShake = 12;
    }

    // Coins
    const coinValue = Math.max(1, Math.floor(mods.coinMultiplier));
    for (let i = coins.length - 1; i >= 0; i--) {
        const c = coins[i];
        c.x -= effectiveSpeed;
        if (activePowerups.magnet > 0) {
            const dx = bird.x - c.x, dy = bird.y - c.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) { c.x += dx * 0.08; c.y += dy * 0.08; }
        }
        if (!c.collected && Math.abs(c.x - bird.x) < 20 && Math.abs(c.y - bird.y) < 20) {
            c.collected = true;
            runCoins += coinValue; saveData.coins += coinValue; saveData.totalCoins += coinValue;
            sfxCoin();
            createParticles(c.x, c.y, 8, ['#ffd700', '#f39c12', '#fff']);
            addFloatingText(c.x, c.y - 15, '+' + coinValue + ' 🪙', '#ffd700', 18);
        }
        if (c.x < -20 || c.collected) coins.splice(i, 1);
    }

    // Powerups
    for (let i = powerupItems.length - 1; i >= 0; i--) {
        const p = powerupItems[i];
        const pu = PU(p.type);
        p.x -= effectiveSpeed;
        if (pu && Math.abs(p.x - bird.x) < 25 && Math.abs(p.y - bird.y) < 25) {
            runPowerups++; saveData.powerupsUsed++;
            sfxPowerup();
            createParticles(p.x, p.y, 15, [pu.color, '#fff']);
            addFloatingText(p.x, p.y - 20, pu.name + '!', pu.color, 18);
            if (p.type === 'shield') activePowerups.shield = true;
            else activePowerups[p.type] = pu.duration;
            powerupItems.splice(i, 1);
            continue;
        }
        if (p.x < -20) powerupItems.splice(i, 1);
    }

    if (comboTimeout > 0) { comboTimeout--; if (comboTimeout === 0) combo = 0; }
    updateParticles();
    updateFloatingTexts();
    if (levelUpAnimation > 0) levelUpAnimation--;

    if (frameCount % 30 === 0) {
        checkAchievements();
        updateMissions();
        updateEvent();
    }

    if (checkCollision()) {
        currentState = STATE.GAME_OVER;
        sfxHit(); screenShake = 15;
        createParticles(bird.x, bird.y, 20, ['#ff4757', '#ff6b6b', '#ffd700']);
        saveScore();
    }
}

function saveScore() {
    saveData.totalGames++;
    saveData.bestScore = Math.max(saveData.bestScore, score);
    saveData.bestCombo = Math.max(saveData.bestCombo, currentComboMax);
    if (score > 0) {
        saveData.leaderboardNames.push({
            score, difficulty: currentDifficulty, date: new Date().toLocaleDateString()
        });
        saveData.leaderboardNames.sort((a, b) => b.score - a.score);
        saveData.leaderboardNames = saveData.leaderboardNames.slice(0, 10);
    }
    writeSave();
    checkAchievements();
}

function checkLevelUp() {
    let newIndex = 0;
    for (let i = 0; i < LEVELS.length; i++) {
        if (score >= LEVELS[i].minScore && score <= LEVELS[i].maxScore) { newIndex = i; break; }
        if (score > LEVELS[LEVELS.length - 1].maxScore) newIndex = LEVELS.length - 1;
    }
    if (newIndex > currentLevelIndex) {
        currentLevelIndex = newIndex;
        levelUpAnimation = 120;
        sfxLevelUp();
        createParticles(canvas.width / 2, canvas.height / 2, 40, [LEVELS[currentLevelIndex].color, '#ffd700', '#fff']);
        screenShake = 20;
    }
}

// ============ LEVEL PROGRESS BAR ============
function drawLevelProgressBar() {
    const level = getCurrentLevel();
    const diff = getDiff();
    const range = level.maxScore - level.minScore + 1;
    const progress = Math.max(0, Math.min((score - level.minScore) / range, 1));
    const barX = 20, barY = 55, barW = canvas.width - 40, barH = 14;
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 7); ctx.fill();
    const fillGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
    fillGrad.addColorStop(0, level.color);
    fillGrad.addColorStop(1, shadeColor(level.color, 30));
    ctx.fillStyle = fillGrad;
    ctx.beginPath(); ctx.roundRect(barX, barY, Math.max(14, barW * progress), barH, 7); ctx.fill();
    ctx.fillStyle = level.color; ctx.font = 'bold 13px Poppins'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(`${level.icon} ${level.name}`, barX, barY - 8);
    ctx.fillStyle = diff.color; ctx.textAlign = 'center'; ctx.font = 'bold 12px Poppins';
    ctx.fillText(`${diff.icon} ${diff.name}`, barX + barW / 2, barY - 8);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'right';
    const rem = level.maxScore - score + 1;
    ctx.fillText(currentLevelIndex < LEVELS.length - 1 ? `${rem} to next` : 'MAX', barX + barW, barY - 8);
}

// ============ LEVEL UP ANIMATION ============
function drawLevelUpAnimation() {
    if (levelUpAnimation <= 0) return;
    const progress = 1 - (levelUpAnimation / 120);
    const alpha = levelUpAnimation > 90 ? (120 - levelUpAnimation) / 30 : levelUpAnimation / 90;
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.3})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.globalAlpha = alpha; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const scale = 1 + Math.sin(progress * Math.PI) * 0.3;
    ctx.translate(canvas.width / 2, canvas.height / 2); ctx.scale(scale, scale);
    ctx.shadowColor = getCurrentLevel().color; ctx.shadowBlur = 20;
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Poppins'; ctx.fillText('LEVEL UP!', 0, -40);
    ctx.fillStyle = getCurrentLevel().color; ctx.font = 'bold 48px Poppins';
    ctx.fillText(getCurrentLevel().name, 0, 10);
    ctx.restore();
}

// ============ ACHIEVEMENT POPUP ============
function drawAchievementPopup() {
    if (!achievementPopup) return;
    achievementPopup.timer--;
    const slideIn = Math.min(1, (180 - achievementPopup.timer) / 30);
    const slideOut = achievementPopup.timer < 30 ? achievementPopup.timer / 30 : 1;
    const x = canvas.width - 340 * slideIn * slideOut + 20;
    const y = 100;
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.beginPath(); ctx.roundRect(x, y, 320, 70, 12); ctx.fill();
    ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 24px Poppins'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(achievementPopup.ach.icon, x + 15, y + 45);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Poppins';
    ctx.fillText(achievementPopup.ach.name, x + 55, y + 30);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '11px Poppins';
    ctx.fillText(achievementPopup.ach.desc, x + 55, y + 50);
    ctx.restore();
    if (achievementPopup.timer <= 0) achievementPopup = null;
}

// ============ HUD ============
function drawHUD() {
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#fff'; ctx.font = 'bold 55px Poppins'; ctx.textAlign = 'center';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 6;
    ctx.strokeText(score, canvas.width / 2, 45);
    ctx.fillText(score, canvas.width / 2, 45);
    ctx.font = 'bold 14px Poppins'; ctx.textAlign = 'left';
    ctx.fillStyle = '#ffd700'; ctx.strokeStyle = '#000'; ctx.lineWidth = 3;
    ctx.strokeText('🪙 ' + saveData.coins, 15, 25);
    ctx.fillText('🪙 ' + saveData.coins, 15, 25);
    ctx.textAlign = 'right';
    ctx.strokeText('🏆 ' + saveData.bestScore, canvas.width - 15, 25);
    ctx.fillText('🏆 ' + saveData.bestScore, canvas.width - 15, 25);
    if (combo >= 2) {
        ctx.textAlign = 'center'; ctx.fillStyle = '#ff6b6b'; ctx.font = 'bold 18px Poppins';
        ctx.strokeText('COMBO x' + combo, canvas.width / 2, 100);
        ctx.fillText('COMBO x' + combo, canvas.width / 2, 100);
    }
    drawLevelProgressBar();
    let px = 15;
    ctx.font = 'bold 18px Poppins'; ctx.textAlign = 'left';
    if (activePowerups.shield) { ctx.fillStyle = '#3498db'; ctx.fillText('🛡️', px, 130); px += 30; }
    if (activePowerups.slowmo > 0) { ctx.fillStyle = '#9b59b6'; ctx.fillText('⏱️' + Math.ceil(activePowerups.slowmo / 60), px, 130); px += 45; }
    if (activePowerups.magnet > 0) { ctx.fillStyle = '#e74c3c'; ctx.fillText('🧲' + Math.ceil(activePowerups.magnet / 60), px, 130); px += 45; }
    if (activePowerups.double > 0) { ctx.fillStyle = '#f39c12'; ctx.fillText('✨' + Math.ceil(activePowerups.double / 60), px, 130); }
    if (currentMode === 'TIME_ATTACK') {
        const timeLeft = Math.ceil((GAME_MODES.TIME_ATTACK.duration - modeTimer) / 60);
        ctx.fillStyle = timeLeft < 10 ? '#ff4757' : '#fff';
        ctx.font = 'bold 20px Poppins'; ctx.textAlign = 'center';
        ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
        ctx.strokeText('⏰ ' + timeLeft + 's', canvas.width / 2, canvas.height - 55);
        ctx.fillText('⏰ ' + timeLeft + 's', canvas.width / 2, canvas.height - 55);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Poppins'; ctx.textAlign = 'right';
    ctx.fillText('FPS: ' + fpsDisplay, canvas.width - 15, canvas.height - 15);
}

// ============ MENU ============
// Mouse position 
let mouse = { x: -1, y: -1 };
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});
canvas.addEventListener('mouseleave', () => { mouse.x = -1; mouse.y = -1; });

function drawMiniBird(x, y, s, rot) {
    const skin = getCurrentSkin();
    const flap = Math.sin(frameCount * 0.25) * 3;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(s, s);

    // Shadow
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    // Body gradient
    const bodyGrad = ctx.createRadialGradient(-4, -5, 2, 0, 0, 20);
    bodyGrad.addColorStop(0, shadeColor(skin.body, 45));
    bodyGrad.addColorStop(0.5, skin.body);
    bodyGrad.addColorStop(1, shadeColor(skin.body, -35));

    // Body
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Belly
    ctx.fillStyle = shadeColor(skin.body, 25);
    ctx.beginPath();
    ctx.ellipse(2, 4, 10, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.fillStyle = shadeColor(skin.body, -25);
    ctx.beginPath();
    ctx.moveTo(-14, -3);
    ctx.lineTo(-22, -1);
    ctx.lineTo(-21, 2);
    ctx.lineTo(-22, 5);
    ctx.lineTo(-14, 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = shadeColor(skin.body, -45);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Wing (flapping)
    ctx.save();
    ctx.translate(-4, 2 + flap);
    ctx.rotate(-0.3);
    ctx.fillStyle = shadeColor(skin.wing, -5);
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = shadeColor(skin.wing, -35);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Wing feather lines
    ctx.strokeStyle = shadeColor(skin.wing, -30);
    ctx.lineWidth = 0.8;
    for (let i = -4; i <= 4; i += 3) {
        ctx.beginPath();
        ctx.moveTo(-7, i);
        ctx.lineTo(7, i);
        ctx.stroke();
    }

    // Wing highlight
    ctx.fillStyle = shadeColor(skin.wing, 30);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.ellipse(-2, -1, 4, 2, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();

    // Head (separate circle)
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(7, -6, 9, 0, Math.PI * 2);
    ctx.fill();

    // Head highlight
    ctx.fillStyle = shadeColor(skin.body, 40);
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.ellipse(3, -10, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Eye (realistic)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(10, -8, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Iris
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(11.5, -8, 3, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(11.5, -8, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Eye highlight
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(10.5, -9.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye ring
    ctx.strokeStyle = shadeColor(skin.beak, -20);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(10, -8, 5.5, 0, Math.PI * 2);
    ctx.stroke();

    // Beak (detailed)
    ctx.fillStyle = skin.beak;
    ctx.beginPath();
    ctx.moveTo(15, -4);
    ctx.quadraticCurveTo(24, -1, 26, 1);
    ctx.lineTo(15, 3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = shadeColor(skin.beak, -40);
    ctx.lineWidth = 1;
    ctx.stroke();

    // Upper beak highlight
    ctx.fillStyle = shadeColor(skin.beak, 30);
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(16, -2);
    ctx.quadraticCurveTo(22, 0, 24, 1);
    ctx.lineTo(16, 1);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    // Lower beak
    ctx.fillStyle = shadeColor(skin.beak, -15);
    ctx.beginPath();
    ctx.moveTo(15, 2);
    ctx.quadraticCurveTo(22, 4, 23, 5);
    ctx.lineTo(15, 5);
    ctx.closePath();
    ctx.fill();

    // Beak split
    ctx.strokeStyle = shadeColor(skin.beak, -50);
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(15, 2);
    ctx.lineTo(23, 3);
    ctx.stroke();

    // Nostril
    ctx.fillStyle = shadeColor(skin.beak, -60);
    ctx.beginPath();
    ctx.arc(17, -1, 0.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawPill(x, y, w, h, text, color) {
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill();
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = color; ctx.font = 'bold 13px Poppins, Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2 + 1);
}

function drawMenuCard(d, hover) {
    const y = d.y + (hover ? -2 : 0);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.roundRect(d.x, d.y + 4, d.w, d.h, 14); ctx.fill();
    ctx.fillStyle = hover ? shadeColor(d.color, 12) : shadeColor(d.color, -8);
    ctx.beginPath(); ctx.roundRect(d.x, y, d.w, d.h, 14); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.beginPath(); ctx.roundRect(d.x + 3, y + 3, d.w - 6, d.h * 0.42, 11); ctx.fill();
    ctx.strokeStyle = hover ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(d.x, y, d.w, d.h, 14); ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (d.big) {
        ctx.fillStyle = '#fff'; ctx.font = 'bold 26px Poppins, Arial';
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 4;
        ctx.strokeText('▶  PLAY', d.x + d.w / 2, y + d.h / 2 + 1);
        ctx.fillText('▶  PLAY', d.x + d.w / 2, y + d.h / 2 + 1);
    } else {
        ctx.font = '21px Poppins, Arial'; ctx.fillStyle = '#fff';
        ctx.fillText(d.icon, d.x + d.w / 2, y + d.h * 0.37);
        ctx.font = 'bold 11px Poppins, Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.fillText(d.label, d.x + d.w / 2, y + d.h * 0.76);
    }
    if (d.badge) {
        ctx.fillStyle = '#ff3b3b';
        ctx.beginPath(); ctx.arc(d.x + d.w - 8, y + 8, 9, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Poppins, Arial';
        ctx.fillText('!', d.x + d.w - 8, y + 9);
    }
}

function drawMenu() {
    const cx = canvas.width / 2;
    const t = frameCount * 0.05;

    const ov = ctx.createLinearGradient(0, 0, 0, canvas.height);
    ov.addColorStop(0, 'rgba(10,10,40,0.55)');
    ov.addColorStop(1, 'rgba(10,10,40,0.8)');
    ctx.fillStyle = ov; ctx.fillRect(0, 0, canvas.width, canvas.height);

    const bob = Math.sin(t) * 6;
    drawMiniBird(cx, 52 + bob, 1.25, Math.sin(t) * 0.12);

    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.lineJoin = 'round';
    ctx.font = 'bold 46px Poppins, Arial';
    ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.strokeText('FLAPPY', cx, 120 + bob * 0.4);
    ctx.fillStyle = '#ffd700'; ctx.fillText('FLAPPY', cx, 120 + bob * 0.4);
    ctx.font = 'bold 40px Poppins, Arial';
    ctx.strokeText('ULTIMATE', cx, 162 + bob * 0.4);
    ctx.fillStyle = '#ff6b6b'; ctx.fillText('ULTIMATE', cx, 162 + bob * 0.4);

    drawPill(cx - 118, 176, 110, 26, '🪙 ' + saveData.coins, '#ffd700');
    drawPill(cx + 8, 176, 110, 26, '🏆 ' + saveData.bestScore, '#ffb142');

    const diff = getDiff();
    ctx.fillStyle = diff.color; ctx.font = 'bold 12px Poppins, Arial'; ctx.textBaseline = 'middle';
    ctx.fillText(`${diff.icon} ${diff.name}  •  ${GAME_MODES[currentMode].icon} ${GAME_MODES[currentMode].name}`, cx, 220);

    const canClaim = saveData.lastDailyClaim !== new Date().toDateString();
    const cw = 110, ch = 54, gap = 10;
    const gx = (canvas.width - (cw * 3 + gap * 2)) / 2;
    const gy = 300;
    const items = [
        { icon: '🎯', label: 'MODE', color: '#e74c3c', action: 'modes' },
        { icon: '⚡', label: 'DIFFICULTY', color: diff.color, action: 'difficulty' },
        { icon: '🎨', label: 'SKINS', color: '#9b59b6', action: 'skins' },
        { icon: '🛒', label: 'SHOP', color: '#f39c12', action: 'shop' },
        { icon: '🌈', label: 'TRAILS', color: '#00bcd4', action: 'trails' },
        { icon: '🏅', label: 'ACHIEVE', color: '#e1b12c', action: 'achievements' },
        { icon: '📋', label: 'MISSIONS', color: '#3498db', action: 'missions' },
        { icon: '🎁', label: 'DAILY', color: '#e91e63', action: 'daily', badge: canClaim },
        { icon: '🎪', label: 'EVENT', color: '#ff9800', action: 'event' },
        { icon: '🏆', label: 'RANKS', color: '#667eea', action: 'leaderboard' },
        { icon: '📖', label: 'HOW TO', color: '#4caf50', action: 'tutorial' },
        { icon: '⚙️', label: 'SETTINGS', color: '#78909c', action: 'settings' }
    ].map((it, i) => ({
        ...it, x: gx + (i % 3) * (cw + gap), y: gy + Math.floor(i / 3) * (ch + 8), w: cw, h: ch
    }));

    const pulse = 1 + Math.sin(t * 2) * 0.025;
    const pw = 250 * pulse, ph = 54 * pulse;
    const play = { x: cx - pw / 2, y: 236 - (ph - 54) / 2, w: pw, h: ph, color: '#2ecc71', big: true };
    const playHit = { x: cx - 125, y: 236, w: 250, h: 54, action: 'play' };

    const over = (b) => mouse.x >= b.x && mouse.x <= b.x + b.w && mouse.y >= b.y && mouse.y <= b.y + b.h;
    drawMenuCard(play, over(playHit));
    items.forEach(it => drawMenuCard(it, over(it)));

    window.menuButtons = [playHit, ...items.map(it => ({ x: it.x, y: it.y, w: it.w, h: it.h, action: it.action }))];

    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '11px Poppins, Arial';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Space / Click to flap  •  P to pause', cx, canvas.height - 15);
}

// ============ MODES ============
function drawModes() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 28px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('GAME MODE', canvas.width / 2, 60);
    window.modeButtons = [];
    ['CLASSIC', 'TIME_ATTACK', 'ZEN'].forEach((key, i) => {
        const m = GAME_MODES[key];
        const y = 110 + i * 100;
        const sel = key === currentMode;
        ctx.fillStyle = sel ? shadeColor(m.color, -60) : 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.roundRect(40, y, canvas.width - 80, 85, 12); ctx.fill();
        ctx.strokeStyle = m.color; ctx.lineWidth = sel ? 4 : 2; ctx.stroke();
        ctx.fillStyle = m.color; ctx.font = 'bold 24px Poppins'; ctx.textAlign = 'left';
        ctx.fillText(m.icon + ' ' + m.name, 60, y + 40);
        ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '13px Poppins';
        ctx.fillText(m.desc, 60, y + 65);
        window.modeButtons.push({ x: 40, y, w: canvas.width - 80, h: 85, action: 'mode', key });
    });
    drawButton(canvas.width / 2 - 70, canvas.height - 70, 140, 45, '← BACK', '#e74c3c');
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 70, w: 140, h: 45, action: 'back' };
}

// ============ DIFFICULTY ============
function drawDifficultySelect() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 26px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('DIFFICULTY', canvas.width / 2, 50);
    window.diffButtons = [];
    ['SUPER_EASY', 'EASY', 'NORMAL', 'HARD'].forEach((key, i) => {
        const d = DIFFICULTY[key];
        const y = 80 + i * 90;
        const sel = key === currentDifficulty;
        ctx.fillStyle = sel ? shadeColor(d.color, -60) : 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.roundRect(30, y, canvas.width - 60, 75, 12); ctx.fill();
        ctx.strokeStyle = d.color; ctx.lineWidth = sel ? 4 : 2; ctx.stroke();
        ctx.fillStyle = d.color; ctx.font = 'bold 20px Poppins'; ctx.textAlign = 'left';
        ctx.fillText(d.icon + ' ' + d.name, 55, y + 30);
        ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.font = '12px Poppins';
        ctx.fillText(d.desc, 55, y + 55);
        if (sel) { ctx.fillStyle = d.color; ctx.font = 'bold 11px Poppins'; ctx.fillText('✓ SELECTED', 55, y + 70); }
        window.diffButtons.push({ x: 30, y, w: canvas.width - 60, h: 75, action: 'diff', key });
    });
    drawButton(canvas.width / 2 - 70, canvas.height - 65, 140, 45, '← BACK', '#e74c3c');
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 65, w: 140, h: 45, action: 'back' };
}

// ============ SKINS ============
function drawSkins() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 24px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('SKINS', canvas.width / 2, 36);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Poppins';
    ctx.fillText('🪙 ' + saveData.coins, canvas.width / 2, 58);
    window.skinButtons = [];
    const top = 68, bottom = canvas.height - 50;
    const pitch = Math.min(52, (bottom - top) / BIRD_SKINS.length);
    const h = pitch - 4;
    BIRD_SKINS.forEach((skin, i) => {
        const y = top + i * pitch;
        const sel = skin.id === saveData.currentSkin;
        const unlocked = saveData.unlockedSkins.includes(skin.id);
        ctx.fillStyle = sel ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.08)';
        ctx.beginPath(); ctx.roundRect(25, y, canvas.width - 50, h, 8); ctx.fill();
        if (sel) { ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3; ctx.stroke(); }
        ctx.save(); ctx.translate(50, y + h / 2);
        ctx.fillStyle = skin.body;
        ctx.beginPath(); ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = skin.eye; ctx.beginPath(); ctx.arc(5, -3, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(6, -3, 1.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.fillStyle = sel ? '#ffd700' : '#fff'; ctx.font = 'bold 13px Poppins'; ctx.textAlign = 'left';
        ctx.fillText(skin.name, 75, y + h * 0.42);
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '9px Poppins';
        ctx.fillText(skin.abilityDesc, 75, y + h * 0.78);
        ctx.textAlign = 'right'; ctx.font = 'bold 12px Poppins';
        if (unlocked) { ctx.fillStyle = sel ? '#ffd700' : '#2ecc71'; ctx.fillText(sel ? '✓' : 'OWNED', canvas.width - 40, y + h * 0.62); }
        else { ctx.fillStyle = '#f39c12'; ctx.fillText('🪙' + skin.price, canvas.width - 40, y + h * 0.62); }
        window.skinButtons.push({ x: 25, y, w: canvas.width - 50, h, action: 'skin', skin });
    });
    drawButton(canvas.width / 2 - 70, canvas.height - 44, 140, 36, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 44, w: 140, h: 36, action: 'back' };
}

// ============ TRAILS ============
function drawTrails() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 26px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('🌈 TRAILS', canvas.width / 2, 50);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Poppins';
    ctx.fillText('🪙 ' + saveData.coins, canvas.width / 2, 72);
    window.trailButtons = [];
    TRAILS.forEach((tr, i) => {
        const y = 90 + i * 62;
        if (y > canvas.height - 100) return;
        const sel = tr.id === saveData.currentTrail;
        const unlocked = saveData.unlockedTrails.includes(tr.id);
        ctx.fillStyle = sel ? 'rgba(255,215,0,0.25)' : 'rgba(255,255,255,0.08)';
        ctx.beginPath(); ctx.roundRect(30, y, canvas.width - 60, 54, 10); ctx.fill();
        if (sel) { ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 3; ctx.stroke(); }
        if (tr.color) {
            for (let j = 0; j < 3; j++) {
                ctx.globalAlpha = 1 - j * 0.3;
                ctx.fillStyle = tr.color === 'rainbow' ? `hsl(${j * 120}, 100%, 60%)` : tr.color;
                ctx.beginPath(); ctx.arc(60 + j * 10, y + 27, 8, 0, Math.PI * 2); ctx.fill();
            }
            ctx.globalAlpha = 1;
        }
        ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Poppins'; ctx.textAlign = 'left';
        ctx.fillText(tr.name, 110, y + 32);
        ctx.textAlign = 'right'; ctx.font = 'bold 12px Poppins';
        if (unlocked) { ctx.fillStyle = sel ? '#ffd700' : '#2ecc71'; ctx.fillText(sel ? '✓ EQUIPPED' : 'OWNED', canvas.width - 45, y + 32); }
        else { ctx.fillStyle = '#f39c12'; ctx.fillText('🪙 ' + tr.price, canvas.width - 45, y + 32); }
        window.trailButtons.push({ x: 30, y, w: canvas.width - 60, h: 54, action: 'trail', trail: tr });
    });
    drawButton(canvas.width / 2 - 70, canvas.height - 55, 140, 42, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 55, w: 140, h: 42, action: 'back' };
}

// ============ SHOP ============
function drawShop() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 26px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('🛒 SHOP', canvas.width / 2, 45);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Poppins';
    ctx.fillText('🪙 ' + saveData.coins + ' coins', canvas.width / 2, 70);
    window.shopButtons = [];
    const locked = BIRD_SKINS.filter(s => !saveData.unlockedSkins.includes(s.id));
    if (locked.length === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '16px Poppins';
        ctx.fillText('All skins unlocked! 🎉', canvas.width / 2, 300);
    } else {
        locked.forEach((skin, i) => {
            const y = 90 + i * 55;
            if (y > canvas.height - 100) return;
            const canAfford = saveData.coins >= skin.price;
            ctx.fillStyle = canAfford ? 'rgba(46,204,113,0.2)' : 'rgba(255,255,255,0.08)';
            ctx.beginPath(); ctx.roundRect(30, y, canvas.width - 60, 48, 10); ctx.fill();
            ctx.strokeStyle = canAfford ? '#2ecc71' : '#666'; ctx.lineWidth = 2; ctx.stroke();
            ctx.save(); ctx.translate(60, y + 24);
            ctx.fillStyle = skin.body;
            ctx.beginPath(); ctx.ellipse(0, 0, 14, 10, 0, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Poppins'; ctx.textAlign = 'left';
            ctx.fillText(skin.name, 90, y + 30);
            ctx.textAlign = 'right'; ctx.font = 'bold 13px Poppins';
            ctx.fillStyle = canAfford ? '#2ecc71' : '#e74c3c';
            ctx.fillText('🪙 ' + skin.price, canvas.width - 45, y + 30);
            window.shopButtons.push({ x: 30, y, w: canvas.width - 60, h: 48, action: 'buy', skin, canAfford });
        });
    }
    drawButton(canvas.width / 2 - 70, canvas.height - 55, 140, 42, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 55, w: 140, h: 42, action: 'back' };
}

// ============ ACHIEVEMENTS ============
function drawAchievements() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 24px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('🏆 ACHIEVEMENTS', canvas.width / 2, 40);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Poppins';
    ctx.fillText(saveData.achievements.length + ' / ' + ACHIEVEMENTS.length + ' unlocked', canvas.width / 2, 60);
    const top = 72, bottom = canvas.height - 60;
    const pitch = Math.min(44, (bottom - top) / ACHIEVEMENTS.length);
    const h = pitch - 3;
    ACHIEVEMENTS.forEach((ach, i) => {
        const y = top + i * pitch;
        const unlocked = saveData.achievements.includes(ach.id);
        ctx.fillStyle = unlocked ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)';
        ctx.beginPath(); ctx.roundRect(25, y, canvas.width - 50, h, 7); ctx.fill();
        if (unlocked) { ctx.strokeStyle = '#ffd700'; ctx.lineWidth = 2; ctx.stroke(); }
        ctx.globalAlpha = unlocked ? 1 : 0.5;
        ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.min(18, h * 0.6)}px Poppins`; ctx.textAlign = 'left';
        ctx.fillText(ach.icon, 32, y + h * 0.68);
        ctx.font = `bold ${Math.min(12, h * 0.38)}px Poppins`;
        ctx.fillText(ach.name, 62, y + h * 0.45);
        ctx.font = `${Math.min(9, h * 0.28)}px Poppins`; ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText(ach.desc, 62, y + h * 0.82);
        if (unlocked) { ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 14px Poppins'; ctx.textAlign = 'right'; ctx.fillText('✓', canvas.width - 32, y + h * 0.68); }
        ctx.globalAlpha = 1;
    });
    drawButton(canvas.width / 2 - 70, canvas.height - 50, 140, 40, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 50, w: 140, h: 40, action: 'back' };
}

// ============ MISSIONS ============
function drawMissions() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 26px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('📋 MISSIONS', canvas.width / 2, 50);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '12px Poppins';
    ctx.fillText('Complete for 20 coins each', canvas.width / 2, 75);
    saveData.missions.forEach((m, i) => {
        const y = 110 + i * 110;
        const pct = Math.min(m.progress / m.target, 1);
        ctx.fillStyle = m.completed ? 'rgba(46,204,113,0.2)' : 'rgba(255,255,255,0.08)';
        ctx.beginPath(); ctx.roundRect(30, y, canvas.width - 60, 95, 12); ctx.fill();
        ctx.strokeStyle = m.completed ? '#2ecc71' : '#3498db'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Poppins'; ctx.textAlign = 'left';
        ctx.fillText(m.text, 50, y + 30);
        ctx.fillStyle = m.completed ? '#2ecc71' : '#3498db'; ctx.font = 'bold 12px Poppins';
        ctx.fillText(m.completed ? '✓ COMPLETE' : m.progress + ' / ' + m.target, 50, y + 55);
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath(); ctx.roundRect(50, y + 65, canvas.width - 100, 14, 7); ctx.fill();
        ctx.fillStyle = m.completed ? '#2ecc71' : '#3498db';
        ctx.beginPath(); ctx.roundRect(50, y + 65, Math.max(14, (canvas.width - 100) * pct), 14, 7); ctx.fill();
        ctx.fillStyle = '#ffd700'; ctx.font = 'bold 11px Poppins'; ctx.textAlign = 'right';
        ctx.fillText('🪙 20', canvas.width - 45, y + 30);
    });
    drawButton(canvas.width / 2 - 70, canvas.height - 55, 140, 42, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 55, w: 140, h: 42, action: 'back' };
}

// ============ DAILY ============
function drawDaily() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 26px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('🎁 DAILY REWARD', canvas.width / 2, 55);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Poppins';
    ctx.fillText('Streak: ' + saveData.dailyStreak + ' days', canvas.width / 2, 100);
    const today = new Date().toDateString();
    const canClaim = saveData.lastDailyClaim !== today;
    const rewards = [10, 15, 20, 30, 40, 60, 100];
    rewards.forEach((amt, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = 30 + col * 90;
        const y = 130 + row * 90;
        const claimed = i < saveData.dailyStreak;
        ctx.fillStyle = claimed ? 'rgba(46,204,113,0.3)' : 'rgba(255,215,0,0.15)';
        ctx.beginPath(); ctx.roundRect(x, y, 80, 80, 10); ctx.fill();
        ctx.strokeStyle = claimed ? '#2ecc71' : '#ffd700'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 11px Poppins'; ctx.textAlign = 'center';
        ctx.fillText('Day ' + (i + 1), x + 40, y + 20);
        ctx.fillStyle = '#ffd700'; ctx.font = 'bold 18px Poppins';
        ctx.fillText('🪙', x + 40, y + 45);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Poppins';
        ctx.fillText(amt, x + 40, y + 68);
        if (claimed) {
            ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 24px Poppins';
            ctx.fillText('✓', x + 40, y + 45);
        }
    });
    if (canClaim) {
        drawButton(canvas.width / 2 - 100, canvas.height - 155, 200, 50, '🎁 CLAIM REWARD', '#2ecc71');
        window.claimButton = { x: canvas.width / 2 - 100, y: canvas.height - 155, w: 200, h: 50, action: 'claim_daily' };
    } else {
        ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 16px Poppins';
        ctx.fillText('✓ Already claimed today!', canvas.width / 2, canvas.height - 130);
        window.claimButton = null;
    }
    drawButton(canvas.width / 2 - 70, canvas.height - 65, 140, 45, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 65, w: 140, h: 45, action: 'back' };
}

// ============ EVENT ============
function drawEvent() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 28px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('🎪 WEEKLY EVENT', canvas.width / 2, 60);
    const ev = EVENTS.current;
    ctx.fillStyle = ev.color; ctx.font = 'bold 40px Poppins';
    ctx.fillText(ev.icon, canvas.width / 2, 130);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 24px Poppins';
    ctx.fillText(ev.name, canvas.width / 2, 175);
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '14px Poppins';
    ctx.fillText(ev.desc, canvas.width / 2, 210);
    const pct = saveData.eventClaimed ? 1 : Math.min(runCoins / ev.target, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath(); ctx.roundRect(50, 250, canvas.width - 100, 20, 10); ctx.fill();
    ctx.fillStyle = ev.color;
    if (pct > 0) { ctx.beginPath(); ctx.roundRect(50, 250, Math.max(20, (canvas.width - 100) * pct), 20, 10); ctx.fill(); }
    ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Poppins';
    ctx.fillText((saveData.eventClaimed ? ev.target : runCoins) + ' / ' + ev.target, canvas.width / 2, 295);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 18px Poppins';
    ctx.fillText('Reward: 🪙 ' + ev.reward, canvas.width / 2, 340);
    if (saveData.eventClaimed) {
        ctx.fillStyle = '#2ecc71'; ctx.font = 'bold 16px Poppins';
        ctx.fillText('✓ COMPLETED!', canvas.width / 2, 390);
    } else {
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '12px Poppins';
        ctx.fillText('Complete the challenge in one run!', canvas.width / 2, 390);
    }
    drawButton(canvas.width / 2 - 70, canvas.height - 60, 140, 45, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 60, w: 140, h: 45, action: 'back' };
}

// ============ SETTINGS ============
function drawSettings() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 26px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('⚙️ SETTINGS', canvas.width / 2, 55);
    const items = [
        { label: '🔊 Sound', value: settings.sound, key: 'sound' },
        { label: '✨ Particles', value: settings.particles, key: 'particles' },
        { label: '📳 Screen Shake', value: settings.screenShake, key: 'screenShake' },
        { label: '🎵 Music', value: settings.music, key: 'music' },
        { label: '🌓 Night Theme', value: currentTheme === 'night', key: 'theme' }
    ];
    window.toggleButtons = [];
    items.forEach((item, i) => {
        const y = 80 + i * 62;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.roundRect(40, y, canvas.width - 80, 50, 12); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px Poppins'; ctx.textAlign = 'left';
        ctx.fillText(item.label, 60, y + 32);
        const tx = canvas.width - 130, ty = y + 10;
        ctx.fillStyle = item.value ? '#2ecc71' : '#555';
        ctx.beginPath(); ctx.roundRect(tx, ty, 70, 30, 15); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(tx + (item.value ? 55 : 15), ty + 15, 12, 0, Math.PI * 2); ctx.fill();
        window.toggleButtons.push({ x: 40, y, w: canvas.width - 80, h: 50, action: 'toggle', key: item.key });
    });
    drawButton(canvas.width / 2 - 90, canvas.height - 110, 180, 40, '🗑️ RESET SAVE', '#e74c3c', true);
    window.resetButton = { x: canvas.width / 2 - 90, y: canvas.height - 110, w: 180, h: 40, action: 'reset_save' };
    drawButton(canvas.width / 2 - 70, canvas.height - 60, 140, 45, '← BACK', '#95a5a6', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 60, w: 140, h: 45, action: 'back' };
}

// ============ LEADERBOARD ============
function drawLeaderboard() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 24px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('🏆 LEADERBOARD', canvas.width / 2, 40);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '11px Poppins';
    ctx.fillText(`Best: ${saveData.bestScore} | Games: ${saveData.totalGames} | Coins: ${saveData.totalCoins}`, canvas.width / 2, 65);
    if (saveData.leaderboardNames.length === 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '16px Poppins';
        ctx.fillText('No scores yet!', canvas.width / 2, 300);
    } else {
        const maxRows = Math.max(1, Math.floor((canvas.height - 85 - 70) / 55));
        saveData.leaderboardNames.slice(0, maxRows).forEach((entry, i) => {
            const y = 85 + i * 55;
            const medal = ['🥇', '🥈', '🥉'][i] || (i + 1) + '.';
            ctx.fillStyle = i === 0 ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.08)';
            ctx.beginPath(); ctx.roundRect(30, y, canvas.width - 60, 48, 10); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 20px Poppins'; ctx.textAlign = 'left';
            ctx.fillText(medal, 45, y + 30);
            ctx.font = 'bold 18px Poppins';
            ctx.fillText(entry.score + ' pts', 100, y + 22);
            ctx.font = '10px Poppins'; ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.fillText((DIFFICULTY[entry.difficulty] && DIFFICULTY[entry.difficulty].name) || entry.difficulty, 100, y + 38);
            ctx.textAlign = 'right'; ctx.font = '11px Poppins';
            ctx.fillStyle = 'rgba(255,255,255,0.5)';
            ctx.fillText(entry.date, canvas.width - 45, y + 30);
        });
    }
    drawButton(canvas.width / 2 - 70, canvas.height - 55, 140, 42, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 55, w: 140, h: 42, action: 'back' };
}

// ============ TUTORIAL ============
function drawTutorial() {
    ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 30px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('📖 HOW TO PLAY', canvas.width / 2, 70);
    const tips = [
        { icon: '🐦', text: 'Tap SPACE / click to flap' },
        { icon: '🎯', text: 'Fly through the pipe gaps' },
        { icon: '🪙', text: 'Collect coins' },
        { icon: '⚡', text: 'Grab power-ups' },
        { icon: '🔥', text: 'Build combos for bonus score' },
        { icon: '👹', text: 'Reach 100 to fight the boss!' }
    ];
    tips.forEach((tip, i) => {
        const y = 100 + i * 58;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath(); ctx.roundRect(40, y, canvas.width - 80, 50, 12); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 26px Poppins'; ctx.textAlign = 'left';
        ctx.fillText(tip.icon, 55, y + 35);
        ctx.font = 'bold 15px Poppins';
        ctx.fillText(tip.text, 100, y + 31);
    });
    drawButton(canvas.width / 2 - 90, canvas.height - 125, 180, 48, '▶  START', '#2ecc71');
    window.startButton = { x: canvas.width / 2 - 90, y: canvas.height - 125, w: 180, h: 48, action: 'start_game' };
    drawButton(canvas.width / 2 - 70, canvas.height - 65, 140, 42, '← BACK', '#e74c3c', true);
    window.backButton = { x: canvas.width / 2 - 70, y: canvas.height - 65, w: 140, h: 42, action: 'back' };
}

// ============ PAUSED ============
function drawPaused() {
    ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd700'; ctx.font = 'bold 40px Poppins'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('⏸ PAUSED', canvas.width / 2, 180);
    const level = getCurrentLevel();
    const diff = getDiff();
    ctx.fillStyle = level.color; ctx.font = 'bold 20px Poppins';
    ctx.fillText(`${level.icon} ${level.name}`, canvas.width / 2, 220);
    ctx.fillStyle = diff.color; ctx.font = 'bold 14px Poppins';
    ctx.fillText(`${diff.icon} ${diff.name} • ${GAME_MODES[currentMode].name}`, canvas.width / 2, 245);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 18px Poppins';
    ctx.fillText('Score: ' + score, canvas.width / 2, 285);
    drawButton(canvas.width / 2 - 90, 330, 180, 55, '▶  RESUME', '#2ecc71');
    drawButton(canvas.width / 2 - 90, 400, 180, 55, '🏠 MENU', '#e74c3c');
    window.pauseButtons = [
        { x: canvas.width / 2 - 90, y: 330, w: 180, h: 55, action: 'resume' },
        { x: canvas.width / 2 - 90, y: 400, w: 180, h: 55, action: 'menu' }
    ];
}

// ============ GAME OVER ============
function drawGameOver() {
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ff4757'; ctx.font = 'bold 42px Poppins';
    ctx.fillText('GAME OVER', canvas.width / 2, 100);
    const level = getCurrentLevel();
    const diff = getDiff();
    ctx.fillStyle = diff.color; ctx.font = 'bold 14px Poppins';
    ctx.fillText(`${diff.icon} ${diff.name} • ${GAME_MODES[currentMode].name}`, canvas.width / 2, 130);
    ctx.fillStyle = level.color; ctx.font = 'bold 18px Poppins';
    ctx.fillText(`${level.icon} Reached: ${level.name}`, canvas.width / 2, 160);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 36px Poppins';
    ctx.fillText('Score: ' + score, canvas.width / 2, 210);
    if (score >= saveData.bestScore && score > 0) {
        ctx.fillStyle = '#ffd700'; ctx.font = 'bold 18px Poppins';
        ctx.fillText('🎉 NEW HIGH SCORE!', canvas.width / 2, 250);
    } else {
        ctx.fillStyle = '#ffd700'; ctx.font = 'bold 16px Poppins';
        ctx.fillText('🏆 Best: ' + saveData.bestScore, canvas.width / 2, 250);
    }
    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = 'bold 13px Poppins';
    ctx.fillText(`🪙 +${runCoins} coins • ⚡ ${runPowerups} power-ups`, canvas.width / 2, 285);
    if (currentComboMax >= 3) {
        ctx.fillStyle = '#ff6b6b'; ctx.font = 'bold 12px Poppins';
        ctx.fillText(`🔥 Best Combo: x${currentComboMax}`, canvas.width / 2, 305);
    }
    drawButton(canvas.width / 2 - 90, 335, 180, 50, '🔄 RETRY', '#2ecc71');
    drawButton(canvas.width / 2 - 90, 395, 180, 50, '🏠 MENU', '#3498db');
    drawButton(canvas.width / 2 - 90, 455, 180, 50, '⚡ DIFFICULTY', '#e74c3c');
    window.gameOverButtons = [
        { x: canvas.width / 2 - 90, y: 335, w: 180, h: 50, action: 'restart' },
        { x: canvas.width / 2 - 90, y: 395, w: 180, h: 50, action: 'menu' },
        { x: canvas.width / 2 - 90, y: 455, w: 180, h: 50, action: 'difficulty' }
    ];
}

// ============ CLICK HANDLER ============
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    let buttons = [];
    if (currentState === STATE.MENU) buttons = window.menuButtons || [];
    else if (currentState === STATE.DIFFICULTY_SELECT) buttons = [...(window.diffButtons || []), window.backButton];
    else if (currentState === STATE.MODE_SELECT) buttons = [...(window.modeButtons || []), window.backButton];
    else if (currentState === STATE.SETTINGS) buttons = [...(window.toggleButtons || []), window.resetButton, window.backButton];
    else if (currentState === STATE.LEADERBOARD) buttons = [window.backButton];
    else if (currentState === STATE.PAUSED) buttons = window.pauseButtons || [];
    else if (currentState === STATE.GAME_OVER) buttons = window.gameOverButtons || [];
    else if (currentState === STATE.SKINS) buttons = [...(window.skinButtons || []), window.backButton];
    else if (currentState === STATE.SHOP) buttons = [...(window.shopButtons || []), window.backButton];
    else if (currentState === STATE.TRAILS) buttons = [...(window.trailButtons || []), window.backButton];
    else if (currentState === STATE.ACHIEVEMENTS || currentState === STATE.MISSIONS || currentState === STATE.EVENT) buttons = [window.backButton];
    else if (currentState === STATE.DAILY) buttons = [window.claimButton, window.backButton];
    else if (currentState === STATE.TUTORIAL) buttons = [window.startButton, window.backButton];
    else return;

    for (const btn of buttons) {
        if (btn && x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
            handleButton(btn); return;
        }
    }
});

function handleButton(btn) {
    sfxClick();
    switch (btn.action) {
        case 'play':
            if (!saveData.tutorialDone && saveData.totalGames < 1) currentState = STATE.TUTORIAL;
            else startGame();
            break;
        case 'start_game': saveData.tutorialDone = true; writeSave(); startGame(); break;
        case 'tutorial': currentState = STATE.TUTORIAL; break;
        case 'modes': currentState = STATE.MODE_SELECT; break;
        case 'mode': currentMode = btn.key; break;
        case 'difficulty': currentState = STATE.DIFFICULTY_SELECT; break;
        case 'diff': currentDifficulty = btn.key; break;
        case 'skins': currentState = STATE.SKINS; break;
        case 'skin':
            if (saveData.unlockedSkins.includes(btn.skin.id)) {
                saveData.currentSkin = btn.skin.id; writeSave();
            } else { addFloatingText(canvas.width / 2, canvas.height - 100, 'Locked! Buy in Shop', '#e74c3c'); }
            break;
        case 'trails': currentState = STATE.TRAILS; break;
        case 'trail':
            if (saveData.unlockedTrails.includes(btn.trail.id)) {
                saveData.currentTrail = btn.trail.id; writeSave();
            } else if (saveData.coins >= btn.trail.price) {
                saveData.coins -= btn.trail.price;
                saveData.unlockedTrails.push(btn.trail.id);
                saveData.currentTrail = btn.trail.id;
                writeSave();
                addFloatingText(canvas.width / 2, canvas.height / 2, 'TRAIL UNLOCKED!', '#00bcd4', 24);
            } else {
                addFloatingText(canvas.width / 2, canvas.height - 100, 'Not enough coins!', '#e74c3c');
            }
            break;
        case 'shop': currentState = STATE.SHOP; break;
        case 'buy':
            if (btn.canAfford && !saveData.unlockedSkins.includes(btn.skin.id)) {
                saveData.coins -= btn.skin.price;
                saveData.unlockedSkins.push(btn.skin.id);
                saveData.currentSkin = btn.skin.id;
                writeSave();
                addFloatingText(canvas.width / 2, canvas.height / 2, 'UNLOCKED!', '#2ecc71', 28);
            }
            break;
        case 'achievements': currentState = STATE.ACHIEVEMENTS; break;
        case 'missions': currentState = STATE.MISSIONS; break;
        case 'daily': currentState = STATE.DAILY; break;
        case 'event': currentState = STATE.EVENT; break;
        case 'stats':
        case 'leaderboard': currentState = STATE.LEADERBOARD; break;
        case 'claim_daily': {
            const today = new Date().toDateString();
            if (saveData.lastDailyClaim !== today) {
                const rewards = [10, 15, 20, 30, 40, 60, 100];
                const amt = rewards[Math.min(saveData.dailyStreak, 6)];
                saveData.coins += amt;
                saveData.dailyStreak = Math.min(saveData.dailyStreak + 1, 7);
                saveData.lastDailyClaim = today;
                writeSave();
                sfxAchievement();
                addFloatingText(canvas.width / 2, canvas.height / 2, '+' + amt + ' coins!', '#ffd700', 28);
            }
            break;
        }
        case 'settings': currentState = STATE.SETTINGS; break;
        case 'toggle':
            if (btn.key === 'theme') {
                currentTheme = currentTheme === 'day' ? 'night' : 'day';
                document.body.classList.toggle('night', currentTheme === 'night');
            } else if (btn.key === 'music') {
                settings.music = !settings.music;
                if (!settings.music) stopMusic();
            } else {
                settings[btn.key] = !settings[btn.key];
            }
            break;
        case 'reset_save':
            if (confirm('Reset ALL progress? Cannot be undone!')) {
                localStorage.removeItem('flappyUltimateSave');
                location.reload();
            }
            break;
        case 'back': currentState = STATE.MENU; break;
        case 'resume': currentState = STATE.PLAYING; break;
        case 'menu': currentState = STATE.MENU; resetGame(); stopMusic(); break;
        case 'restart': startGame(); break;
    }
}

// ============ MAIN LOOP ============
let lastTs = 0, acc = 0;
const FRAME_INTERVAL = 1000 / 60;
let fpsFrameCount = 0;
let fpsStartTime = 0;

function gameLoop(ts = 0) {
    requestAnimationFrame(gameLoop);

    acc += Math.min(ts - lastTs, 100);
    lastTs = ts;
    if (acc < FRAME_INTERVAL - 0.5) return;
    acc = Math.min(acc - FRAME_INTERVAL, FRAME_INTERVAL);

    fpsFrameCount++;
    if (ts - fpsStartTime >= 1000) {
        fpsDisplay = fpsFrameCount;
        fpsFrameCount = 0;
        fpsStartTime = ts;
    }

    ctx.save();
    if (screenShake > 0 && settings.screenShake) {
        ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
        screenShake *= 0.9;
        if (screenShake < 0.5) screenShake = 0;
    }
    drawBackground();

    switch (currentState) {
        case STATE.MENU: frameCount++; drawMenu(); break;
        case STATE.DIFFICULTY_SELECT: drawDifficultySelect(); break;
        case STATE.MODE_SELECT: drawModes(); break;
        case STATE.SETTINGS: drawSettings(); break;
        case STATE.LEADERBOARD: drawLeaderboard(); break;
        case STATE.SKINS: drawSkins(); break;
        case STATE.TRAILS: drawTrails(); break;
        case STATE.SHOP: drawShop(); break;
        case STATE.ACHIEVEMENTS: drawAchievements(); break;
        case STATE.MISSIONS: drawMissions(); break;
        case STATE.DAILY: drawDaily(); break;
        case STATE.EVENT: drawEvent(); break;
        case STATE.TUTORIAL: drawTutorial(); break;
        case STATE.PLAYING:
            update();
            drawPipes();
            drawCoins();
            drawPowerupItems();
            drawBoss();
            drawAimAssist();
            drawTrail();
            drawParticles();
            drawFloatingTexts();
            drawBird();
            drawHUD();
            drawLevelUpAnimation();
            drawAchievementPopup();
            break;
        case STATE.GAME_OVER:
            drawPipes();
            drawCoins();
            drawPowerupItems();
            drawBoss();
            drawParticles();
            drawFloatingTexts();
            drawBird();
            drawGameOver();
            drawAchievementPopup();
            break;
        case STATE.PAUSED:
            drawPipes();
            drawCoins();
            drawBird();
            drawPaused();
            break;
    }

    
    if (currentState !== STATE.PLAYING) {
        updateParticles();
        updateFloatingTexts();
        if (currentState !== STATE.GAME_OVER) drawFloatingTexts();
    }
    ctx.restore();
}

// ============ START ============
setTimeout(() => {
    const l = document.getElementById('loading');
    if (l) l.classList.add('hide');
}, 2000);
gameLoop();

})();