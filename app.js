function $(id) { return document.getElementById(id); }

// PAGE LOADER
(function(){
    const loader = $('pageloader');
    const MIN = 1200;
    const HARD = 3500;
    const t0 = performance.now();

    function reveal(){
        loader.classList.add('hide');
        document.documentElement.classList.remove('lock');
        document.body.classList.remove('lock');
        setTimeout(()=> loader.remove(),600);
    }

    window.addEventListener('load', ()=>{
        const wait = Math.max(0, MIN - (performance.now()-t0));
        setTimeout(reveal, wait);
    }, {once:true});

    setTimeout(reveal, HARD);

})();
///////////////////////////////


// QUOTES — работает
document.addEventListener("DOMContentLoaded", ()=>{
    const q=[
        "Как настроение у моей девочки? ❤️",
        "Сделаем этот английский на раз-два ✨",
        "Ты моё маленькое счастье 💗",
        "Что сегодня учим, солнышко? 🌸",
        "У тебя всё получится 💕",
    ];
    const el=document.querySelector(".hero-sub");
    el.textContent = q[Math.floor(Math.random()*q.length)];
});


// STATE
let currentLesson = JSON.parse(localStorage.getItem("pw_current_lesson")) || null;


// LOCK NAV IF NO LESSON
function updateBNBState(){
    document.querySelectorAll(".bnb-item").forEach(btn=>{
        if(btn.dataset.tab==="home") return;

        if(currentLesson) btn.classList.remove("disabled");
        else btn.classList.add("disabled");
    });
}


// TAB SWITCH
function switchTab(tab){
    document.querySelectorAll(".screen").forEach(s=>s.classList.add('hidden'));
    $(tab).classList.remove('hidden');

    document.querySelectorAll('.bnb-item')
        .forEach(b=> b.classList.toggle('is-active', b.dataset.tab===tab));
}

document.querySelectorAll('.bnb-item').forEach(btn=>{
    btn.addEventListener('click',()=>{
        if(btn.classList.contains("disabled")) return;
        switchTab(btn.dataset.tab);
    });
});


// LESSON PICKER
const trigger = $("lessonTrigger");
const dropdown = $("lessonDropdown");
const desc = $("lessonDesc");
const triggerText = $("lessonTriggerText");

// render dictionary list
function renderLessonList(){
    dropdown.innerHTML = "";

    Object.entries(LESSONS).forEach(([key, lesson])=>{
        const div = document.createElement("div");
        div.className = "lesson-option";
        div.dataset.key = key;
        div.innerHTML = `<span>${lesson.name}</span><small>${lesson.description}</small>`;
        dropdown.appendChild(div);
    });
}

// open/close
trigger.addEventListener("click",()=>{
    dropdown.classList.toggle("hidden");
});

// choose
dropdown.addEventListener("click",(e)=>{
    const opt = e.target.closest(".lesson-option");
    if(!opt) return;

    currentLesson = LESSONS[opt.dataset.key];

    triggerText.textContent = currentLesson.name;
    desc.textContent = currentLesson.description;

    dropdown.classList.add("hidden");

    localStorage.setItem("pw_current_lesson", JSON.stringify(currentLesson));
    updateBNBState();
});


// INIT
function initHome(){
    
    $("stat_dicts_total").textContent = Object.keys(LESSONS).length;
    $("home_favorite_words").innerHTML = `<li>— пока пусто —</li>`;

    renderLessonList();
    renderLatestLesson();

    if(currentLesson){
        triggerText.textContent = currentLesson.name;
        desc.textContent = currentLesson.description;
    }
    updateBNBState();
}

initHome();
switchTab("home");
// ===================== NEW WORDS PANEL =====================
function getLastLesson(){
    const keys = Object.keys(LESSONS);
    return LESSONS[keys[keys.length - 1]];
}

function renderLatestLesson(){
    const card = document.getElementById("latestLessonCard");
    const lesson = getLastLesson();
    if(!lesson){ return; }

    card.innerHTML = `
        <div class="new-lesson-card-title">${lesson.name}</div>
        <div class="new-lesson-card-desc">${lesson.description}</div>
    `;
    card.classList.remove("hidden");

    card.onclick = ()=>{
        if(currentLesson && currentLesson.name === lesson.name){
            return; // выбран тот же урок — игнор
        }

        currentLesson = lesson;
        triggerText.textContent = lesson.name;
        desc.textContent = lesson.description;

        updateBNBState();
        localStorage.setItem("pw_current_lesson", JSON.stringify(currentLesson));
    };
}
