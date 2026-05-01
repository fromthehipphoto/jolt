import * as state from './state.js';
import * as router from './router.js';
import * as views from './views.js';

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  });
}

// Routes
const routes = {
  '#onboard':  views.renderOnboarding,
  '#today':    views.renderToday,
  '#programs': views.renderPrograms,
  '#jess':     views.renderJess,
  '#progress': views.renderProgress,
  '#settings': views.renderSettings,
};

const root = document.getElementById('app');

// On first run, send to onboarding
function initialRoute() {
  const s = state.get();
  if (!s.profile) location.hash = '#onboard';
  else if (!location.hash || location.hash === '#') location.hash = '#today';
}

initialRoute();
router.init(root, routes);

// Re-tick messages periodically (every 5 min while app is open)
setInterval(() => {
  import('./messages.js').then((m) => m.tickMessages());
}, 5 * 60 * 1000);
