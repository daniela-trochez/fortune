// src/main.js

import { STATES, subscribe, getState } from './core/state.js';
import { renderLockScreen } from './ui/lockScreen.js';
import { renderUniverse } from './ui/universe.js';

const app = document.getElementById('app');

function render(state) {
  app.innerHTML = '';

  switch (state) {
    case STATES.LOCKED:
      renderLockScreen(app);
      break;

    case STATES.UNIVERSE:
      renderUniverse(app);
      break;

    default:
      console.warn('Estado desconocido:', state);
  }
}

// primera renderización
render(getState());

// escuchar cambios de estado
subscribe(render);
