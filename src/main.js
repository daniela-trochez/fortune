// src/main.js

import { STATES, subscribe, getState } from './core/state.js';
import { renderLockScreen } from './ui/lockScreen.js';
import { renderUniverse } from './ui/universe.js';

const app = document.getElementById('app');

function render(state) {
  // Si hay contenido previo, hacer fade-out primero
  if (app.children.length > 0) {
    app.classList.add('fade-out');
    
    setTimeout(() => {
      app.innerHTML = '';
      renderNewState(state);
      
      // Fade-in del nuevo contenido
      requestAnimationFrame(() => {
        app.classList.remove('fade-out');
        app.classList.add('fade-in');
        
        setTimeout(() => {
          app.classList.remove('fade-in');
        }, 100);
      });
    }, 100); // Espera que termine el fade-out
  } else {
    // Primera carga, sin transición
    renderNewState(state);
  }
}

function renderNewState(state) {
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