/* =========================================
   ÁUDIO — TRÊS EFEITOS
========================================= */

const sounds = {
    click: new Audio("assets/audio/click.mp3"),
    transition: new Audio("assets/audio/transition.mp3"),
    impact: new Audio("assets/audio/impact.mp3")
};

sounds.click.volume = 0.35;
sounds.transition.volume = 0.40;
sounds.impact.volume = 0.60;

Object.values(sounds).forEach(sound => {
    sound.preload = "auto";
    sound.load();
});

let audioEnabled = false;

// Libera o áudio no primeiro toque, clique ou tecla.
// Nenhum botão aparece na tela.
function unlockAudio() {
    if (audioEnabled) return;

    audioEnabled = true;

    document.removeEventListener("pointerdown", unlockAudio, true);
    document.removeEventListener("touchstart", unlockAudio, true);
    document.removeEventListener("keydown", unlockAudio, true);

    // O primeiro toque também produz um efeito.
    playSound("click");
}

document.addEventListener("pointerdown", unlockAudio, true);
document.addEventListener("touchstart", unlockAudio, true);
document.addEventListener("keydown", unlockAudio, true);

function playSound(name) {
    if (!audioEnabled) return;

    const sound = sounds[name];
    if (!sound) return;

    sound.pause();
    sound.currentTime = 0;

    sound.play().catch(error => {
        console.warn("Falha no áudio " + name + ":", error);
    });
}


/* =========================================
   CLIQUES NOS BOTÕES
========================================= */

document.querySelectorAll(
    ".button, .nav-cta, .nav-links a"
).forEach(button => {

    button.addEventListener("click", () => {
        playSound("click");
    });

});


/* =========================================
   ANIMAÇÕES REVEAL
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.12 });

revealElements.forEach(element => {
    revealObserver.observe(element);
});


/* =========================================
   SOM NAS TRANSIÇÕES DE SEÇÃO
========================================= */

// Usa as seções reais do HTML, mesmo que
// não tenham classes como .intro ou .regional.
const sections = document.querySelectorAll("main section, section");

let lastTransition = 0;

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting || !audioEnabled) return;

        const now = Date.now();

        // Evita vários efeitos simultâneos.
        if (now - lastTransition < 1800) return;

        lastTransition = now;
        playSound("transition");
    });
}, { threshold: 0.35 });

sections.forEach(section => {
    sectionObserver.observe(section);
});


/* =========================================
   IMPACTO NOS NÚMEROS
========================================= */

const impactElements = document.querySelectorAll(
    ".mega-number, .returning-number, .regional-heading"
);

let lastImpact = 0;

const impactObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting || !audioEnabled) return;

        // O contador tem seu próprio impacto.
        if (entry.target.contains(document.querySelector(".counter"))) {
            return;
        }

        const now = Date.now();

        if (now - lastImpact < 1200) return;

        lastImpact = now;

        playSound("impact");

        entry.target.classList.remove("impact");
        void entry.target.offsetWidth;
        entry.target.classList.add("impact");
    });
}, { threshold: 0.5 });

impactElements.forEach(element => {
    impactObserver.observe(element);
});


/* =========================================
   CONTADOR 766 MIL
========================================= */

const counter = document.querySelector(".counter");

if (counter) {

    let started = false;

    const counterObserver = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting || started) return;

            started = true;

            const target = Number(counter.dataset.target);
            const duration = 1500;
            const startTime = performance.now();

            function animate(currentTime) {

                const progress = Math.min(
                    (currentTime - startTime) / duration,
                    1
                );

                const eased = 1 - Math.pow(1 - progress, 4);

                counter.textContent = Math.floor(
                    target * eased
                ).toLocaleString("pt-BR");

                if (progress < 1) {

                    requestAnimationFrame(animate);

                } else {

                    counter.textContent = target.toLocaleString("pt-BR");

                    playSound("impact");

                    counter.classList.remove("impact");
                    void counter.offsetWidth;
                    counter.classList.add("impact");
                }
            }

            requestAnimationFrame(animate);
            counterObserver.unobserve(counter);
        });

    }, { threshold: 0.4 });

    counterObserver.observe(counter);
}
