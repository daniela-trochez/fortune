import { createFloatingCookie } from './cookie.js';

export function renderUniverse(container) {
  const wrapper = document.createElement('section');
  wrapper.className = 'universe';

  wrapper.innerHTML = `
    <div class="stars"></div>
    <div class="cookies-container"></div>
  `;

  container.appendChild(wrapper);

  const cookiesContainer = wrapper.querySelector('.cookies-container');

  // Hacer scroll vertical si hay muchas galletas
  cookiesContainer.style.position = 'relative';
  cookiesContainer.style.width = '100%';
  cookiesContainer.style.minHeight = '100vh';
  cookiesContainer.style.overflowY = 'auto';

  // Datos de ejemplo
  const cookiesData = [
    { content: "Esto me dio risa 😄", type: 'text', hint: 'Un momento divertido' },
    { content: "video1.mp4", type: 'video', hint: 'Una reflexión corta' },
    { content: "Poema de amor", type: 'text', hint: 'Inspiración poética' },
    { content: "Otro mensaje sorpresa", type: 'text', hint: 'Especial para ti' },
    { content: "Más risas 😆", type: 'text', hint: 'Un momento alegre' },
    { content: "Reflexión profunda", type: 'text', hint: 'Algo para pensar' }
  ];

 

  const cookieSize = 90; // px
  const margin = 15;     // mínimo entre galletas
  const placedCookies = [];

  // Área inicial centrada
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  cookiesData.forEach((data, index) => {
    setTimeout(() => {
      const cookie = createFloatingCookie(cookiesContainer, data.content, data.type, data.hint);

      // Intentamos posicionar cerca del centro, evitando choque
      let posX, posY;
      let tries = 0;
      const maxOffsetX = window.innerWidth / 3;  // ±1/3 ancho
      const maxOffsetY = window.innerHeight / 3; // ±1/3 alto

      do {
        posX = centerX + (Math.random() * 2 - 1) * maxOffsetX;
        posY = centerY + (Math.random() * 2 - 1) * maxOffsetY;

        // Limitar dentro de la pantalla
        posX = Math.max(margin, Math.min(window.innerWidth - cookieSize - margin, posX));
        posY = Math.max(margin, Math.min(window.innerHeight - cookieSize - margin, posY));

        tries++;
      } while (isOverlapping(posX, posY, cookieSize, placedCookies) && tries < 100);

      cookie.style.left = posX + 'px';
      cookie.style.top = posY + 'px';

      placedCookies.push({ x: posX, y: posY, size: cookieSize });

      // Animación flotante suave
      const floatDistance = 10 + Math.random() * 10;
      const floatDuration = 3000 + Math.random() * 2000;
      cookie.animate([
        { transform: 'translateY(0px)' },
        { transform: `translateY(-${floatDistance}px)` },
        { transform: 'translateY(0px)' }
      ], {
        duration: floatDuration,
        iterations: Infinity
      });

      cookie.classList.add('cookie-pulse');

    }, index * 400);
  });
}

// Función para comprobar si la nueva galleta chocaría con otras
function isOverlapping(x, y, size, placed) {
  for (let i = 0; i < placed.length; i++) {
    const c = placed[i];
    const dx = c.x - x;
    const dy = c.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < size + 10) { // 10px margen extra
      return true;
    }
  }
  return false;
}