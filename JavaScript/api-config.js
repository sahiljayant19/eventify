const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

const isPrivateNetworkHost =
    /^10\./.test(window.location.hostname) ||
    /^192\.168\./.test(window.location.hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(window.location.hostname);

window.EVENTIFY_API_BASE_URL = isLocalhost
    ? 'http://localhost:5000/api'
    : isPrivateNetworkHost
        ? `http://${window.location.hostname}:5000/api`
        : 'https://eventify-b3n8.onrender.com/api';


