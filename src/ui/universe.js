// renderUniverse.js
import { createFloatingCookie } from './cookie.js';

export function renderUniverse(container) {
  const wrapper = document.createElement('section');
  wrapper.className = 'universe';

  wrapper.innerHTML = `
    <div class="universe-bg"></div>
    <div class="stars"></div>
    <div class="typewriter-container">
      <p class="typewriter-text"></p>
    </div>
    <div class="cookies-container"></div>
  `;

  container.appendChild(wrapper);

  const cookiesContainer = wrapper.querySelector('.cookies-container');
  const typewriterText = wrapper.querySelector('.typewriter-text');

  // ⌨️ Efecto máquina de escribir
  const message = "Bienvenida a este espacio, ahora quiero que descubras qué trae cada fortuna, espero que te guste";
  let charIndex = 0;

  function typeWriter() {
    if (charIndex < message.length) {
      typewriterText.textContent += message.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 50);
    }
  }

  setTimeout(typeWriter, 500);

  const cookiesData = [
    { content: "/public/assets/video/meme1.mp4", type: 'video', hint: 'Es hora de un meme' },
    { content: "/public/assets/video/hora-aventura.mp4", type: 'video', hint: 'Hay valor en todo lo verdadero ...' },
    { content: "/public/assets/video/alma-pedazos.mp4", type: 'video', hint: '___Hoy tengo el alma en pedazos' },
    { content: "/public/assets/video/gatito-serio.mp4", type: 'video', hint: 'Te presento a un gatito serio' },
    { content: "/public/assets/video/ganar-perdiendo.mp4", type: 'video', hint: 'Gracias por existir; coincidir tuvo sentido.' },
    { content: "/public/assets/video/shakira-sol.mp4", type: 'video', hint: 'Cosas lindas ... Vos y shaki' },
    { content: "/public/assets/video/irrepetible.mp4", type: 'video', hint: '...Tu forma no se repite.' },
    { content: "/public/assets/video/recuerda.mp4", type: 'video', hint: 'No corras. Respira' },
    { content: "/public/assets/video/lohicistebien.mp4", type: 'video', hint: 'Buen dia ...' },
    { content: "/public/assets/video/corazon.mp4", type: 'video', hint: 'Tu corazón fuerte y el mio queriendose salir' },
    { content: "No importa lo ocupada que estés, no olvides descansar,comer bien y cuidar de ti 💫", type: 'text', hint: '' },
    { content: "/public/assets/textos/nota-esperar.html", type: 'text-file', hint: '' },
    { content: "El equilibrio no siempre es simetría. A veces es solo una tolerancia precisa al desorden", type: 'text', hint: '' },
    { content: "...No todo dolor pide arreglo.", type: 'text', hint: '' },
    { content: "/public/assets/video/mychemical.mp4", type: 'video', hint: 'Cabe una tumba para ti, que en cualquier contexto romantizarías' },
    {
      content: "/public/assets/images/jeinyophelia-copy.jpg",
      type: "image"
    }
  ];

  // 📱 Función para posicionar galletas desde el CENTRO sin colisiones
  function positionCookies() {
    const { width } = cookiesContainer.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Tamaño adaptativo según pantalla
    let cookieSize = 90;
    if (width < 480) cookieSize = 55;
    else if (width < 768) cookieSize = 65;

    const padding = 15;
    const topPadding = 150; // 👈 Más espacio para evitar el texto (era 120)
    const bottomPadding = 50;
    const minDistance = cookieSize * 1.3;

    // 📊 Área disponible REAL para las galletas
    const usableHeight = viewportHeight - topPadding - bottomPadding;
    const usableWidth = width - padding * 2;
    const availableArea = usableWidth * usableHeight;
    const cookieArea = cookieSize * cookieSize * 2.5;
    const theoreticalCapacity = Math.floor(availableArea / cookieArea);

    const canFitAll = cookiesData.length <= theoreticalCapacity;

    const centerX = width / 2;
    const centerY = topPadding + (usableHeight / 2); // 👈 Centro ajustado
    const positions = [];

    function hasCollision(centerX, centerY) {
      return positions.some(pos => {
        const dx = centerX - pos.centerX;
        const dy = centerY - pos.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });
    }

    let maxY = topPadding;

    cookiesData.forEach((data, index) => {
      const cookie = createFloatingCookie(
        cookiesContainer,
        data.content,
        data.type,
        data.hint
      );

      let x, y, cookieCenterX, cookieCenterY;
      let attempts = 0;
      const maxAttempts = canFitAll ? 250 : 120;

      // 🎯 Límite máximo Y (no puede pasar de aquí si caben todas)
      let maxAllowedY = canFitAll
        ? viewportHeight - bottomPadding - cookieSize
        : viewportHeight * 2; // Si no caben, puede expandirse

      do {
        // Variación más controlada alrededor del centro
        const randomX = (Math.random() - 0.5) * usableWidth * 0.8;
        const randomY = (Math.random() - 0.5) * usableHeight * 0.8;

        const baseX = centerX + randomX - cookieSize / 2;
        const baseY = centerY + randomY - cookieSize / 2;

        x = Math.max(padding, Math.min(width - cookieSize - padding, baseX));
        y = Math.max(topPadding, Math.min(maxAllowedY, baseY)); // 👈 Respeta límite

        cookieCenterX = x + cookieSize / 2;
        cookieCenterY = y + cookieSize / 2;

        attempts++;

        // Solo expandir si realmente NO caben
        if (!canFitAll && attempts === 80) {
          maxAllowedY = viewportHeight * 1.5;
        }
        if (!canFitAll && attempts === 160) {
          maxAllowedY = viewportHeight * 3;
        }

      } while (hasCollision(cookieCenterX, cookieCenterY) && attempts < maxAttempts);

      // Fallback: apilar verticalmente solo si agotó intentos
      if (attempts >= maxAttempts) {
        y = maxY + minDistance;
        x = centerX - cookieSize / 2 + (Math.random() - 0.5) * (usableWidth * 0.3);
        x = Math.max(padding, Math.min(width - cookieSize - padding, x));
        cookieCenterX = x + cookieSize / 2;
        cookieCenterY = y + cookieSize / 2;
      }

      positions.push({
        centerX: cookieCenterX,
        centerY: cookieCenterY
      });

      maxY = Math.max(maxY, y + cookieSize);

      cookie.style.left = `${x}px`;
      cookie.style.top = `${y}px`;
      cookie.style.width = `${cookieSize}px`;
      cookie.style.height = `${cookieSize}px`;

      // 🎨 Fade-in escalonado dinámico
      cookie.style.opacity = '0';
      cookie.style.animation = `cookieFadeIn 0.6s ease-out ${index * 0.15}s forwards`;

      const floatDistance = cookieSize * 0.08;
      cookie.animate(
        [
          { transform: 'translateY(0)' },
          { transform: `translateY(-${floatDistance}px)` },
          { transform: 'translateY(0)' }
        ],
        {
          duration: 4000 + Math.random() * 2000,
          iterations: Infinity,
          easing: 'ease-in-out',
          delay: Math.random() * 1000
        }
      );
    });

    // 📏 Altura final: solo scroll si realmente excede
    if (maxY + bottomPadding > viewportHeight) {
      cookiesContainer.style.height = `${maxY + bottomPadding}px`;
    } else {
      cookiesContainer.style.height = '100vh';
    }
  }

  requestAnimationFrame(() => {
    positionCookies();
  });

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      cookiesContainer.innerHTML = '';
      positionCookies();
    }, 250);
  });
}