// Variables are defined in variables.js (loaded before this file)
import { toggleNav, menu, nav, myBookingLink, homeLink, aboutLink, supportLink, themeToggle, authModal, registerView, loginView, toLogin, toRegister, closeModal, signInBtn, signOutBtn, userDisplayName, userIcon, authBox, registerName, registerEmail, registerBtn, registerPassword, loginEmail, loginPassword, loginBtn, show_el, hide_el } from './variables.js';

// Get mobile navigation links element
const mobileNavLinks = document.querySelector('.mobile-nav-links');

let menuClicked = false;
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
    if (themeToggle) {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
        themeToggle.title = `Switch to ${nextTheme} mode`;
    }
}

applyTheme(getPreferredTheme());

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const activeTheme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
        const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
    });
}

// Clear all authentication form fields for security
function clearAuthFields() {
    // Clear login fields
    if (loginEmail) loginEmail.value = '';
    if (loginPassword) loginPassword.value = '';

    // Clear registration fields
    if (registerName) registerName.value = '';
    if (registerEmail) registerEmail.value = '';
    if (registerPassword) {
        registerPassword.forEach(field => field.value = '');
    }
}

// Show elements to prevent showing elements in mobile screen during click like search box and sign in button
function showElements(element) {
    element.style.display = 'block';
}

function hideElements(element) { // hide elements to prevent showing elements in mobile screen during click like search box and sign in button
    element.style.display = 'none';
}

// Helper to sync navbar auth UI with stored user
function applyStoredUserToNavbar() {
    try {
        const stored = localStorage.getItem('eventifyUser');
        if (stored) {
            const user = JSON.parse(stored);
            const displayName = user.username || user.email;
            if (displayName) {
                signInBtn.style.display = 'none';
                userDisplayName.textContent = displayName;
                userDisplayName.style.display = 'inline-block';
                userIcon.style.display = 'inline-block';
                signOutBtn.style.display = 'inline-block';
                return;
            }
        }
        // Default state when no user stored or invalid user data
        userDisplayName.textContent = '';
        userDisplayName.style.display = 'none';
        userIcon.style.display = 'none';
        signOutBtn.style.display = 'none';
        signInBtn.style.display = 'inline-block';
    } catch (e) {
        console.error('Failed to read stored user', e);
        // Default state on error
        userDisplayName.textContent = '';
        userDisplayName.style.display = 'none';
        userIcon.style.display = 'none';
        signOutBtn.style.display = 'none';
        signInBtn.style.display = 'inline-block';
    }
}

window.addEventListener('resize', () => {
    if (window.innerWidth > 600) { // Runtime condition
        nav.style.height = '64px';
        toggleNav.style.display = 'flex';
        // Hide mobile navigation links when going to desktop view
        if (mobileNavLinks) {
            mobileNavLinks.style.display = 'none';
        }
        show_el.map(showElements);
        // Re-apply auth UI state so sign in doesn't reappear when logged in
        applyStoredUserToNavbar();
        menuClicked = false; // prevent to disappear showing elements in mobile screen during click like search box and sign in button
        menu.innerHTML = `<img src="Resource/img/menu.png" alt="" width="30px" id="menuImg">`;
    }
    else if (window.innerWidth <= 600 && menuClicked == false) { // Runtime condition
        hide_el.map(hideElements);
    }
});

menu.addEventListener('click', () => {
    menuClicked = true; // menuClicked will be true if user clicks on menu button
    if (toggleNav.style.display == 'flex') { // Condition for hide elements
        menu.innerHTML = `<img src="Resource/img/menu.png" alt="" width="30px" id="menuImg">`
        nav.style.height = '64px';
        // Hide mobile navigation links
        if (mobileNavLinks) {
            mobileNavLinks.style.display = 'none';
        }
        setTimeout(() => {
            hide_el.map(hideElements);
        }, 50);
    }
    else { // Condition for show elements
        menu.innerHTML = `<img src="Resource/img/close.png" alt="" width="25px" id="menuImg">`
        nav.style.transition = '0.5s';
        nav.style.height = '400px';
        setTimeout(() => {
            toggleNav.style.display = 'flex';
            // Show mobile navigation links
            if (mobileNavLinks) {
                mobileNavLinks.style.display = 'flex';
            }
            show_el.map(showElements);
            // Ensure auth UI stays consistent when menu opens in mobile view
            applyStoredUserToNavbar();
        }, 100);
    }
});

signInBtn.addEventListener('click', () => { // show authentication modal when user clicks on sign in button
    clearAuthFields();
    authModal.style.display = 'flex';

});

// Switch to Login
toLogin.addEventListener('click', () => { // switch to login view when user clicks on login button
    clearAuthFields(); // Clear fields for security when switching
    authBox.style.height = "430px";
    switchView(loginView, registerView);
});

// Switch to Register
toRegister.addEventListener('click', () => { // switch to register view when user clicks on register button
    clearAuthFields(); // Clear fields for security when switching
    authBox.style.height = "580px";
    switchView(registerView, loginView);
});


