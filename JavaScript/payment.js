// Payment Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('Payment page loaded');
    loadBookingDetails();
    setupPaymentTabs();
    // Add a small delay to ensure booking details are loaded before generating QR code
    setTimeout(() => {
        generateQRCode();
    }, 500);
    startPaymentStatusCheck();
    setupCardFormatting();
});

// Load booking details from localStorage or URL parameters
function loadBookingDetails() {
    console.log('Loading booking details...');
    const bookingData = JSON.parse(localStorage.getItem('pendingBooking'));

    console.log('Booking data:', bookingData);

    if (!bookingData) {
        showPopupMessage('No Booking Data', 'No booking data found. Please start your booking again.', 'error');
        window.location.href = 'index.html';
        return;
    }

    // Update summary with error handling
    try {
        const eventNameEl = document.getElementById('summaryEventName');
        const eventMetaEl = document.getElementById('summaryEventMeta');
        const ticketsEl = document.getElementById('summaryTickets');
        const pricePerTicketEl = document.getElementById('summaryPricePerTicket');
        const totalAmountEl = document.getElementById('summaryTotalAmount');
        const qrAmountEl = document.getElementById('qrAmount');
        const cardAmountEl = document.getElementById('cardAmount');
        const bankAmountEl = document.getElementById('bankAmount');
        const bookingIdEl = document.getElementById('bookingId');

        if (eventNameEl) eventNameEl.textContent = bookingData.eventName || 'Event Name';
        if (eventMetaEl) eventMetaEl.textContent = bookingData.eventMeta || 'Event Details';
        if (ticketsEl) ticketsEl.textContent = bookingData.tickets || 1;
        if (pricePerTicketEl) pricePerTicketEl.textContent = formatCurrency(bookingData.pricePerTicket || 0);
        if (totalAmountEl) totalAmountEl.textContent = formatCurrency(bookingData.totalAmount || 0);
        if (qrAmountEl) qrAmountEl.textContent = formatCurrency(bookingData.totalAmount || 0);
        if (cardAmountEl) cardAmountEl.textContent = formatCurrency(bookingData.totalAmount || 0);
        if (bankAmountEl) bankAmountEl.textContent = formatCurrency(bookingData.totalAmount || 0);

        // Generate booking ID
        const bookingId = 'EVT' + Date.now().toString().slice(-8);
        if (bookingIdEl) bookingIdEl.textContent = bookingId;

        // Store booking data for payment processing
        localStorage.setItem('currentBookingId', bookingId);

        console.log('Booking details loaded successfully');
    } catch (error) {
        console.error('Error loading booking details:', error);
        showPopupMessage('Error', 'Error loading booking details. Please try again.', 'error');
    }
}

