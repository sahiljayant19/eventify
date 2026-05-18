// DOM elements – navigation & UI
const toggleNav = document.getElementById('tgl');
const menu = document.getElementById('menu');
const nav = document.getElementById('nav');
const search = document.getElementById('search');
const myBookingLink = document.getElementById('myBookingLink');
const homeLink = document.getElementById('homeLink')
const aboutLink = document.getElementById('aboutLink')
const supportLink = document.getElementById('supportLink')
const themeToggle = document.getElementById('themeToggle');

// Auth modal & views
const authModal = document.getElementById('authModal');
const registerView = document.getElementById('registerView');
const loginView = document.getElementById('loginView');

const toLogin = document.getElementById('toLogin');
const toRegister = document.getElementById('toRegister');
const closeModal = document.getElementById('closeModal');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userDisplayName = document.getElementById('userDisplayName');
const userIcon = document.getElementById('userIcon');
const authBox = document.getElementById('authBox');

const registerName = document.getElementById('registerName');
const registerEmail = document.getElementById('registerEmail');
const registerBtn = document.getElementById('registerBtn');
const registerPassword = document.querySelectorAll('.registerPassword');

// Login inputs
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginBtn = document.getElementById('loginBtn');


// Element visibility arrays
const show_el = [search, signInBtn, userDisplayName, signOutBtn, myBookingLink, homeLink, aboutLink, supportLink];
const hide_el = [toggleNav, search, signInBtn, userDisplayName, signOutBtn];

export { toggleNav, menu, nav, search, myBookingLink, homeLink, aboutLink, supportLink, themeToggle, authModal, registerView, loginView, toLogin, toRegister, closeModal, signInBtn, signOutBtn, userDisplayName, userIcon, authBox, registerName, registerEmail, registerBtn, registerPassword, loginEmail, loginPassword, loginBtn, show_el, hide_el };