// For animation
function switchView(showView, hideView) { // switch view from login to register and vice versa but with animation
    // 1. Hide the current view immediately
    hideView.style.display = 'none';
    hideView.classList.remove('animate-view');

    // 2. Show the new view
    showView.style.display = 'block';

    // 3. Trigger the animation
    showView.classList.add('animate-view');
}


// Close Modal
closeModal.addEventListener('click', () => { // close authentication modal when user clicks on close button
    authModal.style.display = 'none';
});

window.addEventListener('click', (e) => { // close authentication modal / booking modal when user clicks outside the modal
    if (e.target === authModal) authModal.style.display = 'none';
    if (e.target === bookingModal) bookingModal.style.display = 'none';
});



function checkEmail(email) { // check if the email is valid
    const invalidChars = ` !&*"'\\,:;<>()[]{}|/`;

    for (const ch of invalidChars) { // it will check whether the given registerEmailhas invalid character or not.
        if (email.includes(ch)) {
            return false;
        }
    }
    let emailValidCondition_1 = (email.includes('@googlemail.com') || email.includes('@gmail.com' || email.includes('@email.com')))
    let emailValidCondition_2 = (email.endsWith('.com'));

    if (emailValidCondition_1 === true && emailValidCondition_2 === true) {
        return true
    }
    return false;
}


registerEmail.addEventListener('input', () => {

})


registerBtn.addEventListener('click', () => {
    const name = registerName.value.trim();
    const register_email = registerEmail.value.trim();
    const passwords = Array.from(registerPassword).map(p => p.value);

    if (!name || !register_email || passwords.some(p => !p)) {
        alert("Please fill up the details");
        return;
    }

    if (passwords[0] !== passwords[1]) {
        alert("Passwords do not match");
        return;
    }

    const emailOk = checkEmail(register_email);
    if (!emailOk) {
        alert("Invalid Email");
        return;
    }

    const payload = {
        username: name,
        email: register_email,
        password: passwords[0]
    };

    fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(async (res) => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data.error || 'Registration failed';
                throw new Error(msg);
            }
            return res.json();
        })
        .then((data) => {
            alert('Registration successful! You can now log in.');
            // Clear fields
            registerName.value = "";
            registerEmail.value = "";
            registerPassword.forEach(p => p.value = "");
            // Switch to login view
            authBox.style.height = "430px";
            switchView(loginView, registerView);
        })
        .catch((err) => {
            console.error(err);
            alert(err.message || 'Could not register. Make sure backend is running.');
        });
})

// Login
loginBtn.addEventListener('click', () => {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    const payload = { email, password };

    fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(async (res) => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                const msg = data.error || 'Login failed';
                throw new Error(msg);
            }
            return res.json();
        })
        .then((data) => {
            const user = data.user || data;
            const displayName = user.username || user.email;
            showPopupMessage('Login Successful!', `Welcome back, ${displayName}!`, 'success');
            // store basic user info in localStorage (no JWT yet)
            localStorage.setItem('eventifyUser', JSON.stringify(user));
            // update navbar: hide sign in, show name + sign out + user icon
            signInBtn.style.display = 'none';
            userDisplayName.textContent = displayName;
            userDisplayName.style.display = 'inline-block';
            userIcon.style.display = 'inline-block';
            signOutBtn.style.display = 'inline-block';
            authModal.style.display = 'none';

            // Force immediate display update
            setTimeout(() => {
                userDisplayName.style.display = 'inline-block';
                userIcon.style.display = 'inline-block';
            }, 100);
        })
        .catch((err) => {
            console.error(err);
            alert(err.message || 'Could not login. Make sure backend is running.');
        });
});

// On page load, keep user logged-in display if info exists
window.addEventListener('DOMContentLoaded', () => {
    applyStoredUserToNavbar();
    // Hide mobile navigation links by default
    if (mobileNavLinks) {
        mobileNavLinks.style.display = 'none';
    }
});

// Sign out: clear local storage and restore Sign in button
signOutBtn.addEventListener('click', () => {
    showSignOutConfirmation();
});

// ---------------- BOOKING FLOW ----------------

const bookButtons = document.querySelectorAll('.book-btn');
const bookingModal = document.getElementById('bookingModal');
const closeBookingModal = document.getElementById('closeBookingModal');
const bookingForm = document.getElementById('bookingForm');
const bookingEventName = document.getElementById('bookingEventName');
const bookingEventMeta = document.getElementById('bookingEventMeta');
const bookingTickets = document.getElementById('bookingTickets');
const bookingPricePerTicket = document.getElementById('bookingPricePerTicket');
const bookingTotalAmount = document.getElementById('bookingTotalAmount');

function parsePrice(text) {
    // Expect formats like "₹999 onwards"
    const match = text.replace(/,/g, '').match(/(\d+(\.\d+)?)/);
    if (!match) return 0;
    return Number(match[1]);
}

function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

bookButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.event-card');
        if (!card) return;

        const titleEl = card.querySelector('h3');
        const metaEl = card.querySelector('.location');
        const priceEl = card.querySelector('.price');


        const eventName = titleEl ? titleEl.textContent.trim() : 'Event';
        const eventMeta = metaEl ? metaEl.textContent.replace(/\s+/g, ' ').trim() : '';

        const priceText = priceEl ? priceEl.textContent.trim() : '';

        const price = parsePrice(priceText);

        bookingEventName.value = eventName;
        bookingEventMeta.value = eventMeta;
        bookingTickets.value = 1;
        bookingPricePerTicket.value = formatCurrency(price);
        bookingTotalAmount.value = formatCurrency(price);

        bookingModal.style.display = 'flex';
    });
});

closeBookingModal.addEventListener('click', () => {
    bookingModal.style.display = 'none';
});

bookingTickets.addEventListener('input', () => {
    const tickets = Math.max(1, Number(bookingTickets.value) || 1);
    bookingTickets.value = tickets;

    const priceText = bookingPricePerTicket.value;
    const price = parsePrice(priceText);
    const total = tickets * price;
    bookingTotalAmount.value = formatCurrency(total);
});

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('eventifyUser'));
    if (!user) {
        alert('Please sign in to make a booking');
        return;
    }

    const tickets = Number(bookingTickets.value) || 1;
    const pricePerTicket = parsePrice(bookingPricePerTicket.value);
    const totalAmount = tickets * pricePerTicket;

    const bookingData = {
        eventName: bookingEventName.value,
        eventMeta: bookingEventMeta.value,
        tickets,
        pricePerTicket,
        totalAmount,
        userId: user.id
    };

    // Save booking data to localStorage for payment page
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));

    // Redirect to payment page
    window.location.href = 'payment.html';
});

// ---------------- POPUP FUNCTIONS ----------------

// Show themed popup message
function showPopupMessage(title, message, type = 'success', callback = null) {
    // Remove any existing popup and overlay
    const existingPopup = document.querySelector('.eventify-popup');
    const existingOverlay = document.querySelector('.popup-overlay');
    if (existingPopup) existingPopup.remove();
    if (existingOverlay) existingOverlay.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const icon = type === 'success'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    const popup = document.createElement('div');
    popup.className = 'eventify-popup';

    popup.innerHTML = `
        <div class="popup-icon-container ${type}">
            ${icon}
        </div>
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="popup-button-group">
            <button class="popup-btn popup-btn-primary">OK</button>
        </div>
    `;

    // Add click handler to OK button
    const okButton = popup.querySelector('.popup-btn-primary');
    okButton.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
        if (callback) callback();
    });

    // Add overlay and popup to body
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Show sign out confirmation popup
function showSignOutConfirmation() {
    // Remove any existing popup and overlay
    const existingPopup = document.querySelector('.eventify-popup');
    const existingOverlay = document.querySelector('.popup-overlay');
    if (existingPopup) existingPopup.remove();
    if (existingOverlay) existingOverlay.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    const popup = document.createElement('div');
    popup.className = 'eventify-popup';

    popup.innerHTML = `
        <div class="popup-icon-container error">
            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <h3>Sign Out</h3>
        <p>Do you really want to sign out? You'll need to log in again to access your account.</p>
        <div class="popup-button-group">
            <button class="popup-btn popup-btn-secondary cancel-signout-btn">Cancel</button>
            <button class="popup-btn popup-btn-danger confirm-signout-btn">Sign Out</button>
        </div>
    `;

    // Add click handlers
    const cancelBtn = popup.querySelector('.cancel-signout-btn');
    const confirmBtn = popup.querySelector('.confirm-signout-btn');

    cancelBtn.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });

    confirmBtn.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
        proceedWithSignOut();
    });

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Proceed with sign out
function proceedWithSignOut() {
    localStorage.removeItem('eventifyUser');
    userDisplayName.textContent = '';
    userDisplayName.style.display = 'none';
    userIcon.style.display = 'none';
    signOutBtn.style.display = 'none';
    signInBtn.style.display = 'inline-block';

    // Show success message
    showPopupMessage('Signed Out', 'You have been successfully signed out.', 'success');
}
// Genre Filtering Logic
document.addEventListener('DOMContentLoaded', () => {
    const genreFilters = document.querySelectorAll('.genre-filter');
    const eventCards = document.querySelectorAll('.event-card');
    const movieHeading = document.querySelector('.movie-heading');

    if (genreFilters.length > 0 && eventCards.length > 0) {
        genreFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                const selectedGenre = filter.getAttribute('data-genre');

                // Update active state in nav
                genreFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                // Update heading
                if (movieHeading) {
                    movieHeading.textContent = selectedGenre === 'all'
                        ? 'Recommended Events'
                        : `${selectedGenre} Events`;
                }

                // Filter cards
                eventCards.forEach(card => {
                    const tagEl = card.querySelector('.tag');
                    if (!tagEl) return;

                    const cardTag = tagEl.textContent.trim();

                    if (selectedGenre === 'all' || cardTag.toLowerCase() === selectedGenre.toLowerCase()) {
                        card.style.display = 'block';
                        // Add fade-in animation
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });

            });
        });
    }
});