// Setup payment method tabs
function setupPaymentTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const paymentSections = document.querySelectorAll('.payment-content-section');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const method = button.dataset.method;

            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show corresponding payment section
            paymentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${method}-payment`).classList.add('active');
        });
    });
}

// Generate QR Code for UPI payment using real QR code library
function generateQRCode() {
    console.log('Generating QR code...');
    const bookingData = JSON.parse(localStorage.getItem('pendingBooking'));
    const bookingId = document.getElementById('bookingId')?.textContent;

    if (!bookingData) {
        console.error('No booking data for QR code');
        return;
    }

    // UPI payment string format
    const upiId = '9079184709@ybl';
    const amount = bookingData.totalAmount;
    const transactionNote = `Eventify Booking - ${bookingId}`;

    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=Eventify&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

    console.log('UPI URL:', upiUrl);

    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded');
        // Fallback to Google Charts API
        generateQRCodeGoogleCharts(upiUrl);
        return;
    }

    try {
        // Clear any existing QR code
        const qrContainer = document.getElementById('qrcode');
        if (qrContainer) {
            qrContainer.innerHTML = '';

            // Generate QR code using the library
            new QRCode(qrContainer, {
                text: upiUrl,
                width: 200,
                height: 200,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H
            });

            // Add instructions
            const instructions = document.createElement('p');
            instructions.style.cssText = 'font-size: 0.8em; color: #666; margin-top: 10px;';
            instructions.textContent = 'Scan with any UPI app';
            qrContainer.appendChild(instructions);

            console.log('QR code generated successfully');
        }
    } catch (error) {
        console.error('Error generating QR code:', error);
        // Fallback to Google Charts API
        generateQRCodeGoogleCharts(upiUrl);
    }
}

// Generate QR Code using Google Charts API as fallback
function generateQRCodeGoogleCharts(text) {
    console.log('Using Google Charts API fallback...');

    const qrContainer = document.getElementById('qrcode');
    if (!qrContainer) return;

    qrContainer.innerHTML = '';

    // Create img element for Google Charts QR code
    const img = document.createElement('img');
    img.src = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(text)}&choe=UTF-8`;
    img.alt = 'Payment QR Code';
    img.style.border = '1px solid #ddd';
    img.borderRadius = '8px';

    img.onload = function () {
        console.log('Google Charts QR code loaded successfully');
        // Add instructions
        const instructions = document.createElement('p');
        instructions.style.cssText = 'font-size: 0.8em; color: #666; margin-top: 10px;';
        instructions.textContent = 'Scan with any UPI app';
        qrContainer.appendChild(instructions);
    };

    img.onerror = function () {
        console.error('Google Charts QR code failed to load');
        // Final fallback - show manual instructions
        qrContainer.innerHTML = `
            <div style="padding: 20px; text-align: center; border: 2px dashed var(--border-muted); border-radius: 10px; background: var(--surface-muted);">
                <p style="color: var(--text-secondary); margin-bottom: 15px; font-weight: bold; font-size: 1.05em;">QR Code temporarily unavailable</p>
                <p style="font-size: 1em; color: var(--text-muted); margin-bottom: 15px;">Please use the UPI ID below to pay:</p>
                <p style="font-size: 1.15em; color: var(--text-primary); font-weight: bold;">9079184709@ybl</p>
                <p style="font-size: 1em; color: var(--text-secondary); margin-top: 10px;">Amount: ₹${JSON.parse(localStorage.getItem('pendingBooking'))?.totalAmount || 0}</p>
            </div>
        `;
    };

    qrContainer.appendChild(img);
}

// Start payment status checking
function startPaymentStatusCheck() {
    const statusElement = document.getElementById('paymentStatus');

    if (!statusElement) return;

    // Show waiting status indefinitely until manual confirmation
    statusElement.innerHTML = `
    <div class="status-pending">
    <div class="spinner"></div>
    <p>Waiting for payment...</p>
    <small>
    Please complete the payment using your UPI app.<br>
    This page will update automatically once payment is received.
    </small>
    </div>
    `;

    // Add manual confirmation button for testing
    setTimeout(() => {
        const manualConfirmBtn = document.createElement('button');
        manualConfirmBtn.textContent = 'I have completed the payment';
        manualConfirmBtn.style.cssText = `
            margin-top: 15px;
            padding: 12px 24px;
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        `;
        manualConfirmBtn.onclick = confirmPayment;
        statusElement.appendChild(manualConfirmBtn);
    }, 5000);
}

// Confirm payment and redirect
function confirmPayment() {
    confirmPaymentWithMethod('UPI');
}

