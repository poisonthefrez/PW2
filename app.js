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
        "У тебя всё получится, моя девочка 💕",
        "Ты самая умная девочка, я верю в тебя 🌙",
        "Каждое слово — шаг вперёд, горжусь тобой 💘",
        "Учимся не спеша, ты справишься лучше всех 💫",
        "Твои успехи — моя радость, моя маленькая звёздочка ✨",
        "Милая, ты самая чудесная девушка на свете! 🌹",
        "Давай постараемся, моя малышка, все получится! ✨",
        "Выучим этот инглиш слово за словом, хихи 😝",
        "С любовью, твой Владушка! ❤️"
    ];
    const el = document.querySelector(".hero-sub");
    if (el) el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
});
// ============================
//   HERO RANDOM WORD (v2)
// ============================
document.addEventListener("DOMContentLoaded", () => {
    const words2 = [
        "моя любимая",
        "моё солнышко",
        "моя дорогая",
        "мой цветочек",
        "моя киса",
        "моя девочка",
        "моя кошечка"
    ];
    const el2 = document.getElementById("heroRandomWord");
    if (el2) {
        const w = words2[Math.floor(Math.random() * words2.length)];
        el2.textContent = `${w} ?`;
    }
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
//   NEW WORDS PANEL (V3)
// ============================
function getLastLessonKey() {
    const keys = Object.keys(LESSONS);
    return keys[keys.length - 1];
}

function renderLatestLesson() {
    const card = $("latestLessonCard");
    if (!card) return;

    const key = getLastLessonKey();
    const lesson = LESSONS[key];
    if (!lesson) return;

    card.innerHTML = `
        <div class="new-lesson-card-title">${lesson.name}</div>
        <div class="new-lesson-card-desc">${lesson.description}</div>
    `;
    card.classList.remove("hidden");

    card.onclick = () => {
        if (currentLessonKey === key) return;

        currentLessonKey = key;
        localStorage.setItem(STORAGE_LESSON_KEY, key);

        triggerText.textContent = lesson.name;
        lessonDescEl.textContent = lesson.description;

        updateBNBState();
    };
}


// ============================
//   PROGRESS (WORDS / CARDS)
// ============================
function getTotalSeenCount() {
    return Object.keys(LESSONS).reduce((sum, k) => {
        try {
            const raw = localStorage.getItem(`pw_seen_${k}`);
            const arr = JSON.parse(raw);
            return sum + (Array.isArray(arr) ? arr.length : 0);
        } catch {
            return sum;
        }
    }, 0);
}

function updateHomeProgress() {
    const count = getTotalSeenCount();
    const elWords = $("stat_words_learned");
    const elCards = $("stat_cards_seen");
    if (elWords) elWords.textContent = count;
    if (elCards) elCards.textContent = count;
}



// ============================
//   FAVORITES API
// ============================
function loadFavs(key) {
    try {
        const raw = localStorage.getItem(`pw_fav_${key}`);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
        return Array.from(
            new Set(
                arr.map(v => Number(v)).filter(n => Number.isFinite(n) && n >= 0)
            )
        );
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
        const favIdx = loadFavs(key);
        if (!favIdx?.length) continue;

        const lesson = LESSONS[key];
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

    box.innerHTML = favs.map(i => `
        <li class="fav-item">
            <div class="fav-text">
                <span class="fav-ru">${i.ru}</span>
                <span class="fav-en">${i.en}</span>
            </div>
            <button class="fav-del" data-en="${i.en}">✕</button>
        </li>
    `).join("");


    // обработчик удаления
    box.querySelectorAll(".fav-del").forEach(btn => {
        btn.addEventListener("click", () => {
            removeFav(btn.dataset.en);
        });
    });
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
        favs: [...loadFavs(currentLessonKey)], // копия
        seen: loadSeenSet(currentLessonKey)
    };

    $("cardsLessonName").textContent = lesson.name;
    renderCard();
    switchTab("cards");
    markSeen(); // считаем первую карточку просмотренной
}

function renderCard() {
    if (!cardsState) return;

    const lesson = LESSONS[cardsState.key];
    const item = lesson.items[cardsState.idx];

    $("front").textContent = item.ru;
    $("back").textContent = item.en;

    $("card").classList.toggle("flipped", cardsState.flipped);

    const isFav = Array.isArray(cardsState.favs) && cardsState.favs.includes(cardsState.idx);
    $("favBtn").classList.toggle("fav", isFav);

    saveCardIndex(cardsState.key, cardsState.idx);
    updateCardsProgress();
}

function updateCardsProgress() {
    const bar = $("cardsProgressFill");
    if (!bar || !cardsState) return;
    const len = LESSONS[cardsState.key].items.length - 1;
    bar.style.width = len <= 0 ? "0%" : `${(cardsState.idx / len) * 100}%`;
}

function markSeen() {
    if (!cardsState) return;
    const { key, idx, seen } = cardsState;
    if (!seen.has(idx)) {
        seen.add(idx);
        saveSeenSet(key, seen);
        updateHomeProgress();
    }
}

function flipCard() {
    if (!cardsState) return;
    cardsState.flipped = !cardsState.flipped;
    renderCard();
}

function nextCard() {
    if (!cardsState) return;
    const s = cardsState;
    const len = LESSONS[s.key].items.length;
    s.idx = (s.idx + 1) % len;
    s.flipped = false;
    renderCard();
    markSeen();
}

function prevCard() {
    if (!cardsState) return;
    const s = cardsState;
    const len = LESSONS[s.key].items.length;
    s.idx = (s.idx - 1 + len) % len;
    s.flipped = false;
    renderCard();
    markSeen();
}

function toggleFav() {
    if (!cardsState) return;

    const key = cardsState.key;
    const idx = Number(cardsState.idx);

    const favs = [...loadFavs(key)];
    const i = favs.indexOf(idx);

    if (i === -1) favs.push(idx);
    else favs.splice(i, 1);

    saveFavs(key, favs);
    cardsState.favs = favs;

    renderCard();
    renderFavoriteWordsPanel();
}
function removeFav(enWord) {
    // проходим по всем словарям
    for (const key of Object.keys(LESSONS)) {
        const favs = loadFavs(key);
        if (!favs.length) continue;

        const lesson = LESSONS[key];
        const idxToRemove = favs.findIndex(i => {
            const item = lesson.items[i];
            return item && item.en === enWord;
        });

        if (idxToRemove !== -1) {
            favs.splice(idxToRemove, 1);
            saveFavs(key, favs);
        }
    }

    // обновляем UI
    renderFavoriteWordsPanel();
}
function renderDictProgressCircles() {
    const box = $("statsCircleGrid");
    if (!box) return;

    box.innerHTML = "";

    Object.entries(LESSONS).forEach(([key, lesson]) => {
        const seen = loadSeenSet(key);
        const total = lesson.items.length;
        const pct = Math.round((seen.size / total) * 100);

        const div = document.createElement("div");
        div.className = "stats-circle";
        div.innerHTML = `
            <svg class="circle-svg" viewBox="0 0 100 100">
                <circle class="bg" cx="50" cy="50" r="45"/>
                <circle class="fg" cx="50" cy="50" r="45"
                    style="stroke-dashoffset:${282 - (282 * pct / 100)}"/>
            </svg>
            <div class="circle-label">
                <span class="circle-name">${lesson.name}</span>
                <span class="circle-pct">${pct}%</span>
            </div>
        `;
        div.onclick = () => {
            currentLessonKey = key;
            localStorage.setItem(STORAGE_LESSON_KEY, key);
            triggerText.textContent = lesson.name;
            lessonDescEl.textContent = lesson.description;
            updateBNBState();
        };

        box.appendChild(div);
    });
}
function getLessonProgress(key) {
    const lesson = LESSONS[key];
    if (!lesson) return 0;

    const seenRaw = localStorage.getItem(`pw_seen_${key}`);
    const seen = seenRaw ? JSON.parse(seenRaw) : [];

    const total = lesson.items.length;
    return total > 0 ? seen.length / total : 0;
}
$("statsRefreshBtn")?.addEventListener("click", () => {
    renderDictProgressCircles();
    updateHomeProgress();
});



// ============================
//   HOME INIT
// ============================
function initHome() {
    $("stat_tests_done").textContent = 0;

    renderLessonList();
    renderLatestLesson();
    renderDictProgressCircles();
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
