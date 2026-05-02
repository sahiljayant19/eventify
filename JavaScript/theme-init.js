// Theme initialization - can be used on all pages
const THEME_STORAGE_KEY = 'eventifyTheme';

function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
        themeToggle.title = `Switch to ${nextTheme} mode`;
    }
}

// Apply theme on page load
applyTheme(getPreferredTheme());

// Add event listener to theme toggle if it exists
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const activeTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
            const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
            applyTheme(nextTheme);
        });
    }
});