// Save booking to backend
async function saveBookingToBackend(bookingData, bookingId) {
    try {
        const user = JSON.parse(localStorage.getItem('eventifyUser'));

        // Log user info for debugging
        console.log('Current user:', user);
        console.log('User ID:', user?.id);

        const payload = {
            eventName: bookingData.eventName,
            eventMeta: bookingData.eventMeta,
            tickets: bookingData.tickets,
            pricePerTicket: bookingData.pricePerTicket,
            totalAmount: bookingData.totalAmount,
            bookingId: bookingId,
            userId: user ? user.id : null,
            paymentMethod: bookingData.paymentMethod || 'UPI',
            paymentStatus: 'completed',
            timestamp: new Date().toISOString()
        };

        console.log('Saving booking to backend:', payload);
        console.log(`Backend URL: ${window.EVENTIFY_API_BASE_URL}/bookings`);

        const response = await fetch(`${window.EVENTIFY_API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Backend response status:', response.status);
        console.log('Backend response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to save booking to backend. Status:', response.status);
            console.error('Error response:', errorText);

            try {
                const errorData = JSON.parse(errorText);
                console.error('Parsed error data:', errorData);
                showPopupMessage('Booking Error', errorData.message || errorData.error || 'Failed to save booking', 'error');
            } catch {
                showPopupMessage('Booking Error', `Failed to save booking. Status: ${response.status}`, 'error');
            }
            return;
        }

        const result = await response.json();
        console.log('Booking saved successfully:', result);

    } catch (error) {
        console.error('Network error saving booking:', error);
        showPopupMessage('Network Error', 'Booking confirmed but failed to save to server. Please check your internet connection and ensure the backend is running.', 'error');
    }
}

// Setup card input formatting
function setupCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');

    if (cardNumber) {
        // Format card number (add spaces every 4 digits)
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }

    if (expiryDate) {
        // Format expiry date (MM/YY)
        expiryDate.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }

    if (cvv) {
        // Only allow numbers for CVV
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
        });
    }
}

// Process card payment
function processCardPayment() {
    const cardNumber = document.getElementById('cardNumber')?.value;
    const expiryDate = document.getElementById('expiryDate')?.value;
    const cvv = document.getElementById('cvv')?.value;
    const cardholderName = document.getElementById('cardholderName')?.value;

    // Basic validation
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        showPopupMessage('Missing Information', 'Please fill in all card details', 'error');
        return;
    }

    if (cardNumber.replace(/\s/g, '').length < 16) {
        showPopupMessage('Invalid Card', 'Please enter a valid card number', 'error');
        return;
    }

    // Simulate card processing
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Processing...';

    setTimeout(() => {
        confirmPaymentWithMethod('Credit/Debit Card');
    }, 2000);
}

// Process net banking payment
function processNetBanking() {
    const bankSelect = document.getElementById('bankSelect');

    if (!bankSelect?.value) {
        showPopupMessage('Bank Required', 'Please select your bank', 'error');
        return;
    }

    // Simulate redirect to bank
    const button = event.target;
    button.disabled = true;
    button.textContent = 'Redirecting to bank...';

    setTimeout(() => {
        confirmPaymentWithMethod('Net Banking');
    }, 2000);
}

// Confirm payment with specific method
function confirmPaymentWithMethod(paymentMethod) {
    const bookingData = JSON.parse(localStorage.getItem('pendingBooking'));
    const bookingId = document.getElementById('bookingId')?.textContent;

    if (!bookingData || !bookingId) {
        showPopupMessage('Booking Error', 'Booking information not found', 'error');
        return;
    }

    // Update status
    const statusElement = document.getElementById('paymentStatus');
    if (statusElement) {
        statusElement.innerHTML = `
            <div class="status-success">
                <img src="Resource/svg/check.svg" alt="Success" class="status-icon">
                <p>Payment Successful!</p>
            </div>
        `;
        const statusContainer = statusElement.closest('.payment-status');
        if (statusContainer) {
            statusContainer.style.borderColor = '#28a745';
            statusContainer.style.background = 'linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(32, 201, 151, 0.08) 100%)';
        }
    }

    // Store booking data for confirmation page
    const confirmationData = {
        ...bookingData,
        bookingId: bookingId,
        paymentMethod: paymentMethod,
        paymentStatus: 'completed'
    };
    localStorage.setItem('pendingBooking', JSON.stringify(confirmationData));

    // Save booking to backend
    saveBookingToBackend(confirmationData, bookingId);

    // Show success message and redirect to home
    setTimeout(() => {
        showPopupMessage(
            'Payment Successful!',
            'Your booking has been confirmed. Click OK to go to the home page.',
            'success',
            () => {
                localStorage.removeItem('pendingBooking');
                window.location.href = 'index.html';
            }
        );
    }, 2000);
}

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

// Format currency
function formatCurrency(amount) {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
}
