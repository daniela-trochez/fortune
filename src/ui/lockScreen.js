import { CONFIG } from "../core/config.js";
import { setState, STATES } from "../core/state.js";

export function renderLockScreen(container) {
  const wrapper = document.createElement("section");
  wrapper.className = "lock-screen";

  wrapper.innerHTML = `
  <div class="lock-content">
    <p class="lock-hint">
      ¿Cuántos besos en Año Nuevo?
    </p>

    <input
      type="password"
      inputmode="numeric"
      pattern="[0-9]*"
      class="lock-input"
      aria-label="código"
      autocomplete="off"
    />

    <button class="lock-button">
      Entrar
    </button>

    <p class="lock-feedback"></p>
  </div>
`;

  const input = wrapper.querySelector(".lock-input");
  const feedback = wrapper.querySelector(".lock-feedback");
  const button = wrapper.querySelector(".lock-button");

  input.focus();

  input.addEventListener("input", () => {
    if (!input.value) {
      feedback.textContent = "";
    }
  });

  button.addEventListener("click", () => {
    if (!input.value) return;

    if (input.value === CONFIG.PASSWORD) {
      input.disabled = true;
      button.disabled = true;

      wrapper.classList.add("unlocking");
      feedback.textContent = CONFIG.SUCCESS_TEXT;

      setTimeout(() => {
        setState(STATES.UNIVERSE);
      }, CONFIG.TRANSITION_DELAY);
    } else if (feedback.textContent !== CONFIG.FAIL_TEXT) {
      feedback.textContent = CONFIG.FAIL_TEXT;
    }
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      button.click();
    }
  });

  container.appendChild(wrapper);
}
