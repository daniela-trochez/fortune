export function renderState(state) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  switch (state) {
    case STATES.LOCKED:
      renderLockScreen(app);
      break;
    case STATES.UNIVERSE:
      renderUniverse(app);
      break;
  }
}
