// Book Event page – details, payment, confirmation
document.addEventListener('DOMContentLoaded', () => {
    setupBookingForm();
    setupBookingFlowNavigation();
    initBookingFlow();
});

function initBookingFlow() {
    const params = new URLSearchParams(window.location.search);
    const step = params.get('step');
    const pendingBooking = localStorage.getItem('pendingBooking');
    const selectedEvent = JSON.parse(localStorage.getItem('selectedEvent') || 'null');

    if (step === 'payment' && pendingBooking) {
        showBookingStep('payment');
        if (typeof window.initPaymentPage === 'function') {
            window.initPaymentPage();
        }
        return;
    }

    if (pendingBooking && !selectedEvent) {
        showBookingStep('payment');
        if (typeof window.initPaymentPage === 'function') {
            window.initPaymentPage();
        }
        return;
    }

    if (!selectedEvent) {
        showBookingPageMessage('No event selected. <a href="index.html">Choose an event</a> to continue.', 'error');
        return;
    }

    const user = JSON.parse(localStorage.getItem('eventifyUser'));
    if (!user) {
        showBookingPageMessage('Please <a href="index.html">sign in</a> on the home page before booking.', 'error');
        return;
    }

    prefillBookingForm(selectedEvent);
    showBookingStep('details');
}

function setupBookingFlowNavigation() {
    const cancelBtn = document.getElementById('cancelBookingFlowBtn');
    const backBtn = document.getElementById('backToDetailsBtn');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            localStorage.removeItem('selectedEvent');
            localStorage.removeItem('pendingBooking');
            window.location.href = 'index.html';
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            showBookingStep('details');
        });
    }
}

function showBookingStep(step) {
    const detailsStep = document.getElementById('bookingDetailsStep');
    const paymentStep = document.getElementById('paymentStep');
    const confirmationStep = document.getElementById('confirmationStep');
    const progressSteps = document.querySelectorAll('#bookingProgress .progress-step');

    if (detailsStep) detailsStep.style.display = step === 'details' ? 'flex' : 'none';
    if (paymentStep) paymentStep.style.display = step === 'payment' ? 'block' : 'none';
    if (confirmationStep) confirmationStep.style.display = step === 'confirmation' ? 'flex' : 'none';

    progressSteps.forEach((el) => {
        const stepName = el.dataset.step;
        el.classList.remove('active', 'completed');
        if (stepName === step) {
            el.classList.add('active');
        } else if (
            (step === 'payment' && stepName === 'details') ||
            (step === 'confirmation' && (stepName === 'details' || stepName === 'payment'))
        ) {
            el.classList.add('completed');
        }
    });

    const heading = document.getElementById('bookingFlowHeading');
    if (heading) {
        if (step === 'details') heading.textContent = 'Book Tickets';
        else if (step === 'payment') heading.textContent = 'Complete Payment';
        else heading.textContent = 'Booking Confirmed';
    }
}

window.showBookingStep = showBookingStep;

function showBookingPageMessage(message, type = 'error') {
    const el = document.getElementById('bookingPageMessage');
    if (!el) return;
    el.innerHTML = message;
    el.className = `booking-page-message visible ${type}`;
}

window.showBookingPageMessage = showBookingPageMessage;

function parsePrice(text) {
    const match = String(text).replace(/,/g, '').match(/(\d+(\.\d+)?)/);
    if (!match) return 0;
    return Number(match[1]);
}

function formatBookingCurrency(amount) {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
}

function prefillBookingForm(eventData) {
    const bookingEventName = document.getElementById('bookingEventName');
    const bookingEventMeta = document.getElementById('bookingEventMeta');
    const bookingTickets = document.getElementById('bookingTickets');
    const bookingPricePerTicket = document.getElementById('bookingPricePerTicket');
    const bookingTotalAmount = document.getElementById('bookingTotalAmount');

    if (!bookingEventName) return;

    const price = eventData.pricePerTicket || 0;
    bookingEventName.value = eventData.eventName || 'Event';
    bookingEventMeta.value = eventData.eventMeta || '';
    bookingTickets.value = 1;
    bookingPricePerTicket.value = formatBookingCurrency(price);
    bookingTotalAmount.value = formatBookingCurrency(price);
}

