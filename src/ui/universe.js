// src/ui/universe.js

export function renderUniverse(container) {
  const div = document.createElement('div');
  div.innerHTML = `
    <p style="color: white; text-align: center;">
      UNIVERSE
    </p>
  `;
  container.appendChild(div);
}
