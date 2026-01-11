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
    
    // ✨ TEXTO corto → Abrir directo con typewriter
    if (cookie.dataset.type === 'text') {
      cookie._overlay = showTextDirectly(cookie.dataset.content, cookie);
    }
    // 📖 TEXTO largo (archivo) → Cargar y mostrar
    else if (cookie.dataset.type === 'text-file') {
      cookie._overlay = showTextFromFile(cookie.dataset.content, cookie);
    }
    // 🎬 VIDEO → Mostrar hint primero
    else {
      cookie._overlay = showOverlayTitleWithTip(cookie.dataset.hint, cookie);
    }
    
    cookie.classList.add('cookie-active');
    cookie.dataset.state = 'opened';
  }
}

// 📖 Función para cargar y mostrar texto desde archivo
async function showTextFromFile(filePath, cookie) {
  const overlay = document.createElement('div');
  overlay.className = 'cookie-overlay';
  overlay.innerHTML = `
    <div class="cookie-box">
      <div class="cookie-content-long">
        <p style="text-align: center; opacity: 0.6;">Cargando...</p>
      </div>
      <button class="close-cookie">Cerrar</button>
    </div>
  `;

  document.body.appendChild(overlay);

  try {
    const response = await fetch(filePath);
    const html = await response.text();
    
    const contentElement = overlay.querySelector('.cookie-content-long');
    contentElement.innerHTML = html;
    
    // ⌨️ Typewriter solo para el título (strong)
    const title = contentElement.querySelector('strong');
    const paragraphs = contentElement.querySelectorAll('p');
    
    if (title) {
      const titleText = title.textContent;
      title.textContent = '';
      title.classList.add('typing');
      
      let charIndex = 0;
      function typeTitle() {
        if (charIndex < titleText.length) {
          title.textContent += titleText.charAt(charIndex);
          charIndex++;
          setTimeout(typeTitle, 40); // 👈 Rápido para el título
        } else {
          title.classList.remove('typing');
          // Mostrar párrafos con fade-in suave
          paragraphs.forEach((p, i) => {
            p.style.opacity = '0';
            setTimeout(() => {
              p.style.transition = 'opacity 0.6s ease';
              p.style.opacity = '1';
            }, i * 150); // Aparecen uno tras otro
          });
        }
      }
      
      setTimeout(typeTitle, 300);
    }
    
  } catch (error) {
    overlay.querySelector('.cookie-content-long').innerHTML = 
      '<p style="color: #ff6b6b;">No se pudo cargar el contenido</p>';
  }

  // ✨ Fade out al cerrar
  overlay.querySelector('.close-cookie').addEventListener('click', () => {
    overlay.classList.add('fade-out-overlay');
    setTimeout(() => {
      overlay.remove();
      cookie.classList.remove('cookie-active');
      cookie.classList.add('cookie-opened');
      cookie._overlay = null; // 👈 Permitir reabrir
    }, 400);
  });

  return overlay;
}

// 📝 Función para mostrar texto directamente con efecto typewriter
function showTextDirectly(content, cookie) {
  const overlay = document.createElement('div');
  overlay.className = 'cookie-overlay';
  overlay.innerHTML = `
    <div class="cookie-box">
      <p class="cookie-content typing"></p>
      <button class="close-cookie">Cerrar</button>
    </div>
  `;

  document.body.appendChild(overlay);

  // ⌨️ Efecto máquina de escribir
  const contentElement = overlay.querySelector('.cookie-content');
  let charIndex = 0;

  function typeContent() {
    if (charIndex < content.length) {
      contentElement.textContent += content.charAt(charIndex);
      charIndex++;
      setTimeout(typeContent, 60);
    } else {
      contentElement.classList.remove('typing');
    }
  }

  setTimeout(typeContent, 300);

  // ✨ Fade out al cerrar
  overlay.querySelector('.close-cookie').addEventListener('click', () => {
    overlay.classList.add('fade-out-overlay');
    setTimeout(() => {
      overlay.remove();
      cookie.classList.remove('cookie-active');
      cookie.classList.add('cookie-opened');
      cookie._overlay = null; // 👈 Permitir reabrir
    }, 400); // Tiempo del fade-out
  });

  return overlay;
}

// 🎬 Función para mostrar hint de video (paso 1)
function showOverlayTitleWithTip(title, cookie) {
  const overlay = document.createElement('div');
  overlay.className = 'cookie-overlay title-only';
  overlay.innerHTML = `
    <div class="cookie-box">
      <p class="cookie-hint typing"></p>
      <p class="cookie-tip">Toca para ver</p>
    </div>
  `;

  document.body.appendChild(overlay);

  const hintElement = overlay.querySelector('.cookie-hint');
  let charIndex = 0;

  function typeHint() {
    if (charIndex < title.length) {
      hintElement.textContent += title.charAt(charIndex);
      charIndex++;
      setTimeout(typeHint, 60);
    } else {
      hintElement.classList.remove('typing');
    }
  }

  setTimeout(typeHint, 300);

  // Solo el overlay (fondo)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      revealCookieContentInOverlay(
        overlay,
        cookie.dataset.type,
        cookie.dataset.content,
        cookie
      );
    }
  });
  
  // La caja también puede abrirlo
  overlay.querySelector('.cookie-box').addEventListener('click', () => {
    revealCookieContentInOverlay(
      overlay,
      cookie.dataset.type,
      cookie.dataset.content,
      cookie
    );
  });

  return overlay;
}

// 🎬 Mostrar video (paso 2)
function revealCookieContentInOverlay(overlay, type, content, cookie) {
  overlay.classList.remove('title-only');
  
  overlay.innerHTML = `
    <div class="cookie-box">
      <div class="video-wrapper">
        <video src="${content}" controls autoplay></video>
        <div class="video-overlay"></div>
      </div>
      <button class="close-cookie">Cerrar</button>
    </div>
  `;

  // Prevenir que clicks en el video activen el overlay
  const videoWrapper = overlay.querySelector('.video-wrapper');
  if (videoWrapper) {
    videoWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // ✨ Fade out al cerrar
  overlay.querySelector('.close-cookie').addEventListener('click', () => {
    overlay.classList.add('fade-out-overlay');
    setTimeout(() => {
      overlay.remove();
      cookie.classList.remove('cookie-active');
      cookie.classList.add('cookie-opened');
    }, 400);
  });
}