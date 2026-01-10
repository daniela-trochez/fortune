// renderUniverse.js
import { createFloatingCookie } from './cookie.js';

export function renderUniverse(container) {
  const wrapper = document.createElement('section');
  wrapper.className = 'universe';

  wrapper.innerHTML = `
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
      setTimeout(typeWriter, 80); // velocidad de escritura (50ms por letra)
    }
  }

  // Iniciar efecto
  setTimeout(typeWriter, 500); // espera 500ms antes de empezar

  const cookiesData = [
    { content: "/public/assets/video/meme1.mp4", type: 'video', hint: 'Es hora de un meme' },
    { content: "/public/assets/video/hora-aventura.mp4", type: 'video', hint: 'Hay valor en todo lo verdadero ...' },
    { content: "/public/assets/video/alma-pedazos.mp4", type: 'video', hint: 'Tengo el alma en pedazos' },
    { content: "/public/assets/video/gatito-serio.mp4", type: 'video', hint: 'Te presento a un gatito serio' },
    { content: "/public/assets/video/ganar-perdiendo.mp4", type: 'video', hint: 'Gracias por existir; coincidir tuvo sentido.' },
    { content: "/public/assets/video/shakira-sol.mp4", type: 'video', hint: '...cosas lindas ... vos y shaki' },
    { content: "/public/assets/video/irrepetible.mp4", type: 'video', hint: '...Tu forma no se repite.' },
    { content: "/public/assets/video/recuerda.mp4", type: 'video', hint: 'No corras. Respira' },
    { content: "/public/assets/video/lohicistebien.mp4", type: 'video', hint: 'Hay días en que recordar basta.' },
    { content: "/public/assets/video/corazon.mp4", type: 'video', hint: 'Tu corazón fuerte y el mio queriendose salir' },
    

   
  ];

  // 📱 Función para posicionar galletas desde el CENTRO sin colisiones
  function positionCookies() {
    const { width, height } = cookiesContainer.getBoundingClientRect();
    
    // Tamaño adaptativo según pantalla
    let cookieSize = 90;
    if (width < 480) cookieSize = 55;       // móvil pequeño
    else if (width < 768) cookieSize = 65;  // móvil/tablet
    
    const padding = 15;
    const topPadding = 120; // espacio extra arriba para el texto
    const minDistance = cookieSize + 15; // distancia mínima entre galletas
    
    // Centro de la pantalla (ajustado hacia abajo por el texto)
    const centerX = width / 2;
    const centerY = (height + topPadding) / 2;
    
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
        y = Math.max(topPadding, Math.min(height - cookieSize - padding, baseY)); // respeta topPadding
        
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