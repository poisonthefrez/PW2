// ============================
//   HELPERS
// ============================
function $(id) {
    return document.getElementById(id);
}


// ============================
//   PAGE LOADER
// ============================
(function () {
    const loader = $('pageloader');
    if (!loader) return;

    const MIN = 1200;
    const HARD = 3500;
    const t0 = performance.now();

    document.documentElement.classList.add('lock');
    document.body.classList.add('lock');

    function reveal() {
        loader.classList.add('hide');
        document.documentElement.classList.remove('lock');
        document.body.classList.remove('lock');
        setTimeout(() => loader.remove(), 600);
    }

    window.addEventListener('load', () => {
        const dt = performance.now() - t0;
        setTimeout(reveal, Math.max(0, MIN - dt));
    }, { once: true });

    setTimeout(reveal, HARD);
})();


// ============================
//   HERO QUOTES
// ============================
document.addEventListener("DOMContentLoaded", () => {
    const quotes = [
        "Как настроение у моей девочки? ❤️ Всё получится!",
        "Сделаем этот английский на раз-два ✨",
        "Ты моё маленькое счастье 💗",
        "Что сегодня учим, солнышко? 🌸",
        "У тебя всё получится, моя девочка 💕"
    ];
    const el = document.querySelector(".hero-sub");
    if (el) el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
});


// ============================
//   APP STATE
// ============================
const STORAGE_LESSON_KEY = "pw_current_lesson_key";
let currentLessonKey = localStorage.getItem(STORAGE_LESSON_KEY) || null;

if (currentLessonKey && !LESSONS[currentLessonKey]) {
    currentLessonKey = null;
    localStorage.removeItem(STORAGE_LESSON_KEY);
}

function getCurrentLesson() {
    return currentLessonKey ? LESSONS[currentLessonKey] : null;
}


// ============================
//   BNB
// ============================
function updateBNBState() {
    document.querySelectorAll(".bnb-item").forEach(btn => {
        if (btn.dataset.tab === "home") return;
        currentLessonKey
            ? btn.classList.remove("disabled")
            : btn.classList.add("disabled");
    });
}

function switchTab(tab) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    $(tab)?.classList.remove("hidden");

    document.querySelectorAll(".bnb-item").forEach(b => {
        b.classList.toggle("is-active", b.dataset.tab === tab);
    });
}


// ============================
//   LESSON PICKER
// ============================
const trigger = $("lessonTrigger");
const dropdown = $("lessonDropdown");
const triggerText = $("lessonTriggerText");
const lessonDescEl = $("lessonDesc");

function renderLessonList() {
    if (!dropdown) return;
    dropdown.innerHTML = "";

    Object.entries(LESSONS).forEach(([key, lesson]) => {
        const div = document.createElement("div");
        div.className = "lesson-option";
        div.dataset.key = key;
        div.innerHTML = `
            <span>${lesson.name}</span>
            <small>${lesson.description}</small>
        `;
        dropdown.appendChild(div);
    });
}

trigger?.addEventListener("click", () => dropdown.classList.toggle("hidden"));

dropdown?.addEventListener("click", e => {
    const opt = e.target.closest(".lesson-option");
    if (!opt) return;

    const key = opt.dataset.key;
    const lesson = LESSONS[key];
    if (!lesson) return;

    currentLessonKey = key;
    localStorage.setItem(STORAGE_LESSON_KEY, key);

    triggerText.textContent = lesson.name;
    lessonDescEl.textContent = lesson.description;

    dropdown.classList.add("hidden");
    updateBNBState();
});


// ============================
//   HOME (stats + favorites)
// ============================
function getTotalSeenCount() {
    return Object.keys(LESSONS).reduce((sum, k) => {
        const raw = localStorage.getItem(`pw_seen_${k}`);
        const arr = JSON.parse(raw);
        return sum + (Array.isArray(arr) ? arr.length : 0);
    }, 0);
}

function updateHomeProgress() {
    const count = getTotalSeenCount();
    $("stat_words_learned").textContent = count;
    $("stat_cards_seen").textContent = count;
}

function initHome() {
    $("stat_tests_done").textContent = 0;
    $("stat_dicts_total").textContent = Object.keys(LESSONS).length;

    renderLessonList();
    renderFavoriteWordsPanel();

    const saved = getCurrentLesson();
    if (saved) {
        triggerText.textContent = saved.name;
        lessonDescEl.textContent = saved.description;
    }

    updateHomeProgress();
    updateBNBState();
}


// ============================
//   FAVORITES API
// ============================
function loadFavs(key) {
    try {
        return JSON.parse(localStorage.getItem(`pw_fav_${key}`)) || [];
    } catch {
        return [];
    }
}
function saveFavs(key, favs) {
    localStorage.setItem(`pw_fav_${key}`, JSON.stringify(favs));
}

