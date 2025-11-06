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
    const TOTAL_TRACKS = 6;
    const playlist = [];
    for (let i = 1; i <= TOTAL_TRACKS; i++) {
        playlist.push({
            title: "music" + i,
            src: "assets/audio/music" + i + ".mp3"
        });
    }

    let current = 0;

    function fmtTime(t) {
        if (!isFinite(t)) return "0:00";
        const m = Math.floor(t / 60);
        const s = Math.floor(t % 60).toString().padStart(2, "0");
        return m + ":" + s;
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
        ddLabel.textContent = playlist[current]
            ? playlist[current].title
            : "Chon bai";
        const items = ddMenu.querySelectorAll(".dd-item");
        items.forEach((el, i) => {
            el.classList.toggle("active", i === current);
        });
    }

    function loadTrack(idx, autoplay) {
        if (!playlist.length) return;
        current = (idx + playlist.length) % playlist.length;
        const track = playlist[current];
        audio.src = track.src;
        trackTitle.textContent = track.title;
        audio.load();
        if (autoplay) {
            audio.play().then(() => {
                playPause.textContent = "⏸";
            }).catch(() => {});
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
        loadTrack(0, false);
    } else {
        trackTitle.textContent = "Khong co bai hat";
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
        const res = await fetch("./posts/_index.json", { cache: "no-store" });
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
