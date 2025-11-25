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

    // блокируем скролл пока лоадер активен
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
        const wait = Math.max(0, MIN - dt);
        setTimeout(reveal, wait);
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
    if (el) {
        el.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }
});


// ============================
//   APP STATE (CURRENT LESSON)
// ============================
const STORAGE_LESSON_KEY = 'pw_current_lesson_key';
// LESSONS приходит из data.js (глобальный объект)
let currentLessonKey = localStorage.getItem(STORAGE_LESSON_KEY) || null;

// если ключ больше не существует в базе — сбрасываем
if (currentLessonKey && !Object.prototype.hasOwnProperty.call(LESSONS, currentLessonKey)) {
    currentLessonKey = null;
    localStorage.removeItem(STORAGE_LESSON_KEY);
}

function getCurrentLesson() {
    return currentLessonKey ? LESSONS[currentLessonKey] : null;
}


// ============================
//   BOTTOM NAV STATE
// ============================
function updateBNBState() {
    document.querySelectorAll(".bnb-item").forEach(btn => {
        const tab = btn.dataset.tab;
        if (tab === "home") return;

        if (currentLessonKey) {
            btn.classList.remove("disabled");
        } else {
            btn.classList.add("disabled");
        }
    });
}

function switchTab(tab) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add('hidden'));
    const el = $(tab);
    if (el) el.classList.remove('hidden');

    document.querySelectorAll('.bnb-item').forEach(b => {
        b.classList.toggle('is-active', b.dataset.tab === tab);
    });
}


// ============================
//   LESSON PICKER (HERO)
// ============================
const trigger = $("lessonTrigger");
const dropdown = $("lessonDropdown");
const lessonDescEl = $("lessonDesc");
const triggerText = $("lessonTriggerText");

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

// открыть/закрыть dropdown
if (trigger) {
    trigger.addEventListener("click", () => {
        dropdown.classList.toggle("hidden");
    });
}

// выбор урока
if (dropdown) {
    dropdown.addEventListener("click", (e) => {
        const opt = e.target.closest(".lesson-option");
        if (!opt) return;

        const key = opt.dataset.key;
        const lesson = LESSONS[key];
        if (!lesson) return;

        currentLessonKey = key;
        localStorage.setItem(STORAGE_LESSON_KEY, currentLessonKey);

        triggerText.textContent = lesson.name;
        lessonDescEl.textContent = lesson.description;

        dropdown.classList.add("hidden");
        updateBNBState();
    });
}


// ============================
//   HOME INIT + STATS + FAVS
// ============================
function updateHomeProgress() {
    const count = getTotalSeenCount();
    $("stat_words_learned").textContent = count;
    $("stat_cards_seen").textContent = count;
}

function initHome() {
    // тесты пока заглушка
    $("stat_tests_done").textContent = 0;

    // словари
    $("stat_dicts_total").textContent = Object.keys(LESSONS).length;

    // любимые (пока пусто)
    $("home_favorite_words").innerHTML = `<li>— пока пусто —</li>`;

    // список уроков в dropdown
    renderLessonList();

    // блок "Новые слова"
    renderLatestLesson();

    // подтягиваем выбранный словарь (если был)
    const savedLesson = getCurrentLesson();
    if (savedLesson) {
        triggerText.textContent = savedLesson.name;
        lessonDescEl.textContent = savedLesson.description;
    }

    // прогресс по изученным словам (по всем словарям)
    updateHomeProgress();

    // обновляем состояние навигации
    updateBNBState();
}


// ============================
//   NEW WORDS PANEL
// ============================
function getLastLessonKey() {
    const keys = Object.keys(LESSONS);
    return keys[keys.length - 1];
}

function renderLatestLesson() {
    const card = document.getElementById("latestLessonCard");
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
        if (currentLessonKey === key) return; // уже выбран

        currentLessonKey = key;
        localStorage.setItem(STORAGE_LESSON_KEY, currentLessonKey);

        triggerText.textContent = lesson.name;
        lessonDescEl.textContent = lesson.description;

        updateBNBState();
    };
}


// ============================
//   LOCAL STORAGE HELPERS
// ============================

// index per lesson
function loadCardIndex(key) {
    const v = localStorage.getItem(`pw_idx_${key}`);
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 ? n : 0;
}
function saveCardIndex(key, idx) {
    localStorage.setItem(`pw_idx_${key}`, String(idx));
}