function getAllFavoriteWords() {
    const arr = [];

    for (const key of Object.keys(LESSONS)) {
        const lesson = LESSONS[key];
        const favIdx = loadFavs(key);
        if (!favIdx?.length) continue;

        favIdx.forEach(i => {
            const item = lesson.items[i];
            if (!item) return;
            if (!arr.some(x => x.en === item.en)) {
                arr.push({ ru: item.ru, en: item.en, lesson: key });
            }
        });
    }
    return arr;
}

function renderFavoriteWordsPanel() {
    const box = $("home_favorite_words");
    if (!box) return;

    const favs = getAllFavoriteWords();
    if (!favs.length) {
        box.innerHTML = `<li style="opacity:.5">— пока пусто —</li>`;
        return;
    }

    box.innerHTML = favs
        .slice(0, 10)
        .map(i => `
            <li class="fav-item">
                <span class="ru">${i.ru}</span>
                <span class="en">${i.en}</span>
            </li>
        `).join("");
}


// ============================
//   SEEN API
// ============================
function loadSeenSet(key) {
    try {
        return new Set(JSON.parse(localStorage.getItem(`pw_seen_${key}`)) || []);
    } catch {
        return new Set();
    }
}
function saveSeenSet(key, set) {
    localStorage.setItem(`pw_seen_${key}`, JSON.stringify([...set]));
}


// ============================
//   CARDS ENGINE
// ============================
let cardsState = null;

function loadCardIndex(key) {
    return +localStorage.getItem(`pw_idx_${key}`) || 0;
}
function saveCardIndex(key, idx) {
    localStorage.setItem(`pw_idx_${key}`, idx);
}

function startCards() {
    if (!currentLessonKey) return alert("Сначала выбери словарь 📚");

    const lesson = LESSONS[currentLessonKey];
    if (!lesson?.items?.length) return alert("В этом словаре пусто 🤷‍♂️");

    let idx = loadCardIndex(currentLessonKey);
    if (idx >= lesson.items.length) idx = 0;

    cardsState = {
        key: currentLessonKey,
        idx,
        flipped: false,
        favs: loadFavs(currentLessonKey),
        seen: loadSeenSet(currentLessonKey)
    };

    $("cardsLessonName").textContent = lesson.name;
    renderCard();
    switchTab("cards");
}

function renderCard() {
    if (!cardsState) return;

    const lesson = LESSONS[cardsState.key];
    const item = lesson.items[cardsState.idx];

    $("front").textContent = item.ru;
    $("back").textContent = item.en;
    $("card").classList.toggle("flipped", cardsState.flipped);
    $("favBtn").classList.toggle("fav", cardsState.favs.includes(cardsState.idx));

    saveCardIndex(cardsState.key, cardsState.idx);
    updateCardsProgress();
}

function updateCardsProgress() {
    const bar = $("cardsProgressFill");
    if (!bar) return;
    const len = LESSONS[cardsState.key].items.length - 1;
    bar.style.width = len <= 0 ? "0%" : `${cardsState.idx / len * 100}%`;
}

function markSeen() {
    const { key, idx, seen } = cardsState;
    if (!seen.has(idx)) {
        seen.add(idx);
        saveSeenSet(key, seen);
        updateHomeProgress();
    }
}

function flipCard() {
    cardsState.flipped = !cardsState.flipped;
    renderCard();
}

function nextCard() {
    const s = cardsState;
    const len = LESSONS[s.key].items.length;
    s.idx = (s.idx + 1) % len;
    s.flipped = false;
    renderCard();
    markSeen();
}

function prevCard() {
    const s = cardsState;
    const len = LESSONS[s.key].items.length;
    s.idx = (s.idx - 1 + len) % len;
    s.flipped = false;
    renderCard();
    markSeen();
}

function toggleFav() {
    const { idx, favs, key } = cardsState;
    const i = favs.indexOf(idx);

    if (i === -1) favs.push(idx);
    else favs.splice(i, 1);

    saveFavs(key, favs);      // persist
    renderCard();             // UI state
    renderFavoriteWordsPanel();
}


// ============================
//   EVENTS
// ============================
$("card")?.addEventListener("click", flipCard);
$("prevBtn")?.addEventListener("click", prevCard);
$("nextBtn")?.addEventListener("click", nextCard);
$("favBtn")?.addEventListener("click", toggleFav);

document.querySelectorAll(".bnb-item").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.classList.contains("disabled")) return;
        btn.dataset.tab === "cards" ? startCards() : switchTab(btn.dataset.tab);
    });
});


// ============================
//   INIT
// ============================
initHome();
switchTab("home");
