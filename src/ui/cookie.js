export function createFloatingCookie(container, content = null, type = 'text', hint = '') {
  const cookie = document.createElement('div');
  cookie.className = 'cookie floating';
  cookie.dataset.content = content || '';
  cookie.dataset.type = type;
  cookie.dataset.hint = hint;

  container.appendChild(cookie);

  // Posición aleatoria
  const x = Math.random() * 90 + 5;
  const y = Math.random() * 80 + 5;
  cookie.style.left = x + 'vw';
  cookie.style.top = y + 'vh';

  // Animación flotante
  cookie.animate([
    { transform: 'translateY(0px)' },
    { transform: 'translateY(-15px)' },
    { transform: 'translateY(0px)' }
  ], {
    duration: 3000 + Math.random() * 2000,
    iterations: Infinity
  });

  // Estado inicial
  cookie.dataset.state = 'closed'; // closed, opened
  cookie._overlay = null;

  // Click en la galleta → abrir overlay siempre que se desee
  cookie.addEventListener('click', () => {
    openCookieOverlay(cookie);
  });

  return cookie;
}

// Función para abrir overlay (galleta abierta o previamente cerrada)
function openCookieOverlay(cookie) {
  // Si ya existe overlay y no está en el DOM → volver a crear
  if (!cookie._overlay || !document.body.contains(cookie._overlay)) {
    cookie._overlay = showOverlayTitleWithTip(cookie.dataset.hint, cookie);
    cookie.classList.add('cookie-active');
    cookie.dataset.state = 'opened';
  }
}

// Overlay con título y tip (segundo toque sobre él para mostrar contenido)
function showOverlayTitleWithTip(title, cookie) {
  const overlay = document.createElement('div');
  overlay.className = 'cookie-overlay title-only';
  overlay.innerHTML = `
    <div class="cookie-box">
      <p class="cookie-hint">${title}</p>
      <p class="cookie-tip">Toca aquí para ver el contenido</p>
    </div>
  `;

  document.body.appendChild(overlay);

  // Segundo toque sobre el overlay → revela contenido
  overlay.addEventListener('click', () => {
    revealCookieContentInOverlay(overlay, cookie.dataset.type, cookie.dataset.content, cookie);
  });

  return overlay;
}

// Mostrar contenido dentro del mismo overlay
function revealCookieContentInOverlay(overlay, type, content, cookie) {
  if (!overlay) return;

  overlay.classList.remove('title-only');
  overlay.innerHTML = `
    <div class="cookie-box">
      ${type === 'text' ? `<p class="cookie-content">${content}</p>` : ''}
      ${type === 'video' ? `<video src="${content}" controls autoplay></video>` : ''}
      <button class="close-cookie">Cerrar</button>
    </div>
  `;

  // Cerrar solo con botón
  overlay.querySelector('.close-cookie').addEventListener('click', () => {
    overlay.remove();
    cookie.classList.remove('cookie-active');
    cookie.classList.add('cookie-opened'); // apagada visualmente pero reabrible
  });
}
