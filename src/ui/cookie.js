// cookie.js

export function createFloatingCookie(container, content = null, type = 'text', hint = '') {
  const cookie = document.createElement('div');
  cookie.className = 'cookie';
  cookie.dataset.content = content || '';
  cookie.dataset.type = type;
  cookie.dataset.hint = hint;

  container.appendChild(cookie);

  cookie.dataset.state = 'closed';
  cookie._overlay = null;

  cookie.addEventListener('click', () => {
    openCookieOverlay(cookie);
  });

  return cookie;
}

function openCookieOverlay(cookie) {
  if (!cookie._overlay || !document.body.contains(cookie._overlay)) {
    cookie._overlay = showOverlayTitleWithTip(cookie.dataset.hint, cookie);
    cookie.classList.add('cookie-active');
    cookie.dataset.state = 'opened';
  }
}

function showOverlayTitleWithTip(title, cookie) {
  const overlay = document.createElement('div');
  overlay.className = 'cookie-overlay title-only';
  overlay.innerHTML = `
    <div class="cookie-box">
      <p class="cookie-hint"></p>
      <p class="cookie-tip">Toca para ver</p>
    </div>
  `;

  document.body.appendChild(overlay);

  // ⌨️ Efecto máquina de escribir para el hint
  const hintElement = overlay.querySelector('.cookie-hint');
  let charIndex = 0;

  function typeHint() {
    if (charIndex < title.length) {
      hintElement.textContent += title.charAt(charIndex);
      charIndex++;
      setTimeout(typeHint, 60);
    } else {
      // 👈 Quitar clase 'typing' cuando termina
      hintElement.classList.remove('typing');
    }
  }

  setTimeout(typeHint, 300);

  overlay.addEventListener('click', () => {
    revealCookieContentInOverlay(
      overlay,
      cookie.dataset.type,
      cookie.dataset.content,
      cookie
    );
  });

  return overlay;
}

function revealCookieContentInOverlay(overlay, type, content, cookie) {
  overlay.classList.remove('title-only');
  overlay.innerHTML = `
    <div class="cookie-box">
      ${type === 'text' ? `<p class="cookie-content">${content}</p>` : ''}
      ${type === 'video' ? `
  <div class="video-wrapper">
    <video src="${content}" controls autoplay></video>
    <div class="video-overlay"></div>
  </div>
` : ''}
      <button class="close-cookie">Cerrar</button>
    </div>
  `;

  overlay.querySelector('.close-cookie').addEventListener('click', () => {
    overlay.remove();
    cookie.classList.remove('cookie-active');
    cookie.classList.add('cookie-opened');
  });
}
