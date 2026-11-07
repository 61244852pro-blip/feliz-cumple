
/* ============================================================
   ANGGE BIRTHDAY EXPERIENCE
   Sistema principal de interacciones
   Versión 2.0
============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";


    /* ========================================================
       1. CONFIGURACIÓN Y ELEMENTOS
    ======================================================== */

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    const loadingScreen = $("#loading-screen");
    const loadingPhase = $("#loading-phase");
    const welcomeCard = $("#welcome-card");
    const enterAdventureBtn = $("#enter-adventure-btn");

    const sceneIds = [
        "scene-intro",
        "scene-island",
        "scene-mission",
        "scene-memories",
        "scene-gift",
        "scene-letter",
        "scene-finale"
    ];

    const dialogueContainer = $("#dialogue-container");
    const dialogueSpeaker = $("#dialogue-speaker");
    const dialogueText = $("#dialogue-text");
    const nextDialogueButton = $("#next-dialogue");

    const startButton = $("#start-adventure");
    const missionButton = $("#accept-mission");

    const continueMemoriesButton = $("#continue-memories");
    const continueGiftButton = $("#continue-gift");

    const openGiftButton = $("#open-gift");
    const giftReveal = $("#gift-reveal");

    const openLetterButton = $("#open-letter");
    const letterMessage = $("#letter-message");

    const finishLetterButton = $("#finish-letter");
    const restartButton = $("#restart-adventure");

    const photoMessageDisplay = $("#photo-message-display");

    const backgroundMusic = $("#background-music");
    const soundEffects = $("#sound-effects");

    const musicToggle = $("#music-toggle");
    const soundToggle = $("#sound-toggle");

    const notification = $("#notification");


    /* ========================================================
       2. ESTADO DE LA EXPERIENCIA
    ======================================================== */

    let currentScene = "scene-intro";

    let dialogueList = [];
    let dialogueIndex = 0;
    let dialogueCallback = null;

    let musicEnabled = false;
    let soundsEnabled = true;

    let notificationTimer = null;

    let particlesInitialized = false;


    /* ========================================================
       3. PANTALLA DE CARGA
    ======================================================== */

    function hideLoadingScreen() {

        if (!loadingScreen) return;

        loadingScreen.classList.add("hidden");

        setTimeout(() => {
            loadingScreen.style.display = "none";
        }, 1000);

    }


    /* ========================================================
       4. CAMBIO DE ESCENARIOS
    ======================================================== */

    function showScene(sceneId) {

        const targetScene = document.getElementById(sceneId);

        if (!targetScene) {
            console.error("No se encontró el escenario:", sceneId);
            return;
        }

        sceneIds.forEach(id => {

            const scene = document.getElementById(id);

            if (scene) {
                scene.classList.remove("active");
            }

        });

        targetScene.classList.add("active");

        currentScene = sceneId;

        hideDialogue();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* ========================================================
       5. NOTIFICACIONES
    ======================================================== */

    function showNotification(message) {

        if (!notification) return;

        notification.textContent = message;
        notification.classList.add("show");

        clearTimeout(notificationTimer);

        notificationTimer = setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);

    }


    /* ========================================================
       6. SISTEMA DE SONIDOS
    ======================================================== */

    function playSound() {

        if (!soundsEnabled || !soundEffects) return;

        const hasSound =
            soundEffects.currentSrc ||
            soundEffects.getAttribute("src");

        if (!hasSound) return;

        soundEffects.currentTime = 0;

        soundEffects.play().catch(() => {
            // El navegador puede bloquear la reproducción.
        });

    }


    /* ========================================================
       7. SISTEMA DE MÚSICA
    ======================================================== */

    function startMusic() {

        if (!backgroundMusic || !musicEnabled) return;

        const hasMusic =
            backgroundMusic.currentSrc ||
            backgroundMusic.getAttribute("src");

        if (!hasMusic) {
            showNotification("Todavía falta agregar la música.");
            return;
        }

        backgroundMusic.volume = 0.35;

        backgroundMusic.play().catch(() => {
            showNotification("No se pudo iniciar la música.");
        });

    }


    function updateMusicButton() {

        if (!musicToggle) return;

        musicToggle.classList.toggle("enabled", musicEnabled);

        musicToggle.setAttribute(
            "aria-pressed",
            String(musicEnabled)
        );

    }


    function updateSoundButton() {

        if (!soundToggle) return;

        soundToggle.classList.toggle("enabled", soundsEnabled);

        soundToggle.setAttribute(
            "aria-pressed",
            String(soundsEnabled)
        );

    }


    if (musicToggle) {

        musicToggle.addEventListener("click", () => {

            musicEnabled = !musicEnabled;

            updateMusicButton();

            if (musicEnabled) {
                startMusic();
            } else if (backgroundMusic) {
                backgroundMusic.pause();
            }

        });

    }


    if (soundToggle) {

        soundToggle.addEventListener("click", () => {

            soundsEnabled = !soundsEnabled;

            updateSoundButton();

            showNotification(
                soundsEnabled
                    ? "Efectos de sonido activados"
                    : "Efectos de sonido desactivados"
            );

        });

    }


    /* ========================================================
       8. SISTEMA DE DIÁLOGOS
    ======================================================== */

    function showDialogue(dialogues, callback = null) {

        if (!dialogueContainer) return;

        dialogueList = dialogues;
        dialogueIndex = 0;
        dialogueCallback = callback;

        dialogueContainer.classList.add("show");
        dialogueContainer.setAttribute("aria-hidden", "false");

        displayDialogue();

    }


    function displayDialogue() {

        const dialogue = dialogueList[dialogueIndex];

        if (!dialogue) return;

        dialogueSpeaker.textContent = dialogue.speaker;
        dialogueText.textContent = dialogue.text;

        if (nextDialogueButton) {

            nextDialogueButton.textContent =
                dialogueIndex === dialogueList.length - 1
                    ? "Continuar →"
                    : "Siguiente →";

        }

        $$(".character").forEach(character => {
            character.classList.remove("speaking");
        });

        if (dialogue.character) {

            const activeCharacter =
                document.getElementById(dialogue.character);

            if (activeCharacter) {
                activeCharacter.classList.add("speaking");
            }

        }

        playSound();

    }


    function nextDialogue() {

        if (dialogueIndex < dialogueList.length - 1) {

            dialogueIndex++;

            displayDialogue();

            return;

        }

        const callback = dialogueCallback;

        hideDialogue();

        if (typeof callback === "function") {
            callback();
        }

    }


    function hideDialogue() {

        if (!dialogueContainer) return;

        dialogueContainer.classList.remove("show");
        dialogueContainer.setAttribute("aria-hidden", "true");

        $$(".character").forEach(character => {
            character.classList.remove("speaking");
        });

        dialogueList = [];
        dialogueIndex = 0;
        dialogueCallback = null;

    }


    if (nextDialogueButton) {
        nextDialogueButton.addEventListener("click", nextDialogue);
    }

    if (dialogueContainer) {
        dialogueContainer.addEventListener("click", (e) => {
            if (e.target !== nextDialogueButton) {
                nextDialogue();
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if ((e.code === "Space" || e.code === "Enter") && dialogueContainer && dialogueContainer.classList.contains("show")) {
            e.preventDefault();
            nextDialogue();
        }
    });


    /* ========================================================
       9. ANIMACIÓN DE PERSONAJES
    ======================================================== */

    function showCharacters() {

        const characters = $$(".character");

        characters.forEach((character, index) => {

            character.classList.remove("visible");

            setTimeout(() => {
                character.classList.add("visible");
            }, 300 + index * 450);

        });

    }


    function hideCharacters() {

        $$(".character").forEach(character => {

            character.classList.remove("visible");
            character.classList.remove("speaking");

        });

    }


    /* ========================================================
       10. DIÁLOGOS DE MIKE, LU Y OG
    ======================================================== */

    const islandDialogues = [

        {
            speaker: "Mike",
            character: "mike",
            text: "¡Eh! ¡Eh! ¡Lu! ¡Og! ¡Alguien acaba de llegar a nuestra isla!"
        },

        {
            speaker: "Lu",
            character: "lu",
            text: "Mike, no tienes que gritar. Ya la vimos llegar."
        },

        {
            speaker: "Og",
            character: "og",
            text: "¡Hola! ¡Bienvenida! ¿Vienes a pasar un día con nosotros?"
        },

        {
            speaker: "Mike",
            character: "mike",
            text: "¡Hoy no es un día cualquiera! Tenemos una misión muy importante."
        },

        {
            speaker: "Lu",
            character: "lu",
            text: "Y antes de que preguntes, sí, hemos preparado algo especial."
        },

        {
            speaker: "Og",
            character: "og",
            text: "¡Porque hoy es el cumpleaños de Angge!"
        },

        {
            speaker: "Mike",
            character: "mike",
            text: "¡Así que prepárate! ¡Esta aventura acaba de comenzar!"
        }

    ];


    /* ========================================================
       11. ESCENA INICIAL
    ======================================================== */

    // Ocultar pantalla de bienvenida al hacer clic en el boton o en la pantalla
    if (enterAdventureBtn) {
        enterAdventureBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            playSound();
            startMusic();
            hideLoadingScreen();
        });
    }

    if (loadingScreen) {
        loadingScreen.addEventListener("click", () => {
            hideLoadingScreen();
        });
    }

    if (startButton) {

        startButton.addEventListener("click", () => {

            playSound();

            startMusic();

            showScene("scene-island");

            showCharacters();

            showDialogue(islandDialogues, () => {

                showScene("scene-mission");

            });

        });

    }


    /* ========================================================
       12. ACEPTAR LA MISIÓN
    ======================================================== */

    if (missionButton) {

        missionButton.addEventListener("click", () => {

            playSound();

            showScene("scene-memories");

        });

    }


    /* ========================================================
       13. FOTOGRAFÍAS Y CARTA DE PERSONAJE (MODAL)
    ======================================================== */

    const characterCardsData = {
        funny: {
            photo: "angge-funny.jpg",
            badge: "✦ Angge • Pura Alegría ✦",
            sub: "✦ MOMENTO INOLVIDABLE ✦",
            title: "El brillo encantador de tu sonrisa",
            lead: "En este día tan especial nace una chica con un brillo encantador para hacer sonreír a los demás.",
            paragraphs: [
                "Angge tiene ese don único y genuino de iluminar cualquier rincón con su sola presencia. Su risa contagiosa, su espontaneidad y esa chispa tan auténtica tienen el poder mágico de transformar cualquier momento cotidiano en un recuerdo inolvidable lleno de alegría.",
                "Detrás de cada carcajada y ocurrencia divertida hay un corazón bondadoso que siempre busca ver felices a quienes la rodean. Es una persona que no solo alegra los días, sino que deja una huella imborrable en el alma de cada amigo y familiar.",
                "Hoy celebramos esa luz tan tuya que jamás debe apagarse. ¡Gracias por regalarnos sonrisas tan sinceras y por ser esa chica maravillosa e irrepetible!"
            ]
        },
        special: {
            photo: "angge-photo.jpg",
            badge: "✦ Angge • Luz y Ternura ✦",
            sub: "✦ INVITADA DE HONOR ✦",
            title: "Un corazón que deja huella en el mundo",
            lead: "Hay personas cuya esencia es como un abrazo cálido para el alma, y Angge es el más hermoso reflejo de ello.",
            paragraphs: [
                "En esta fecha tan significativa celebramos a una mujer verdaderamente admirable: noble, inteligente, sensible y con una fuerza interior que inspira a todos a ser mejores. Su mirada transmite serenidad y su calidez humana es un verdadero regalo para quienes caminan a su lado.",
                "Cada paso que da está lleno de gracia y generosidad. Es esa persona incondicional con quien siempre se puede contar, dueña de una belleza que va mucho más allá de lo visible, pues nace directamente de la pureza de su corazón.",
                "Que este nuevo año de vida te devuelva multiplicado todo el amor, la paz y las bendiciones que tú siembras a diario. ¡El mundo es infinitamente más hermoso contigo en él! ¡Muy feliz cumpleaños, Angge!"
            ]
        }
    };

    const characterModal = $("#character-card-modal");
    const closeLetterModalBtn = $("#close-letter-modal");
    const letterModalActionBtn = $("#letter-modal-action");
    const letterModalImg = $("#letter-modal-img");
    const letterModalBadge = $("#letter-modal-badge");
    const letterModalSub = $("#letter-modal-sub");
    const letterModalTitle = $("#letter-modal-title");
    const letterModalBody = $("#letter-modal-body");
    const characterBackdrop = characterModal ? characterModal.querySelector(".character-card-backdrop") : null;

    function openCharacterModal(type) {
        const data = characterCardsData[type] || characterCardsData.funny;
        if (!characterModal) return;

        if (letterModalImg) {
            letterModalImg.src = data.photo;
            letterModalImg.alt = data.title;
        }
        if (letterModalBadge) letterModalBadge.textContent = data.badge;
        if (letterModalSub) letterModalSub.textContent = data.sub;
        if (letterModalTitle) letterModalTitle.textContent = data.title;

        if (letterModalBody) {
            const paragraphsHtml = data.paragraphs.map(p => `<p>${p}</p>`).join("");
            letterModalBody.innerHTML = `
                <div class="lead-quote">"${data.lead}"</div>
                ${paragraphsHtml}
            `;
        }

        characterModal.classList.add("open");
        characterModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        playSound();
    }

    function closeCharacterModal() {
        if (!characterModal) return;
        characterModal.classList.remove("open");
        characterModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";

        playSound();
    }

    if (closeLetterModalBtn) {
        closeLetterModalBtn.addEventListener("click", closeCharacterModal);
    }
    if (letterModalActionBtn) {
        letterModalActionBtn.addEventListener("click", closeCharacterModal);
    }
    if (characterBackdrop) {
        characterBackdrop.addEventListener("click", closeCharacterModal);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && characterModal && characterModal.classList.contains("open")) {
            closeCharacterModal();
        }
    });

    const photoButtons = $$(".photo-message");

    photoButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();

            const charType = button.dataset.character || (button.closest(".photo-one") ? "funny" : "special");
            openCharacterModal(charType);

            photoButtons.forEach(btn => btn.classList.remove("selected"));
            button.classList.add("selected");
        });
    });


    if (continueMemoriesButton) {

        continueMemoriesButton.addEventListener("click", () => {

            playSound();

            showScene("scene-gift");

        });

    }


    /* ========================================================
       14. REGALO INTERACTIVO
    ======================================================== */

    function openGift() {

        if (!openGiftButton || !giftReveal) return;

        if (openGiftButton.classList.contains("opened")) return;

        openGiftButton.classList.add("opened");

        openGiftButton.setAttribute("aria-expanded", "true");

        giftReveal.classList.add("show");

        giftReveal.setAttribute("aria-hidden", "false");

        playSound();

    }


    if (openGiftButton) {
        openGiftButton.addEventListener("click", openGift);
    }


    if (continueGiftButton) {

        continueGiftButton.addEventListener("click", () => {

            const giftIsOpen =
                openGiftButton &&
                openGiftButton.classList.contains("opened");

            if (!giftIsOpen) {

                showNotification("¡Primero tienes que abrir el regalo!");

                return;

            }

            playSound();

            showScene("scene-letter");

        });

    }


    /* ========================================================
       15. CARTA INTERACTIVA
    ======================================================== */

    function openLetter() {

        if (!openLetterButton || !letterMessage) return;

        if (openLetterButton.classList.contains("opened")) return;

        openLetterButton.classList.add("opened");

        openLetterButton.setAttribute("aria-expanded", "true");

        letterMessage.classList.add("show");

        letterMessage.setAttribute("aria-hidden", "false");

        playSound();

    }


    if (openLetterButton) {
        openLetterButton.addEventListener("click", openLetter);
    }


    if (finishLetterButton) {

        finishLetterButton.addEventListener("click", () => {

            const letterIsOpen =
                openLetterButton &&
                openLetterButton.classList.contains("opened");

            if (!letterIsOpen) {

                showNotification("Primero abre tu carta.");

                return;

            }

            playSound();

            showScene("scene-finale");

        });

    }


    /* ========================================================
       16. REINICIAR TODA LA AVENTURA
    ======================================================== */

    function resetExperience() {

        hideDialogue();

        hideCharacters();

        // Reiniciar regalo.
        if (openGiftButton) {

            openGiftButton.classList.remove("opened");

            openGiftButton.setAttribute("aria-expanded", "false");

        }

        if (giftReveal) {

            giftReveal.classList.remove("show");

            giftReveal.setAttribute("aria-hidden", "true");

        }

        // Reiniciar carta.
        if (openLetterButton) {

            openLetterButton.classList.remove("opened");

            openLetterButton.setAttribute("aria-expanded", "false");

        }

        if (letterMessage) {

            letterMessage.classList.remove("show");

            letterMessage.setAttribute("aria-hidden", "true");

        }

        // Reiniciar fotografías.
        if (photoMessageDisplay) {

            photoMessageDisplay.textContent = "";

            photoMessageDisplay.classList.remove("show");

        }

        photoButtons.forEach(button => {
            button.classList.remove("selected");
        });

        // Regresar al principio.
        showScene("scene-intro");

    }


    if (restartButton) {

        restartButton.addEventListener("click", () => {

            playSound();

            resetExperience();

        });

    }


    /* ========================================================
       17. PARTÍCULAS DECORATIVAS
    ======================================================== */

    function createParticles(containerId, amount) {

        const container = document.getElementById(containerId);

        if (!container) return;

        // Evita duplicar partículas si se vuelve a inicializar.
        if (container.children.length > 0) return;

        const fragment = document.createDocumentFragment();

        for (let i = 0; i < amount; i++) {

            const particle = document.createElement("span");

            particle.className = "particle";

            particle.style.left = `${Math.random() * 100}%`;

            particle.style.top = `${Math.random() * 100}%`;

            particle.style.animationDelay =
                `${Math.random() * 5}s`;

            particle.style.animationDuration =
                `${3 + Math.random() * 5}s`;

            const size = 2 + Math.random() * 5;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            fragment.appendChild(particle);

        }

        container.appendChild(fragment);

    }


    function initializeParticles() {

        if (particlesInitialized) return;

        createParticles("intro-particles", 25);

        createParticles("island-particles", 35);

        createParticles("finale-particles", 45);

        particlesInitialized = true;

    }


    /* ========================================================
       18. INICIALIZACIÓN GENERAL
    ======================================================== */

    function initializeExperience() {

        showScene("scene-intro");

        hideCharacters();

        hideDialogue();

        updateMusicButton();

        updateSoundButton();

        initializeParticles();

        // La pantalla de carga desaparece al terminar
        // la inicialización.
        setTimeout(() => {
            hideLoadingScreen();
        }, 800);

        console.log("Angge Birthday Experience: inicializada correctamente.");

    }


    initializeExperience();


});
