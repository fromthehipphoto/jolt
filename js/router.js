// Hash-based router. routes is { '#today': renderFn, ... }
let _routes = {};
let _shell = null;

export function init(shell, routes) {
  _shell = shell;
  _routes = routes;
  window.addEventListener('hashchange', render);
  render();
  document.addEventListener('state:change', render);
}

export function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

function render() {
  const hash = location.hash || '#today';
  _shell.innerHTML = '';
  if (hash.startsWith('#workout/')) {
    const key = hash.split('/')[1];
    import('./views.js').then((v) => v.renderWorkout(_shell, key));
    return;
  }
  const fn = _routes[hash] || _routes['#today'];
  fn(_shell);
  _shell.scrollTo?.(0, 0);
}
