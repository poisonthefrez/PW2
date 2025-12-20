// ============================
//   HELPERS
// ============================
function $(id) {
    return document.getElementById(id);
}
// ============================
//  UTILS
// ============================
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
        "Как настроение у моей девочки? ❤️",
        "Сделаем этот английский на раз-два ✨",
        "Ты моё маленькое счастье 💗",
        "У тебя всё получится, моя зайка 💕",
        "Ты самая лучшая девочка, я верю в тебя 🌙",
        "Каждое слово — шаг вперёд, горжусь тобой 💘",
        "Учимся не спеша, ты справишься лучше всех 💫",
        "Твои успехи — моя радость, моя маленькая звёздочка ✨",
        "Милая, ты самая чудесная девушка на свете! 🌹",
        "Давай постараемся, моя малышка, все получится! ✨",
        "Выучим этот инглиш словечко за словечко, хихи 😝",
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
        "моя кошечка",
        "моя зайка"
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
const STORAGE_TESTS_COMPLETED_KEY = "pw_tests_completed";
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
//   THEME SYSTEM
// ============================
const THEMES = {
    burgundy: {
        name: 'Burgundy',
        color: '#ff7ea6',
        root: 'theme-burgundy'
    },
    emerald: {
        name: 'Emerald',
        color: '#4aced5',
        root: 'theme-emerald'
    },
    ocean: {
        name: 'Ocean',
        color: '#5eb3ff',
        root: 'theme-ocean'
    },
    crimson: {
        name: 'Crimson',
        color: '#ff5555',
        root: 'theme-crimson'
    },
    turquoise: {
        name: 'Turquoise',
        color: '#1ecccf',
        root: 'theme-turquoise'
    },
    midnight: {
        name: 'Midnight',
        color: '#7fa8ff',
        root: 'theme-midnight'
    },
    noir: {
        name: 'Noir',
        color: '#d97eff',
        root: 'theme-noir'
    },
    sunset: {
        name: 'Sunset',
        color: '#ffa27b',
        root: 'theme-sunset'
    },
    ice: {
        name: 'Ice',
        color: '#a8d5e5',
        root: 'theme-ice'
    },
    space: {
        name: 'Space',
        color: '#9d9dff',
        root: 'theme-space'
    }
};

const STORAGE_THEME_KEY = "pw_selected_theme";

function loadSelectedTheme() {
    try {
        const saved = localStorage.getItem(STORAGE_THEME_KEY);
        return (saved && THEMES[saved]) ? saved : 'burgundy';
    } catch {
        return 'burgundy';
    }
}

function saveSelectedTheme(themeKey) {
    localStorage.setItem(STORAGE_THEME_KEY, themeKey);
}

function applyTheme(themeKey) {
    const theme = THEMES[themeKey];
    if (!theme) return;
    
    const root = document.documentElement;
    
    // Remove all theme classes
    Object.values(THEMES).forEach(t => {
        root.classList.remove(t.root);
    });
    
    // Apply selected theme class
    root.classList.add(theme.root);
    
    // Save preference
    saveSelectedTheme(themeKey);
    
    // Update active highlight in UI
    updateThemeGridUI(themeKey);
}

