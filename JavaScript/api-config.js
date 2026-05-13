const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

window.EVENTIFY_API_BASE_URL = isLocalhost
  ? 'http://localhost:8080/api'
  : 'https://eventify-b3n8.onrender.com/api';