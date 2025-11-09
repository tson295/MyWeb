// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const savedTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "dark");

if (savedTheme === "light") {
    document.documentElement.style.setProperty("--bg", "#ffffff");
    document.documentElement.style.setProperty("--bg-soft", "#f6f7fb");
    document.documentElement.style.setProperty("--text", "#0b0c10");
    document.documentElement.style.setProperty("--muted", "#444444");
    document.body.classList.add("light");
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isLight = document.body.classList.toggle("light");
        if (isLight) {
            document.documentElement.style.setProperty("--bg", "#ffffff");
            document.documentElement.style.setProperty("--bg-soft", "#f6f7fb");
            document.documentElement.style.setProperty("--text", "#0b0c10");
            document.documentElement.style.setProperty("--muted", "#444444");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.style.setProperty("--bg", "#0b0c10");
            document.documentElement.style.setProperty("--bg-soft", "#101218");
            document.documentElement.style.setProperty("--text", "#e6e6e6");
            document.documentElement.style.setProperty("--muted", "#a7a7a7");
            localStorage.setItem("theme", "dark");
        }
    });
}

// MOBILE NAV
const toggleBtn = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
            navMenu.classList.remove("show");
        }
    });
}

// MUSIC PLAYER (only if all elements exist)
const audio = document.getElementById("audio");
const playPause = document.getElementById("playPause");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const seek = document.getElementById("seek");
const volume = document.getElementById("volume");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const trackTitle = document.getElementById("trackTitle");
const ddToggle = document.getElementById("ddToggle");
const ddMenu = document.getElementById("ddMenu");
const ddLabel = document.getElementById("ddLabel");

if (
    audio && playPause && prevBtn && nextBtn &&
    seek && volume && currentTimeEl && durationEl &&
    trackTitle && ddToggle && ddMenu && ddLabel
) {
    // ===== Playlist: Tên bài hát =====
    const playlist = [
        { title: "Tệ thật, anh nhớ em", src: "assets/audio/music1.mp3" },
        { title: "Anh khác hay em khác", src: "assets/audio/music8.mp3" },
        { title: "Perfect - One Direction", src: "assets/audio/music2.mp3" },
        { title: "[MV] K.will(케이윌) - Talk Love", src: "assets/audio/music3.mp3" },
        { title: "Vicetone - Walk Thru Fire (Lyrics) ft. Meron Ryan", src: "assets/audio/music4.mp3" },
        { title: "Taylor Swift - Enchanted", src: "assets/audio/music5.mp3" },
        { title: "Falling you - Lighter and princess", src: "assets/audio/music6.mp3" },
        { title: "[Mashup][AMV] Nhịp Yêu Thương", src: "assets/audio/music7.mp3" },






        // Thêm nhạc ở đây
    ];

    let current = 0;

    function fmtTime(t) {
        if (!isFinite(t)) return "0:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, "0");
        return m + ":" + s;
    }

    // Set tên bài + bật marquee nếu dài
    function setTrackTitle(text) {
        trackTitle.innerHTML = ""; // clear
        const span = document.createElement("span");
        span.className = "track-title-inner";
        span.textContent = text;
        trackTitle.appendChild(span);

        // check overflow -> nếu dài hơn khung thì cho chạy
        requestAnimationFrame(() => {
            if (span.scrollWidth > trackTitle.clientWidth) {
                span.classList.add("marquee");
            } else {
                span.classList.remove("marquee");
            }
        });
    }

    function buildDropdown() {
        ddMenu.innerHTML = "";
        playlist.forEach((track, idx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "dd-item";
            btn.textContent = track.title;
            btn.addEventListener("click", () => {
                loadTrack(idx, true);
                ddMenu.classList.remove("open");
            });
            ddMenu.appendChild(btn);
        });
    }

    function syncDropdown() {
        const t = playlist[current];
        ddLabel.textContent = t ? t.title : "Chon bai";
        ddMenu.querySelectorAll(".dd-item").forEach((el, i) => {
            el.classList.toggle("active", i === current);
        });
    }

    function loadTrack(idx, autoplay) {
        if (!playlist.length) return;
        current = (idx + playlist.length) % playlist.length;
        const track = playlist[current];
        audio.src = track.src;
        setTrackTitle(track.title);
        audio.load();

        if (autoplay) {
            audio.play().then(() => {
                playPause.textContent = "⏸";
            }).catch(() => { });
        } else {
            playPause.textContent = "▶";
        }
        syncDropdown();
    }

    function togglePlay() {
        if (audio.paused) {
            audio.play();
            playPause.textContent = "⏸";
        } else {
            audio.pause();
            playPause.textContent = "▶";
        }
    }

    playPause.addEventListener("click", togglePlay);
    prevBtn.addEventListener("click", () => loadTrack(current - 1, true));
    nextBtn.addEventListener("click", () => loadTrack(current + 1, true));

    audio.addEventListener("loadedmetadata", () => {
        durationEl.textContent = fmtTime(audio.duration);
    });

    audio.addEventListener("timeupdate", () => {
        if (!audio.duration) return;
        seek.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = fmtTime(audio.currentTime);
    });

    audio.addEventListener("ended", () => {
        loadTrack(current + 1, true);
    });

    seek.addEventListener("input", () => {
        if (!audio.duration) return;
        audio.currentTime = (seek.value / 100) * audio.duration;
    });

    volume.addEventListener("input", () => {
        audio.volume = Number(volume.value);
    });

    ddToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        ddMenu.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        ddMenu.classList.remove("open");
    });

    if (playlist.length) {
        buildDropdown();
        loadTrack(0, false); // load bài đầu, chưa auto play
    } else {
        setTrackTitle("Khong co bai hat");
    }
}