// favorites
function loadFavs(key) {
    try {
        const raw = localStorage.getItem(`pw_fav_${key}`);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}
function saveFavs(key, favs) {
    localStorage.setItem(`pw_fav_${key}`, JSON.stringify(favs));
}

// seen (изученные карточки)
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

// общее количество изученных слов по всем словарям
function getTotalSeenCount() {
    return Object.keys(LESSONS).reduce((sum, key) => {
        try {
            const raw = localStorage.getItem(`pw_seen_${key}`);
            const arr = JSON.parse(raw);
            return sum + (Array.isArray(arr) ? arr.length : 0);
        } catch {
            return sum;
        }
    }, 0);
}


// ============================
//   CARDS ENGINE
// ============================
let cardsState = null;

// запуск карточек
function startCards() {
    if (!currentLessonKey) {
        alert("Сначала выбери словарь 📚");
        return;
    }

    const lesson = LESSONS[currentLessonKey];
    if (!lesson || !lesson.items || !lesson.items.length) {
        alert("В этом словаре пока нет слов 🤷🏻‍♂️");
        return;
    }

    let idx = loadCardIndex(currentLessonKey);
    if (idx < 0 || idx >= lesson.items.length) idx = 0;

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

// отрисовка карточки
function renderCard() {
    if (!cardsState) return;

    const lesson = LESSONS[cardsState.key];
    const items = lesson.items;
    const idx = cardsState.idx;

    if (idx < 0 || idx >= items.length) {
        cardsState.idx = 0;
    }

    const item = items[cardsState.idx];

    $("front").textContent = item.ru;
    $("back").textContent = item.en;

    $("card").classList.toggle("flipped", cardsState.flipped);
    $("favBtn").classList.toggle("fav", cardsState.favs.includes(cardsState.idx));

    saveCardIndex(cardsState.key, cardsState.idx);
    updateCardsProgress();
}

// прогресс-бар внутри экрана Cards (позиционный, не по seen)
function updateCardsProgress() {
    const bar = $("cardsProgressFill");
    if (!bar || !cardsState) return;

    const lesson = LESSONS[cardsState.key];
    const total = lesson.items.length - 1;
    const idx = cardsState.idx;

    if (total <= 0) {
        bar.style.width = "0%";
        return;
    }

    bar.style.width = ((idx / total) * 100) + "%";
}

// отметить карточку как изученную (первый раз увидели этот индекс)
function markSeen() {
    if (!cardsState) return;
    const { key, idx, seen } = cardsState;
    if (!seen.has(idx)) {
        seen.add(idx);
        saveSeenSet(key, seen);
        updateHomeProgress();
    }
}

// действия
function flipCard() {
    if (!cardsState) return;
    cardsState.flipped = !cardsState.flipped;
    renderCard();
}

function nextCard() {
    if (!cardsState) return;
    const s = cardsState;
    const lesson = LESSONS[s.key];
    const len = lesson.items.length;

    s.idx = (s.idx + 1) % len;
    s.flipped = false;
    renderCard();
    markSeen();
}

function prevCard() {
    if (!cardsState) return;
    const s = cardsState;
    const lesson = LESSONS[s.key];
    const len = lesson.items.length;

    s.idx = (s.idx - 1 + len) % len;
    s.flipped = false;
    renderCard();
    markSeen();
}

function toggleFav() {
    if (!cardsState) return;
    const { idx, favs, key } = cardsState;
    const i = favs.indexOf(idx);
    if (i === -1) favs.push(idx);
    else favs.splice(i, 1);
    saveFavs(key, favs);
    renderCard();
}


// ============================
//   EVENTS BINDING
// ============================

// карточка: клик / клавиатура
if ($("card")) {
    $("card").addEventListener("click", flipCard);
    $("card").addEventListener("keydown", (e) => {
        if (!cardsState) return;
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            flipCard();
        }
    });
}
// кнопки
if ($("prevBtn")) $("prevBtn").addEventListener("click", prevCard);
if ($("nextBtn")) $("nextBtn").addEventListener("click", nextCard);
if ($("favBtn")) $("favBtn").addEventListener("click", toggleFav);

// BNB (табы)
document.querySelectorAll('.bnb-item').forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains("disabled")) return;

        const tab = btn.dataset.tab;

        if (tab === "cards") {
            startCards();
        } else {
            switchTab(tab);
        }
    });
});


// ============================
//   APP INIT
// ============================
initHome();
switchTab("home");

// (опционально) SERVICE WORKER
// if ("serviceWorker" in navigator) {
//     navigator.serviceWorker.register("/PW2/sw.js").catch(()=>{});
// }
