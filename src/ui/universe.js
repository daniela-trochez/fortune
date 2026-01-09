// renderUniverse.js
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

  const cookiesData = [
    { content: "Esto me dio risa", type: 'text', hint: 'Un momento divertido' },
    { content: "video1.mp4", type: 'video', hint: 'Una reflexión corta' },
    { content: "Poema de amor", type: 'text', hint: 'Inspiración poética' },
    { content: "Otro mensaje sorpresa", type: 'text', hint: 'Especial para ti' },
    { content: "Más risas", type: 'text', hint: 'Un momento alegre' },
    { content: "Reflexión profunda", type: 'text', hint: 'Algo para pensar' }
  ];

  // 📱 Función para posicionar galletas desde el CENTRO sin colisiones
  function positionCookies() {
    const { width, height } = cookiesContainer.getBoundingClientRect();
    
    // Tamaño adaptativo según pantalla
    let cookieSize = 90;
    if (width < 480) cookieSize = 55;       // móvil pequeño
    else if (width < 768) cookieSize = 65;  // móvil/tablet
    
    const padding = 15;
    const minDistance = cookieSize + 15; // distancia mínima entre galletas
    
    // Centro de la pantalla
    const centerX = width / 2;
    const centerY = height / 2;
    
    const positions = []; // guardar posiciones ya usadas
    
    // Función para verificar si una posición colisiona
    function hasCollision(newX, newY) {
      return positions.some(pos => {
        const dx = newX - pos.x;
        const dy = newY - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance;
      });
    }
    
    cookiesData.forEach((data, index) => {
      const cookie = createFloatingCookie(
        cookiesContainer,
        data.content,
        data.type,
        data.hint
      );

      let x, y;
      let attempts = 0;
      const maxAttempts = 50;
      
      // Intentar encontrar posición sin colisión
      do {
        const randomX = (Math.random() - 0.5) * width * 0.6;
        const randomY = (Math.random() - 0.5) * height * 0.6;
        
        const baseX = centerX + randomX - cookieSize / 2;
        const baseY = centerY + randomY - cookieSize / 2;
        
        x = Math.max(padding, Math.min(width - cookieSize - padding, baseX));
        y = Math.max(padding, Math.min(height - cookieSize - padding, baseY));
        
        attempts++;
      } while (hasCollision(x, y) && attempts < maxAttempts);
      
      // Guardar posición
      positions.push({ x, y });

      cookie.style.left = `${x}px`;
      cookie.style.top = `${y}px`;
      cookie.style.width = `${cookieSize}px`;
      cookie.style.height = `${cookieSize}px`;

      // Flotación sutil
      const floatDistance = cookieSize * 0.15;
      cookie.animate(
        [
          { transform: 'translateY(0)' },
          { transform: `translateY(-${floatDistance}px)` },
          { transform: 'translateY(0)' }
        ],
        {
          duration: 3000 + Math.random() * 2000,
          iterations: Infinity,
          easing: 'ease-in-out',
          delay: Math.random() * 1000
        }
      );
    });
  }

  // Esperar al layout y posicionar
  requestAnimationFrame(() => {
    positionCookies();
  });

  // 🔄 Re-posicionar en resize (con debounce)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Limpiar galletas anteriores
      cookiesContainer.innerHTML = '';
      positionCookies();
    }, 250);
  });
}