// SCROLL REVEAL
let revealObserver = null;
if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((el) => {
        revealObserver.observe(el);
    });
}

// BACK TO TOP
const backToTop = document.getElementById("backToTop");
if (backToTop) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 280) {
            backToTop.classList.add("show");
        } else {
            backToTop.classList.remove("show");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// YEAR
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
}

// SPA: LOAD POSTS + OPEN ARTICLE IN PAGE
const articleSection = document.getElementById("articleViewer");
const articleTitleEl = document.getElementById("articleTitle");
const articleMetaEl = document.getElementById("articleMeta");
const articleContentEl = document.getElementById("articleContent");
const articleBackBtn = document.getElementById("articleBack");

async function initPostsGrid() {
    const grid = document.getElementById("postsGrid");
    if (!grid) return;

    try {
        const res = await fetch("./posts/index.json", { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const posts = await res.json();

        posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

        grid.innerHTML = posts.map((p) => {
            const cover = p.cover ? `<img src="${p.cover}" alt="">` : "";
            return `
        <article class="card post reveal">
            ${cover}
            <div class="post-body">
                <h3>
                    <button class="post-link" data-file="${p.file}" type="button">
                        ${p.title}
                    </button>
                </h3>
                <p>${p.summary || ""}</p>
                <button class="btn small post-link" data-file="${p.file}" type="button">
                    Doc
                </button>
            </div>
        </article>
    `;
        }).join("");


        if (revealObserver) {
            grid.querySelectorAll(".reveal").forEach((el) => {
                revealObserver.observe(el);
            });
        }

        grid.addEventListener("click", (e) => {
            const btn = e.target.closest(".post-link");
            if (!btn) return;
            const file = btn.getAttribute("data-file");
            const post = posts.find((p) => p.file === file);
            if (post) {
                e.preventDefault();
                openArticle(post);
            }
        });
    } catch (err) {
        console.error(err);
        grid.innerHTML = "<p>Khong tai duoc danh sach bai viet.</p>";
    }
}

async function openArticle(post) {
    if (!articleSection || !articleTitleEl || !articleMetaEl || !articleContentEl) return;

    const fileName = post.file.endsWith(".md") ? post.file : post.file + ".md";

    articleTitleEl.textContent = post.title || "Bai viet";
    articleMetaEl.textContent = post.date ? "Ngay dang: " + post.date : "";
    articleContentEl.innerHTML = "<p>Dang tai noi dung...</p>";
    articleSection.classList.remove("hidden");

    try {
        const res = await fetch("posts/" + fileName, { cache: "no-store" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const md = await res.text();

        const rawHtml = marked.parse(md);
        const cleanHtml = DOMPurify.sanitize(rawHtml);
        articleContentEl.innerHTML = cleanHtml;

        if (window.hljs) {
            articleContentEl.querySelectorAll("pre code").forEach((block) => {
                window.hljs.highlightElement(block);
            });
        }

        articleSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
        console.error(err);
        articleContentEl.innerHTML = "<p>Khong the tai noi dung bai viet.</p>";
    }
}

function closeArticle() {
    if (!articleSection) return;
    articleSection.classList.add("hidden");
}

if (articleBackBtn) {
    articleBackBtn.addEventListener("click", () => {
        closeArticle();
        const postsSection = document.getElementById("posts");
        if (postsSection) {
            postsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}

initPostsGrid();

// ===== Animated background: simple particle network =====
(function () {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas || !canvas.getContext) return;

    const ctx = canvas.getContext("2d");

    let width, height;
    let points = [];

    const POINT_COUNT = 180;       // nhiều điểm -> nhiều line
    const MIN_SPEED = 0.06;        // tốc độ tối thiểu
    const MAX_SPEED = 0.30;        // tốc độ tối đa (không quá loạn)
    const LINK_DISTANCE = 170;     // khoảng cách nối giữa các điểm
    const MOUSE_RADIUS = 180;      // vùng highlight quanh chuột

    const mouse = {
        x: 0,
        y: 0,
        active: false
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function randomVelocity() {
        const angle = Math.random() * Math.PI * 2;
        const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        return {
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed
        };
    }

    function createPoints() {
        points = [];
        for (let i = 0; i < POINT_COUNT; i++) {
            const v = randomVelocity();
            points.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: v.vx,
                vy: v.vy
            });
        }
    }

    function keepSpeed(p) {
        const v2 = p.vx * p.vx + p.vy * p.vy;
        if (v2 === 0) {
            const v = randomVelocity();
            p.vx = v.vx;
            p.vy = v.vy;
            return;
        }
        const v = Math.sqrt(v2);
        if (v < MIN_SPEED) {
            p.vx = (p.vx / v) * MIN_SPEED;
            p.vy = (p.vy / v) * MIN_SPEED;
        } else if (v > MAX_SPEED) {
            p.vx = (p.vx / v) * MAX_SPEED;
            p.vy = (p.vy / v) * MAX_SPEED;
        }
    }

    window.addEventListener("resize", () => {
        resize();
        createPoints();
    });

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener("mouseleave", () => {
        mouse.active = false;
    });

    function loop() {
        ctx.clearRect(0, 0, width, height);

        // Cập nhật & vẽ điểm
        for (const p of points) {
            // cập nhật vị trí
            p.x += p.vx;
            p.y += p.vy;

            // bounce biên
            if (p.x <= 0 || p.x >= width) {
                p.vx *= -1;
                p.x = Math.max(0, Math.min(width, p.x));
            }
            if (p.y <= 0 || p.y >= height) {
                p.vy *= -1;
                p.y = Math.max(0, Math.min(height, p.y));
            }

            // giữ tốc độ ổn định
            keepSpeed(p);

            // vẽ điểm
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(148,163,253,0.9)";
            ctx.fill();
        }

        // Vẽ line giữa các điểm
        for (let i = 0; i < points.length; i++) {
            const a = points[i];
            for (let j = i + 1; j < points.length; j++) {
                const b = points[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < LINK_DISTANCE) {
                    const alpha = 1 - dist / LINK_DISTANCE;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = "rgba(110,168,254," + alpha.toFixed(3) + ")";
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }

        // Highlight quanh chuột: chỉ vẽ line, KHÔNG lực, KHÔNG hút/đuổi
        if (mouse.active) {
            for (const p of points) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS) {
                    const alpha = 1 - dist / MOUSE_RADIUS;
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.strokeStyle = "rgba(129,140,248," + (alpha * 0.55).toFixed(3) + ")";
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(loop);
    }

    resize();
    createPoints();
    loop();
})();
