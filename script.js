/* ========================================================
   LADY ARTIKA - SPECIAL BIRTHDAY INTERACTIVE SCRIPT
   - Native Apple/iOS Emoji Engine
   - Clean, Safe DOM Manipulation (No Raw String Escapes)
   - Music Box Audio Engine
   ======================================================== */

const APPLE_EMOJI_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/emoji-datasource-apple/15.0.1/img/apple/64/';

// --- 1. Music Box Audio Engine (Gentle & Sweet Chime) ---
class MusicBox {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timeoutId = null;
    this.stepIndex = 0;

    const notes = {
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
      G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
      G5: 783.99, A5: 880.00
    };

    this.score = [
      ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
      ['C4', 0.75], ['C4', 0.25], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
      ['C4', 0.75], ['C4', 0.25], ['C5', 1], ['A4', 1], ['F4', 1], ['E4', 1], ['D4', 2],
      ['Bb4', 0.75], ['Bb4', 0.25], ['A4', 1], ['F4', 1], ['G4', 1], ['F4', 2.5],
      [null, 1.5]
    ];
    this.noteMap = notes;
    this.tempo = 380;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq, durationSec) {
    if (!this.ctx || !freq) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();

    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 1.4);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.05, now + 0.015);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + durationSec * 0.8);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(this.ctx.destination);
    gain2.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);

    osc.stop(now + durationSec * 1.5);
    osc2.stop(now + durationSec * 1.5);
  }

  start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.stepIndex = 0;
    this.scheduleNext();
  }

  scheduleNext() {
    if (!this.isPlaying) return;

    const [noteName, beats] = this.score[this.stepIndex];
    const duration = beats * (this.tempo / 1000);

    if (noteName && this.noteMap[noteName]) {
      this.playNote(this.noteMap[noteName], duration);
    }

    this.stepIndex = (this.stepIndex + 1) % this.score.length;
    this.timeoutId = setTimeout(() => {
      this.scheduleNext();
    }, beats * this.tempo);
  }

  stop() {
    this.isPlaying = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

const musicBox = new MusicBox();

// --- 2. Floating Apple Emojis in Background ---
function initFloatingParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const particleIcons = [
    '1f496', // 💖
    '1f338', // 🌸
    '2728',   // ✨
    '1f495', // 💕
    '1f380', // 🎀
    '1f337', // 🌷
    '1f9c1', // 🧁
    '2b50'    // ⭐
  ];
  const maxParticles = 20;

  function createParticle() {
    if (container.childElementCount >= maxParticles) return;

    const particle = document.createElement('div');
    particle.className = 'floating-heart';

    const code = particleIcons[Math.floor(Math.random() * particleIcons.length)];
    
    const img = document.createElement('img');
    img.src = `${APPLE_EMOJI_BASE}${code}.png`;
    img.alt = 'sparkle';
    particle.appendChild(img);
    
    const size = Math.random() * 16 + 18; // 18px - 34px
    const startLeft = Math.random() * 100;
    const duration = Math.random() * 8 + 9;
    const delay = Math.random() * 2;

    particle.style.left = `${startLeft}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode === container) {
        container.removeChild(particle);
      }
    }, (duration + delay) * 1000);
  }

  for (let i = 0; i < 12; i++) {
    createParticle();
  }

  setInterval(createParticle, 900);
}

// --- 3. Tap / Click Apple Emoji Sparkles Everywhere ---
function initClickSparkles() {
  const clickIcons = ['1f496', '1f495', '2728', '1f338', '2764-fe0f'];

  window.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;

    const code = clickIcons[Math.floor(Math.random() * clickIcons.length)];

    const img = document.createElement('img');
    img.src = `${APPLE_EMOJI_BASE}${code}.png`;
    img.className = 'apple-emoji';
    img.style.position = 'fixed';
    img.style.left = `${e.clientX}px`;
    img.style.top = `${e.clientY}px`;
    img.style.width = '26px';
    img.style.height = '26px';
    img.style.pointerEvents = 'none';
    img.style.zIndex = '9999';
    img.style.transform = 'translate(-50%, -50%) scale(0.6)';
    img.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    img.style.opacity = '1';

    document.body.appendChild(img);

    requestAnimationFrame(() => {
      img.style.transform = `translate(-50%, -75px) scale(1.3) rotate(${Math.random() * 40 - 20}deg)`;
      img.style.opacity = '0';
    });

    setTimeout(() => {
      if (img.parentNode) img.parentNode.removeChild(img);
    }, 850);
  });
}

// --- 4. Confetti Launcher ---
function launchConfetti(type = 'stars') {
  if (typeof confetti !== 'function') return;

  if (type === 'stars') {
    confetti({
      particleCount: 55,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#ff4071', '#ff85a2', '#ffd1dc', '#f7b731', '#ffffff']
    });
  } else if (type === 'fireworks') {
    const end = Date.now() + 2 * 1000;
    const colors = ['#ff3366', '#ff85a2', '#ffffff', '#ffb703'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

// --- 5. Envelope Opening Flow ---
function setupEnvelope() {
  const openBtn = document.getElementById('openBtn');
  const envelope = document.getElementById('envelope');
  const overlay = document.getElementById('openingOverlay');

  if (!openBtn || !envelope || !overlay) return;

  function triggerOpen() {
    envelope.classList.add('open');

    musicBox.start();
    updateAudioBtnUI(true);

    launchConfetti('fireworks');

    setTimeout(() => {
      overlay.classList.add('hidden');
      launchConfetti('stars');
    }, 1100);
  }

  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerOpen();
  });

  envelope.addEventListener('click', triggerOpen);
}

// --- 6. Audio Control Button UI ---
function setupAudioButton() {
  const audioBtn = document.getElementById('audioToggleBtn');
  if (!audioBtn) return;

  audioBtn.addEventListener('click', () => {
    const isPlaying = musicBox.toggle();
    updateAudioBtnUI(isPlaying);
  });
}

function updateAudioBtnUI(isPlaying) {
  const audioBtn = document.getElementById('audioToggleBtn');
  const statusText = document.getElementById('audioStatusText');
  const musicIcon = document.getElementById('musicIcon');
  if (!audioBtn) return;

  if (isPlaying) {
    audioBtn.classList.remove('paused');
    statusText.textContent = 'Lagu: On';
    musicIcon.innerHTML = `<img class="apple-emoji" src="${APPLE_EMOJI_BASE}1f3b5.png" alt="🎵">`;
  } else {
    audioBtn.classList.add('paused');
    statusText.textContent = 'Lagu: Off';
    musicIcon.innerHTML = `<img class="apple-emoji" src="${APPLE_EMOJI_BASE}1f507.png" alt="🔇">`;
  }
}

// --- 7. Interactive Birthday Cake & Flame Blowing ---
function setupBirthdayCake() {
  const candle = document.getElementById('candle');
  const blowBtn = document.getElementById('blowBtn');
  const blowBtnText = document.getElementById('blowBtnText');
  const blowBtnIcon = document.getElementById('blowBtnIcon');
  const wishRevealBox = document.getElementById('wishRevealBox');

  if (!candle || !blowBtn) return;

  let isBlown = false;

  function blowCandle() {
    if (!isBlown) {
      candle.classList.add('blown');
      isBlown = true;
      blowBtnText.textContent = 'Nyalakan Lilin Lagi';
      blowBtnIcon.innerHTML = `<img class="apple-emoji" src="${APPLE_EMOJI_BASE}1f525.png" alt="🔥">`;
      wishRevealBox.classList.add('active');

      launchConfetti('fireworks');

      if (musicBox.ctx) {
        musicBox.playNote(523.25, 0.4);
        setTimeout(() => musicBox.playNote(659.25, 0.4), 150);
        setTimeout(() => musicBox.playNote(783.99, 0.6), 300);
        setTimeout(() => musicBox.playNote(1046.50, 0.9), 450);
      }
    } else {
      candle.classList.remove('blown');
      isBlown = false;
      blowBtnText.textContent = 'Tiup Lilin Sekarang';
      blowBtnIcon.innerHTML = `<img class="apple-emoji" src="${APPLE_EMOJI_BASE}1f4a8.png" alt="💨">`;
      wishRevealBox.classList.remove('active');
    }
  }

  blowBtn.addEventListener('click', blowCandle);
  candle.addEventListener('click', blowCandle);
}

// --- 8. Polaroid Heart Reaction ---
window.triggerLoveReaction = function(btn) {
  btn.classList.add('loved');

  const rect = btn.getBoundingClientRect();
  for (let i = 0; i < 4; i++) {
    const mini = document.createElement('img');
    mini.src = `${APPLE_EMOJI_BASE}2764-fe0f.png`;
    mini.className = 'apple-emoji';
    mini.style.position = 'fixed';
    mini.style.left = `${rect.left + rect.width / 2}px`;
    mini.style.top = `${rect.top}px`;
    mini.style.width = '22px';
    mini.style.height = '22px';
    mini.style.pointerEvents = 'none';
    mini.style.zIndex = '9999';
    mini.style.transition = 'all 0.65s cubic-bezier(0.1, 0.8, 0.2, 1)';
    document.body.appendChild(mini);

    const xShift = (Math.random() - 0.5) * 60;
    const yShift = -50 - Math.random() * 40;

    requestAnimationFrame(() => {
      mini.style.transform = `translate(${xShift}px, ${yShift}px) scale(1.4)`;
      mini.style.opacity = '0';
    });

    setTimeout(() => {
      if (mini.parentNode) mini.parentNode.removeChild(mini);
    }, 700);
  }
};

// --- 9. Modal for Special Message Capsules ---
window.openCapsuleByData = function(card) {
  const modal = document.getElementById('capsuleModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalIcon = document.getElementById('modalIcon');

  if (!modal) return;

  const title = card.getAttribute('data-title') || 'Pesan Spesial';
  const text = card.getAttribute('data-text') || '';
  const iconCode = card.getAttribute('data-icon') || '1f48c';

  if (modalIcon) {
    modalIcon.innerHTML = `<img class="apple-emoji" src="${APPLE_EMOJI_BASE}${iconCode}.png" alt="icon">`;
  }

  if (modalTitle) modalTitle.textContent = title;
  if (modalText) modalText.textContent = text;

  modal.classList.add('active');
  launchConfetti('stars');
};

window.closeCapsuleModal = function() {
  const modal = document.getElementById('capsuleModal');
  if (modal) modal.classList.remove('active');
};

function setupCapsuleModalClose() {
  const modal = document.getElementById('capsuleModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeCapsuleModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        window.closeCapsuleModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeCapsuleModal();
    }
  });
}

// --- 10. Virtual Hug & Love Generator Counter ---
function setupLoveCounter() {
  const hugBtn = document.getElementById('sendHugBtn');
  const loveCountElem = document.getElementById('loveCount');
  const milestoneElem = document.getElementById('milestoneText');

  if (!hugBtn || !loveCountElem) return;

  let count = 0;

  const milestoneData = {
    1: { text: '1 pelukan nyampe ke kamu! gemes bgt', icon: '1f917' },
    5: { text: '5 pelukan! angetnya kerasa ga nih? hehe', icon: '1f495' },
    10: { text: '10 pelukan! pokoknya gaboleh sedih-sedih yaa', icon: '1f970' },
    25: { text: '25 pelukan! sayang bangeet sama pacar aku yang satu ini', icon: '1f496' },
    50: { text: '50 pelukan! peluk erat gamau lepas', icon: '1f338' },
    100: { text: '100 PELUKAN!! cintaku ke kamu tumpah-tumpah parah wkwk', icon: '1f48d' }
  };

  hugBtn.addEventListener('click', (e) => {
    count++;
    loveCountElem.textContent = count;

    loveCountElem.style.transform = 'scale(1.25)';
    setTimeout(() => {
      loveCountElem.style.transform = 'scale(1)';
    }, 150);

    if (milestoneData[count]) {
      const item = milestoneData[count];
      milestoneElem.innerHTML = `${item.text} <img class="apple-emoji" src="${APPLE_EMOJI_BASE}${item.icon}.png" alt="love">`;
      launchConfetti('stars');
    } else if (count > 100 && count % 25 === 0) {
      milestoneElem.innerHTML = `${count} Pelukan Cinta! Sayang bangettt sama Lady Artika! <img class="apple-emoji" src="${APPLE_EMOJI_BASE}1f496.png" alt="love">`;
      launchConfetti('stars');
    }

    // Flying Apple emojis from button
    const burstIcons = ['1f917', '1f496', '1f495', '1f970', '1f338'];
    for (let i = 0; i < 5; i++) {
      const code = burstIcons[Math.floor(Math.random() * burstIcons.length)];

      const img = document.createElement('img');
      img.src = `${APPLE_EMOJI_BASE}${code}.png`;
      img.className = 'apple-emoji';
      img.style.position = 'fixed';
      img.style.left = `${e.clientX || (window.innerWidth / 2)}px`;
      img.style.top = `${e.clientY || (window.innerHeight / 2)}px`;
      img.style.width = `${Math.random() * 12 + 22}px`;
      img.style.height = img.style.width;
      img.style.pointerEvents = 'none';
      img.style.zIndex = '9999';
      img.style.transition = 'all 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)';
      document.body.appendChild(img);

      const x = (Math.random() - 0.5) * 140;
      const y = -80 - Math.random() * 90;

      requestAnimationFrame(() => {
        img.style.transform = `translate(${x}px, ${y}px) scale(1.4) rotate(${Math.random() * 60 - 30}deg)`;
        img.style.opacity = '0';
      });

      setTimeout(() => {
        if (img.parentNode) img.parentNode.removeChild(img);
      }, 950);
    }
  });
}

// --- Initialization on DOM Loaded ---
document.addEventListener('DOMContentLoaded', () => {
  initFloatingParticles();
  initClickSparkles();
  setupEnvelope();
  setupAudioButton();
  setupBirthdayCake();
  setupCapsuleModalClose();
  setupLoveCounter();
});
