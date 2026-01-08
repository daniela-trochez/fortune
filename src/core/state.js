// src/core/state.js

export const STATES = {
  LOCKED: 'LOCKED',
  UNIVERSE: 'UNIVERSE',
};

let currentState = STATES.LOCKED;

const listeners = [];

export function getState() {
  return currentState;
}

export function setState(newState) {
  if (newState === currentState) return;

  currentState = newState;
  notify();
}

export function subscribe(listener) {
  listeners.push(listener);
}

function notify() {
  listeners.forEach((fn) => fn(currentState));
}
