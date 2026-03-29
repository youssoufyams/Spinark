lucide.createIcons({
    attrs: {
        'stroke-width': 1.5,
        'width': 20,
        'height': 20
    }
});

// --- VARIABLES GLOBALES ---
const playerModal = document.getElementById('modal-video');
const video = document.getElementById('video-element');
const controlsOverlay = document.getElementById('controls-overlay');
const progressBarMini = document.getElementById('progress-bar-mini');
const currentTimeMini = document.getElementById('current-time-mini');
const speedTxt = document.getElementById('speed-txt');

let isPlaying = false;
let isLocked = false;
let timeout;
let currentSpeed = 1;

// --- OUVERTURE / FERMETURE ---
function openPlayer() {
    playerModal.style.display = 'flex';
    video.pause();
    const startBtn = document.getElementById('start-play-btn');
    if(startBtn) startBtn.style.display = 'flex';
    lucide.createIcons();
}

function closePlayer() {
    playerModal.style.display = 'none';
    video.pause();
    isPlaying = false;
    // On réinitialise le verrou au cas où
    isLocked = false;
}

// --- LOGIQUE DE LECTURE ---
function startMovie() {
    const statusTag = document.querySelector('.status-live');
    video.play();
    isPlaying = true;
    
    if(statusTag) {
        statusTag.innerText = "● Lecture en cours";
        statusTag.style.color = "#2ecc71";
    }

    const startBtn = document.getElementById('start-play-btn');
    if(startBtn) startBtn.style.display = 'none';
    
    // Zone de touche interactive
    video.onclick = function() { togglePlay(); };
    showControls();
}

function togglePlay() {
    if (isLocked) return; // BLOQUÉ SI CADENAS ACTIVÉ

    const statusTag = document.querySelector('.status-live');
    if (video.paused) {
        video.play();
        isPlaying = true;
        if(statusTag) {
            statusTag.innerText = "● Lecture en cours";
            statusTag.style.color = "#2ecc71";
        }
        hideControlsDelayed();
    } else {
        video.pause();
        isPlaying = false;
        if(statusTag) {
            statusTag.innerText = "● En pause";
            statusTag.style.color = "#ffa500";
        }
        showControls();
    }
}

// --- OPTIONS TACTIQUES (VITESSE & VERROU) ---
function changeSpeed() {
    if (isLocked) return;
    
    if (currentSpeed === 1) currentSpeed = 1.5;
    else if (currentSpeed === 1.5) currentSpeed = 2;
    else currentSpeed = 1;

    video.playbackRate = currentSpeed;
    speedTxt.innerText = currentSpeed + "x";
}

function toggleLock() {
    isLocked = !isLocked;
    const lockIcon = document.getElementById('lock-icon');
    
    if (isLocked) {
        lockIcon.setAttribute('data-lucide', 'lock');
        // On cache les autres contrôles pour simuler le verrouillage
        document.querySelector('.top-controls-row').style.opacity = "0.5";
        document.querySelector('.bottom-controls-area').style.opacity = "0.5";
    } else {
        lockIcon.setAttribute('data-lucide', 'unlock');
        document.querySelector('.top-controls-row').style.opacity = "1";
        document.querySelector('.bottom-controls-area').style.opacity = "1";
    }
    lucide.createIcons();
}

// --- AFFICHAGE DES CONTROLES ---
function showControls() {
    controlsOverlay.classList.remove('hide');
    clearTimeout(timeout);
    if (isPlaying && !isLocked) hideControlsDelayed();
}

function hideControlsDelayed() {
    timeout = setTimeout(() => {
        if (isPlaying) controlsOverlay.classList.add('hide');
    }, 3000);
}

// --- MISE À JOUR BARRE DE PROGRESSION ---
video.addEventListener('timeupdate', () => {
    const percent = (video.currentTime / video.duration) * 100;
    if(progressBarMini) progressBarMini.style.width = percent + '%';
    if(currentTimeMini) currentTimeMini.innerText = formatTime(video.currentTime);
});

function formatTime(s) {
    let m = Math.floor(s / 60);
    let sec = Math.floor(s % 60);
    return (m < 10 ? "0" + m : m) + ":" + (sec < 10 ? "0" + sec : sec);
}

// --- MODE PLEIN ÉCRAN (ROTATION) ---
function toggleFullScreenMode() {
    console.log("Tentative de passage en plein écran...");
    const container = document.querySelector('.video-container-immersion');

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen().catch(err => {
                alert(`Erreur Fullscreen: ${err.message}`);
            });
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen(); 
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}


function startTracking() { console.log("Tracking de lecture Spinark activé..."); }
