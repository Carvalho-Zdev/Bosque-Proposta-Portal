
document.addEventListener("DOMContentLoaded", () => {

    /* ÁUDIO */

    const sounds = {
        click: new Audio("assets/audio/click.mp3"),
        transition: new Audio("assets/audio/transition.mp3"),
        impact: new Audio("assets/audio/impact.mp3")
    };

    sounds.click.volume = 0.35;
    sounds.transition.volume = 0.55;
    sounds.impact.volume = 0.65;

    
let audioEnabled = false;

// Libera os efeitos no primeiro toque ou clique.
// Não cria nenhum botão na tela.
function unlockAudio() {
    audioEnabled = true;

    document.removeEventListener("pointerdown", unlockAudio);
    document.removeEventListener("keydown", unlockAudio);
}

document.addEventListener("pointerdown", unlockAudio, {
    once: true,
    capture: true
});

document.addEventListener("keydown", unlockAudio, {
    once: true,
    capture: true
});
// Ativa o áudio no primeiro toque ou clique
function unlockAudio() {
    audioEnabled = true;

    document.removeEventListener("pointerdown", unlockAudio, true);
    document.removeEventListener("keydown", unlockAudio, true);
}

document.addEventListener("pointerdown", unlockAudio, true);
document.addEventListener("keydown", unlockAudio, true);





    function playSound(name) {
        if (!audioEnabled) return;

        const original = sounds[name];
        if (!original) return;

        // Permite que um efeito novo toque mesmo
        // se o anterior ainda estiver terminando.
        const sound = original.cloneNode();
        sound.volume = original.volume;

        sound.play().catch(error => {
            console.warn("Não foi possível tocar o áudio:", error);
        });
    }

   

    /* SOM DOS BOTÕES */

    document.querySelectorAll(
        ".button, .nav-cta, .nav-links a"
    ).forEach(button => {

        button.addEventListener("click", () => {
            playSound("click");
        });

    });


    /* ANIMAÇÕES E SONS NAS SEÇÕES */

    const revealElements =
        document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);

            });

        },
        { threshold: 0.12 }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    /* TRANSIÇÕES AUTOMÁTICAS */

    const sections = document.querySelectorAll(
        ".intro, .regional, .profile, .search, .reports, .strategy, .proposal"
    );

    const sectionObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                playSound("transition");

            });

        },
        {
            threshold: 0.35
        }
    );

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    /* IMPACTO NOS NÚMEROS */

    const impactElements = document.querySelectorAll(
        ".mega-number, .returning-number, .regional-heading"
    );

    const impactObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                // O contador 766 tem sua própria animação.
                if (entry.target.classList.contains("mega-number")) {
                    return;
                }

                playSound("impact");

                entry.target.classList.remove("impact");
                void entry.target.offsetWidth;
                entry.target.classList.add("impact");

            });

        },
        {
            threshold: 0.5
        }
    );

    impactElements.forEach(element => {
        impactObserver.observe(element);
    });


    /* CONTADOR 766 MIL */

    const counter = document.querySelector(".counter");

    if (counter) {

        let counting = false;
        let completed = false;

        const counterObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting || counting || completed) {
                        return;
                    }

                    counting = true;

                    const target = Number(counter.dataset.target);
                    const duration = 1500;
                    const start = performance.now();

                    function animate(now) {

                        const progress = Math.min(
                            (now - start) / duration,
                            1
                        );

                        const eased = 1 - Math.pow(1 - progress, 4);

                        counter.textContent = Math.floor(
                            target * eased
                        ).toLocaleString("pt-BR");

                        if (progress < 1) {

                            requestAnimationFrame(animate);

                        } else {

                            counter.textContent =
                                target.toLocaleString("pt-BR");

                            playSound("impact");

                            counter.classList.add("impact");

                            completed = true;
                            counting = false;

                        }
                    }

                    requestAnimationFrame(animate);

                });

            },
            { threshold: 0.4 }
        );

        counterObserver.observe(counter);
    }

});
