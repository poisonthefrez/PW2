(function () {
    const loader = document.getElementById('pageloader');
    const MIN = 2500;   // минимальное отображение
    const HARD_CAP = 5000; // максимум
    const t0 = Date.now();

    if (loader) {
        document.documentElement.classList.add('lock');
        document.body.classList.add('lock');
    }

    function reveal() {
        if (!loader) return;
        loader.classList.add('hide');
        document.documentElement.classList.remove('lock');
        document.body.classList.remove('lock');
        setTimeout(() => loader.remove(), 650);
    }

    function finish() {
        const dt = Date.now() - t0;
        const wait = Math.max(0, MIN - dt);
        setTimeout(reveal, wait);
    }

    if (loader) {
        window.addEventListener('load', finish, { once: true });
        setTimeout(reveal, HARD_CAP);
    }
})();
// ========== HOME RENDER ==========

function renderHomeAnalytics() {
    // заглушки
    $('stat_words_learned').textContent = 0;
    $('stat_cards_seen').textContent = 0;
    $('stat_tests_done').textContent = 0;

    // словари
    if (window.LESSONS) {
        $('stat_dicts_total').textContent = Object.keys(LESSONS).length;
    }

    // любимые слова (пусто)
    $('home_favorite_words').innerHTML = `
        <li>— пока пусто —</li>
    `;
}
//BOTTOM NAV BAR
function setActiveTab(tab) {
    document.querySelectorAll('.bnb-item').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.tab === tab);
    });
}

function switchTab(tab) {
    // скрываем все экраны
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.add('hidden');
    });

    // показываем нужный
    const el = document.getElementById(tab);
    if (el) el.classList.remove('hidden');

    setActiveTab(tab);
}

// init
document.querySelectorAll('.bnb-item').forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const pwQuotes = [
        "Как настроение у моей девочки? ❤️ Всё получится!",
        "Что сегодня учим, солнышко? 🌸 Я в тебя верю!",
        "Ты сильнее, чем думаешь! Ты моё вдохновение ✨",
        "Сделано с любовью, твой Владушка 💫",
        "Не забывай улыбаться, и даже самые трудные слова тебе покорятся 💕",
        "Сделаем этот английский на раз-два с любимой ✨",
        "Ты моё маленькое счастье! Твой Владушка 💗",
        "У тебя всё получится, моя девочка! Ты мой цветочек 🌷",
        "Каждое новое выученное словечко — как маленькая победа! 🌙",
        "Мне нравится наблюдать, как ты становишься лучше день за днём 💞"
    ];

    const el = document.querySelector(".hero-sub");
    if (el) el.textContent = pwQuotes[Math.floor(Math.random() * pwQuotes.length)];
});