function updateThemeGridUI(activeTheme) {
    document.querySelectorAll('.theme-item').forEach(item => {
        const key = item.dataset.theme;
        if (key === activeTheme) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
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
//   TESTS COMPLETED COUNTER
// ============================
function loadTestsCompleted() {
    try {
        const raw = localStorage.getItem(STORAGE_TESTS_COMPLETED_KEY);
        const val = parseInt(raw, 10);
        return Number.isFinite(val) && val >= 0 ? val : 0;
    } catch {
        return 0;
    }
}

function saveTestsCompleted(count) {
    localStorage.setItem(STORAGE_TESTS_COMPLETED_KEY, String(count));
}

function updateTestsCompletedUI() {
    const count = loadTestsCompleted();
    const el = $("stat_tests_done");
    if (el) el.textContent = count;
}

function incrementTestsCompleted() {
    const count = loadTestsCompleted();
    const newCount = count + 1;
    saveTestsCompleted(newCount);
    updateTestsCompletedUI();
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

function renderStatsCircles() {
    const recentBox = $("statsCircleGrid");
    const allBox = $("statsCircleGridAll");
    if (!recentBox || !allBox) return;

    recentBox.innerHTML = "";
    allBox.innerHTML = "";

    // 1. Собираем словари в массив
    const dicts = Object.entries(LESSONS).map(([key, lesson]) => ({
        key,
        ...lesson
    }));

    // 2. Сортировка — последний добавленный сверху
    dicts.sort((a,b) => (b.timestamp || 0) - (a.timestamp || 0));

    // 3. 4 свежих
    const recent = dicts.slice(0,4);
    const others = dicts.slice(4);

    // 4. Рендер блоков
    recent.forEach(d => recentBox.appendChild(createStatsCircle(d)));
    others.forEach(d => allBox.appendChild(createStatsCircle(d)));
}

function createStatsCircle(dict) {
    const seenRaw = localStorage.getItem(`pw_seen_${dict.key}`);
    const seen = seenRaw ? JSON.parse(seenRaw) : [];
    const total = dict.items.length;
    const pct = total === 0 ? 0 : Math.round((seen.length / total) * 100);

    const div = document.createElement("div");
    div.className = "stats-circle";
    div.innerHTML = `
        <svg class="circle-svg" viewBox="0 0 100 100">
            <circle class="bg" cx="50" cy="50" r="45"/>
            <circle class="fg"
                cx="50" cy="50" r="45"
                style="stroke-dashoffset:${282-(282*pct/100)}"/>
        </svg>
        <div class="circle-label">
            <span class="circle-name">${dict.name}</span>
            <span class="circle-pct">${pct}%</span>
        </div>
    `;
    div.onclick = () => openLesson(dict.key);
    return div;
}

function openLesson(key){
    currentLessonKey = key;
    localStorage.setItem(STORAGE_LESSON_KEY, key);

    triggerText.textContent = LESSONS[key].name;
    lessonDescEl.textContent = LESSONS[key].description;
    updateBNBState();
}
$("statsRefreshBtn")?.addEventListener("click", () => {
    renderStatsCircles();
});

$("statsToggleBtn")?.addEventListener("click", () => {
    const box = $("statsCircleGridAll");
    const arrow = $("statsToggleArrow");

    box.classList.toggle("hidden");

    arrow.textContent = box.classList.contains("hidden") ? "▼" : "▲";
});

// ============================
//   TEST ENGINE v3 (добавочный)
// ============================

let testState = null;
let testSessionCompletionCounted = false;

/** Быстрый helper для показа секции теста */
function showTestMode(screenId) {
    // блокируем все .test-screen
    document.querySelectorAll(".test-screen").forEach(s => s.classList.add("hidden"));
    $(screenId)?.classList.remove("hidden");

    // переключаем таб VISUAL
    switchTab("test");
}

/** запуск теста с BNB */
function startTestFlow() {
    if (!currentLessonKey) {
        alert("Сначала выбери словарь 📚");
        return;
    }

    const lesson = LESSONS[currentLessonKey];

    $("ts_lesson_name").textContent = lesson.name;
    $("ts_question").textContent = "Приступаем к тесту?";
    $("ts_start_btn").textContent = "Начать тестик 💞";

    showTestMode("testStartScreen");
}

/** формирование новой попытки */
function initTestEngine() {
    const lesson = LESSONS[currentLessonKey];

    // Reset completion flag for new test session
    testSessionCompletionCounted = false;

    testState = {
        key: currentLessonKey,
        order: shuffle(lesson.items.map((_, i) => i)),
        cur: 0,
        results: []
    };

    $("tt_lesson_name").textContent = lesson.name;
    renderTestQuestionUI();
    showTestMode("testRunScreen");
}

/** 1 вопрос */
function renderTestQuestionUI() {
    const st = testState;
    const lesson = LESSONS[st.key];

    if (st.cur >= st.order.length) {
        finishTestEngine();
        return;
    }

    const idx = st.order[st.cur];
    const item = lesson.items[idx];

    // вопрос
    $("tt_question").innerHTML = `Как переводится <u>${item.ru}</u>?`;

    // варианты
    let variants = [item.en];
    let pool = lesson.items
        .map(x => x.en)
        .filter(v => v !== item.en);

    pool = shuffle(pool).slice(0, 3);
    variants = shuffle([...variants, ...pool]);

    // рендер кнопок
    const box = $("tt_options");
    box.innerHTML = "";
    variants.forEach(v => {
        const b = document.createElement("button");
        b.className = "test-variant-btn";
        b.textContent = v;
        b.onclick = () => handleTestAnswer(v, item.en, idx);
        box.appendChild(b);
    });
    $("tt_counter").textContent = `${st.cur + 1} / ${st.order.length}`;

}

/** обработка ответа */
function handleTestAnswer(chosen, correct, idx) {
    const box = $("tt_options");
    const buttons = [...box.children];
    const ok = chosen === correct;

    // красим UI
    buttons.forEach(b => {
        b.disabled = true;
        if (b.textContent === correct) b.classList.add("correct");
        if (b.textContent === chosen && !ok) b.classList.add("wrong");
    });

    testState.results.push({ idx, chosen, correct });

    setTimeout(() => {
        testState.cur++;
        renderTestQuestionUI();
    }, 1600);
}

/** финал теста */
function finishTestEngine() {
    const st = testState;
    const lesson = LESSONS[st.key];
    const total = st.results.length;
    const good = st.results.filter(r => r.chosen === r.correct).length;

    $("tres_title").textContent = lesson.name;
    $("tres_summary").innerHTML = `
        Ты прошла тест!<br/>
        Верных ответов: <b>${good}</b> из <b>${total}</b>
    `;

    showTestMode("testSummaryScreen");
}

/** показать весь отчёт */
function renderFullResults() {
    const st = testState;
    const box = $("tres_list");
    const lesson = LESSONS[st.key];
    box.innerHTML = "";

    st.results.forEach(r => {
        const item = lesson.items[r.idx];
        box.innerHTML += `
        <div class="result-item ${r.chosen === r.correct ? "correct" : "wrong"}">
            <div class="question">${item.ru}</div>
            <div>Ты ответила: <b>${r.chosen}</b></div>
            <div>Правильно: <u>${item.en}</u></div>
        </div>`;
    });

    // Increment tests completed counter only once per session
    if (!testSessionCompletionCounted) {
        testSessionCompletionCounted = true;
        incrementTestsCompleted();
    }

    showTestMode("testResultScreen");
}

// события UI
$("ts_start_btn")?.addEventListener("click", initTestEngine);
$("tres_retry")?.addEventListener("click", initTestEngine);
$("tres_retry_bottom")?.addEventListener("click", initTestEngine);
$("tres_show_details")?.addEventListener("click", renderFullResults);


/** Подключение к BNB (не ломаем общий слушатель!) */
document.querySelectorAll(".bnb-item").forEach(btn => {
    btn.addEventListener("click", () => {
        if (btn.dataset.tab === "test" && !btn.classList.contains("disabled")) {
            startTestFlow();
        }
    });
});


// ============================
//   HOME INIT
// ============================
function initHome() {
    updateTestsCompletedUI();

    renderLessonList();
    renderLatestLesson();
    renderDictProgressCircles();
    renderFavoriteWordsPanel();
    renderStatsCircles();


    const saved = getCurrentLesson();
    if (saved) {
        triggerText.textContent = saved.name;
        lessonDescEl.textContent = saved.description;
    }

    updateHomeProgress();
    updateBNBState();
}

// ============================
//   DICT SCREEN
// ============================
function renderDict() {
    if (!currentLessonKey) {
        alert("Сначала выбери словарь 📚");
        return;
    }

    const lesson = LESSONS[currentLessonKey];
    const box = $("dict_list");
    box.innerHTML = "";

    const favs = loadFavs(currentLessonKey);

    lesson.items.forEach((item, idx) => {
        const isFav = favs.includes(idx);
        box.innerHTML += `
        <div class="dict-item">
            <div class="dict-item-content">
                <div class="dict-item-ru">${item.ru}</div>
                <div class="dict-item-en">${item.en}</div>
            </div>
            <button class="dict-favbt ${isFav ? 'fav' : ''}" data-idx="${idx}">♡</button>
        </div>`;
    });

    // Add event listeners to heart buttons
    box.querySelectorAll(".dict-favbt").forEach(btn => {
        btn.addEventListener("click", e => {
            e.stopPropagation();
            const idx = Number(btn.dataset.idx);
            const favs = [...loadFavs(currentLessonKey)];
            const i = favs.indexOf(idx);

            if (i === -1) favs.push(idx);
            else favs.splice(i, 1);

            saveFavs(currentLessonKey, favs);

            btn.classList.toggle("fav");
            renderFavoriteWordsPanel();
        });
    });

    switchTab("dict");
}


// ============================
//   SETTINGS SCREEN
// ============================
function renderSettings() {
    const grid = $("themeGrid");
    if (!grid) return;
    
    grid.innerHTML = "";
    const currentTheme = loadSelectedTheme();
    
    Object.entries(THEMES).forEach(([key, theme]) => {
        const item = document.createElement("div");
        item.className = `theme-item ${key === currentTheme ? 'active' : ''}`;
        item.dataset.theme = key;
        
        item.innerHTML = `
            <div class="theme-preview" style="background-color: ${theme.color}"></div>
            <div class="theme-name">${theme.name}</div>
        `;
        
        item.addEventListener("click", () => {
            applyTheme(key);
        });
        
        grid.appendChild(item);
    });
    
    switchTab("settings");
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
        if (btn.dataset.tab === "cards") {
            startCards();
        } else if (btn.dataset.tab === "dict") {
            renderDict();
        } else if (btn.dataset.tab === "settings") {
            renderSettings();
        } else {
            switchTab(btn.dataset.tab);
        }
    });
});


// ============================
//   INIT
// ============================
// Apply saved theme on page load
applyTheme(loadSelectedTheme());

initHome();
switchTab("home");