function normalizeTicketCount(raw, applyLimits = true) {
    const trimmed = String(raw).trim();
    if (trimmed === '') {
        return applyLimits ? 1 : null;
    }
    const num = parseInt(trimmed, 10);
    if (!Number.isFinite(num)) {
        return applyLimits ? 1 : null;
    }
    if (!applyLimits) {
        return num;
    }
    return Math.min(10, Math.max(1, num));
}

function setupBookingForm() {
    const bookingForm = document.getElementById('bookingForm');
    const bookingTickets = document.getElementById('bookingTickets');
    const bookingPricePerTicket = document.getElementById('bookingPricePerTicket');
    const bookingTotalAmount = document.getElementById('bookingTotalAmount');

    if (!bookingForm || !bookingTickets) return;

    const updateTotalWhileTyping = () => {
        const price = parsePrice(bookingPricePerTicket.value);
        const raw = bookingTickets.value;

        if (raw.trim() === '') {
            bookingTotalAmount.value = formatBookingCurrency(0);
            return;
        }

        const num = parseInt(raw, 10);
        if (!Number.isFinite(num) || num < 1) {
            bookingTotalAmount.value = formatBookingCurrency(0);
            return;
        }

        const ticketsForTotal = Math.min(10, num);
        if (num > 10) {
            bookingTickets.value = '10';
        }

        bookingTotalAmount.value = formatBookingCurrency(ticketsForTotal * price);
    };

    const finalizeTicketInput = () => {
        const price = parsePrice(bookingPricePerTicket.value);
        const tickets = normalizeTicketCount(bookingTickets.value, true);
        bookingTickets.value = tickets;
        bookingTotalAmount.value = formatBookingCurrency(tickets * price);
    };

    bookingTickets.addEventListener('input', updateTotalWhileTyping);
    bookingTickets.addEventListener('blur', finalizeTicketInput);

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('eventifyUser'));
        if (!user) {
            showBookingPageMessage('Please <a href="index.html">sign in</a> before booking.', 'error');
            return;
        }

        const tickets = normalizeTicketCount(bookingTickets.value, true);
        bookingTickets.value = tickets;
        const pricePerTicket = parsePrice(bookingPricePerTicket.value);
        const totalAmount = tickets * pricePerTicket;

        const bookingData = {
            eventName: document.getElementById('bookingEventName').value,
            eventMeta: document.getElementById('bookingEventMeta').value,
            tickets,
            pricePerTicket,
            totalAmount,
            userId: user.id
        };

        localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
        localStorage.removeItem('selectedEvent');

        showBookingStep('payment');
        if (typeof window.initPaymentPage === 'function') {
            window.initPaymentPage();
        }
    });
}

window.showBookingConfirmation = function (bookingData) {
    const detailsEl = document.getElementById('confirmationDetails');
    if (detailsEl) {
        detailsEl.innerHTML = `
            <div class="ticket-row"><span>Event</span><span>${bookingData.eventName || '—'}</span></div>
            <div class="ticket-row"><span>Booking ID</span><span>${bookingData.bookingId || '—'}</span></div>
            <div class="ticket-row"><span>Tickets</span><span>${bookingData.tickets || 1}</span></div>
            <div class="ticket-row"><span>Total Paid</span><span>${formatBookingCurrency(bookingData.totalAmount || 0)}</span></div>
            <div class="ticket-row"><span>Payment</span><span>${bookingData.paymentMethod || 'UPI'}</span></div>
        `;
    }

    localStorage.removeItem('pendingBooking');
    localStorage.removeItem('selectedEvent');
    window.history.replaceState({}, '', 'book-event.html');

    showBookingStep('confirmation');
};
