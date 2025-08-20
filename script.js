// ===== Theme toggle =====
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const saved = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'dark'); // default dark
if (saved === 'light') {
    document.documentElement.style.setProperty('--bg', '#ffffff');
    document.documentElement.style.setProperty('--bg-soft', '#f6f7fb');
    document.documentElement.style.setProperty('--text', '#0b0c10');
    document.documentElement.style.setProperty('--muted', '#444');
    document.body.classList.add('light');
}
themeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    if (isLight) {
        document.documentElement.style.setProperty('--bg', '#ffffff');
        document.documentElement.style.setProperty('--bg-soft', '#f6f7fb');
        document.documentElement.style.setProperty('--text', '#0b0c10');
        document.documentElement.style.setProperty('--muted', '#444');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.style.setProperty('--bg', '#0b0c10');
        document.documentElement.style.setProperty('--bg-soft', '#101218');
        document.documentElement.style.setProperty('--text', '#e6e6e6');
        document.documentElement.style.setProperty('--muted', '#a7a7a7');
        localStorage.setItem('theme', 'dark');
    }
});

// ===== Mobile nav =====
const toggleBtn = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
toggleBtn?.addEventListener('click', () => navMenu.classList.toggle('show'));
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) navMenu.classList.remove('show');
});

// ===== Playlist Player =====
const audio = document.getElementById('audio');
const playPause = document.getElementById('playPause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const seek = document.getElementById('seek');
const volume = document.getElementById('volume');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const trackTitle = document.getElementById('trackTitle');

// tạo playlist theo mẫu music1.mp3, music2.mp3, ...
const TOTAL_TRACKS = 3; // <-- đổi theo số file bạn có
const playlist = [];
for (let i = 1; i <= TOTAL_TRACKS; i++) {
    playlist.push({ key: `music${i}`, title: `music${i}`, src: `assets/audio/music${i}.mp3` });
}
let current = 0;

function fmt(t) {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60), s = Math.floor(t % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function loadTrack(idx, autoplay = false) {
    current = (idx + playlist.length) % playlist.length;
    const t = playlist[current];
    audio.src = t.src;
    trackTitle.textContent = t.title;
    audio.load();
    if (autoplay) audio.play().then(() => playPause.textContent = '⏸').catch(() => { });
    syncDropdownActive(); // đồng bộ dropdown
}

function playToggle() {
    if (audio.paused) { audio.play(); playPause.textContent = '⏸'; }
    else { audio.pause(); playPause.textContent = '▶'; }
}

playPause.addEventListener('click', playToggle);
prevBtn.addEventListener('click', () => loadTrack(current - 1, true));
nextBtn.addEventListener('click', () => loadTrack(current + 1, true));

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = fmt(audio.duration);
});
audio.addEventListener('timeupdate', () => {
    seek.value = (audio.currentTime / audio.duration) * 100 || 0;
    currentTimeEl.textContent = fmt(audio.currentTime);
});
audio.addEventListener('ended', () => nextBtn.click());
seek.addEventListener('input', () => {
    audio.currentTime = (seek.value / 100) * (audio.duration || 0);
});
volume.addEventListener('input', () => { audio.volume = Number(volume.value); });
document.addEventListener('visibilitychange', () => {
    if (document.hidden && !audio.paused) { audio.pause(); playPause.textContent = '▶'; }
});

// === Custom dropdown ===
const ddToggle = document.getElementById('ddToggle');
const ddMenu = document.getElementById('ddMenu');
const ddLabel = document.getElementById('ddLabel');

function buildDropdown() {
    ddMenu.innerHTML = '';
    playlist.forEach((t, idx) => {
        const btn = document.createElement('button');
        btn.className = 'dd-item';
        btn.textContent = t.title;
        btn.addEventListener('click', () => {
            loadTrack(idx, true);
            ddMenu.classList.remove('open');
        });
        ddMenu.appendChild(btn);
    });
}
function syncDropdownActive() {
    ddLabel.textContent = playlist[current]?.title ?? 'Chọn bài';
    [...ddMenu.querySelectorAll('.dd-item')].forEach((el, i) => {
        el.classList.toggle('active', i === current);
    });
}
ddToggle.addEventListener('click', (e) => { e.stopPropagation(); ddMenu.classList.toggle('open'); });
document.addEventListener('click', () => ddMenu.classList.remove('open'));

// init
if (playlist.length) { buildDropdown(); loadTrack(0, false); } else { trackTitle.textContent = 'Chưa có bài hát'; }

// ===== Slide-over About panel =====
const aboutLink = document.querySelector('a[href="about.html"]'); // link "Giới thiệu" trên navbar
const panel = document.getElementById('aboutPanel');
const panelClose = document.getElementById('panelClose');
const panelContent = document.getElementById('panelContent');

function openPanel() { panel.classList.add('open'); }
function closePanel() { panel.classList.remove('open'); }

aboutLink?.addEventListener('click', async (e) => {
    // mở panel thay vì chuyển trang
    e.preventDefault();
    openPanel();
    panelContent.innerHTML = 'Đang tải…';
    try {
        const res = await fetch('about.html');
        const html = await res.text();
        // Tách phần <main> của about.html để nhúng cho sạch
        const tmp = document.createElement('div'); tmp.innerHTML = html;
        const main = tmp.querySelector('main');
        panelContent.innerHTML = main ? main.innerHTML : html;
    } catch (err) {
        panelContent.innerHTML = '<p>Lỗi tải nội dung.</p>';
    }
});

panelClose?.addEventListener('click', closePanel);
panel?.addEventListener('click', (e) => {
    if (e.target === panel) closePanel(); // click nền đen để đóng
});


// ===== Scroll reveal =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Back to top =====
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 280) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();
