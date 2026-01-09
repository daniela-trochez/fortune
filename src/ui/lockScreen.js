import { CONFIG } from "../core/config.js";
import { setState, STATES } from "../core/state.js";

export function renderLockScreen(container) {
  const wrapper = document.createElement("section");
  wrapper.className = "lock-screen";

  wrapper.innerHTML = `
    <video
      class="bg-video"
      src="/public/assets/video/del_rio.mp4"
      autoplay
      muted
      loop
      playsinline
    ></video>

    <button class="sound-toggle" aria-label="Activar sonido">
      🔇
    </button>

    <div class="lock-content">
      <p class="lock-hint">¿Cuántos besos en Año Nuevo?</p>

      <!-- CONTENEDOR DEL INPUT + OJO -->
    <div class="password-field">
      <input
        type="password"
        inputmode="text"
        class="lock-input"
        aria-label="código"
        autocomplete="off"
      />

      <button
        type="button"
        class="password-toggle"
        aria-label="Mostrar contraseña"
      >
        👁
      </button>
    </div>

    <button class="lock-button">Entrar</button>
    <p class="lock-feedback"></p>
  </div>
`;

  const video = wrapper.querySelector(".bg-video");
  const soundBtn = wrapper.querySelector(".sound-toggle");
  const input = wrapper.querySelector(".lock-input");
  const feedback = wrapper.querySelector(".lock-feedback");
  const button = wrapper.querySelector(".lock-button");

  const passwordField = wrapper.querySelector(".password-field");
  const toggle = wrapper.querySelector(".password-toggle");

/* ---- TOGGLE PASSWORD VISIBILITY ---- */
toggle.addEventListener("click", () => {
  const isHidden = input.type === "password";

  input.type = isHidden ? "text" : "password";

  // accesibilidad + estado visual
  toggle.setAttribute(
    "aria-label",
    isHidden ? "Ocultar contraseña" : "Mostrar contraseña"
  );
});

  /* ---- AUDIO CONTROL ---- */
  soundBtn.addEventListener("click", () => {
    video.pause();
    video.currentTime = 0;
    video.muted = false;

    video.play().catch(() => {
      console.warn("No se pudo reproducir con audio");
    });

    soundBtn.classList.add("hidden");
  });

 /* ---- PASSWORD FLOW ---- */
input.focus();

input.addEventListener("input", () => {
  feedback.textContent = "";

  const passwordField = input.closest(".password-field");
  const hasValue = input.value.length > 0;

  if (passwordField) {
    passwordField.classList.toggle("has-value", hasValue);
  }

  // 🔐 Si se borra el texto, forzar modo password
  if (!hasValue && input.type === "text") {
    input.type = "password";
  }
});


button.addEventListener("click", () => {
  if (!input.value) return;

  const normalizedInput = input.value
    .trim()
    .toLowerCase();

  const isValid = CONFIG.PASSWORDS.includes(normalizedInput);

  if (isValid) {
    input.disabled = true;
    button.disabled = true;

    wrapper.classList.add("unlocking");
    feedback.textContent = CONFIG.SUCCESS_TEXT;

    setTimeout(() => {
      setState(STATES.UNIVERSE);
    }, CONFIG.TRANSITION_DELAY);
  } else {
    feedback.textContent = CONFIG.FAIL_TEXT;
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") button.click();
});

container.appendChild(wrapper);
}