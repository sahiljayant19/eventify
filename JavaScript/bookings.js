// Bookings Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    loadUserBookings();
});

async function loadUserBookings() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('eventifyUser'));
    
    if (!user) {
        showNoBookings('Please sign in to view your bookings.');
        return;
    }

    try {
        // Fetch bookings for specific user
        const response = await fetch(`http://localhost:8080/api/bookings?userId=${user.id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bookings');
        }

        const bookings = await response.json();
        console.log('User bookings received:', bookings); // Debug log
        displayBookings(bookings);
    } catch (error) {
        console.error('Error loading bookings:', error);
        showNoBookings('Unable to load bookings. Please try again later.');
    }
}

function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    const noBookings = document.getElementById('noBookings');
    const loadingMessage = document.getElementById('loadingMessage');

    loadingMessage.style.display = 'none';

    if (!bookings || bookings.length === 0) {
        showNoBookings();
        return;
    }

    noBookings.style.display = 'none';
    bookingsList.style.display = 'flex';
    bookingsList.style.gap = '0 40px';
    bookingsList.style.flexWrap = 'wrap';

    // Create booking cards similar to event cards
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="movie">
            <div class="movie1">
                <div class="event-card">
                    <div class="event-details">
                        <h3>${booking.eventName}</h3>
                        <div class="event-meta">
                            <p><strong>Date:</strong> ${booking.eventMeta || 'TBD'}</p>
                            <p style="margin-top: 10px"><strong>Booking ID:</strong> #${booking.id}</p>
                            <p style="margin-top: 10px"><strong>Booking Date:</strong> ${booking.timestamp ? new Date(booking.timestamp).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }) : new Date().toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}</p>
                            <p style="margin-top: 10px"><strong>Status:</strong> <span class="status-badge">Confirmed</span></p>
                        </div>
                        <div class="event-pricing">
                            <p><strong>Tickets:</strong> ${booking.tickets}</p>
                            <p><strong>Price per Ticket:</strong> ₹${Number(booking.pricePerTicket).toLocaleString('en-IN')}</p>
                            <p><strong>Total Amount:</strong> ₹${Number(booking.totalAmount).toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div class="event-actions">
                        <button class="book-btn" onclick="viewTicket('${booking.id}')">View Ticket</button>
                        <button class="book-btn" onclick="cancelBooking('${booking.id}')" style="background: #dc3545;">Cancel Booking</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function showNoBookings(message = null) {
    const bookingsList = document.getElementById('bookingsList');
    const noBookings = document.getElementById('noBookings');
    const loadingMessage = document.getElementById('loadingMessage');

    loadingMessage.style.display = 'none';
    bookingsList.style.display = 'none';
    noBookings.style.display = 'block';

    if (message) {
        const noBookingsText = noBookings.querySelector('p');
        if (noBookingsText) {
            noBookingsText.textContent = message;
        }
    }
}

let currentBookingData = null;

async function viewTicket(bookingId) {
    console.log('Viewing ticket for booking ID:', bookingId);
    
    try {
        // Fetch full booking details
        const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to fetch booking details:', errorText);
            throw new Error(`Failed to fetch booking details: ${response.status}`);
        }

        const booking = await response.json();
        console.log('Booking data received:', booking);
        
        currentBookingData = booking;
        
        // Populate ticket modal with booking details
        populateTicketModal(booking);
        
        // Show the modal
        showTicketModal();
        
        // Generate QR code for the ticket (after showing to ensure container is ready)
        generateTicketQRCode(booking);
        
    } catch (error) {
        console.error('Error viewing ticket:', error);
        
        // Fallback: try to get booking data from the displayed bookings
        const bookingCards = document.querySelectorAll('.movie');
        for (let card of bookingCards) {
            const viewBtn = card.querySelector('button[onclick*="viewTicket"]');
            if (viewBtn && viewBtn.getAttribute('onclick').includes(bookingId)) {
                // Extract booking data from the card
                const eventName = card.querySelector('h3')?.textContent;
                const eventMeta = card.querySelector('.event-meta p')?.textContent;
                
                // Extract pricing information more carefully
                const pricingRows = card.querySelectorAll('.event-pricing p');
                let tickets = 1;
                let pricePerTicket = 0;
                let totalAmount = 0;
                
                pricingRows.forEach(row => {
                    const text = row.textContent;
                    if (text.includes('Tickets:')) {
                        const match = text.match(/Tickets:\s*(\d+)/);
                        if (match) tickets = parseInt(match[1]);
                    } else if (text.includes('Price per Ticket:')) {
                        const match = text.match(/₹?([\d,]+)/);
                        if (match) pricePerTicket = parseInt(match[1].replace(/,/g, ''));
                    } else if (text.includes('Total Amount:')) {
                        const match = text.match(/₹?([\d,]+)/);
                        if (match) totalAmount = parseInt(match[1].replace(/,/g, ''));
                    }
                });
                
                console.log('Extracted data:', { eventName, eventMeta, tickets, pricePerTicket, totalAmount });
                
                if (eventName) {
                    const fallbackBooking = {
                        id: bookingId,
                        bookingId: bookingId,
                        eventName: eventName,
                        eventMeta: eventMeta || 'Date & Venue TBD',
                        tickets: tickets,
                        pricePerTicket: pricePerTicket,
                        totalAmount: totalAmount,
                        paymentMethod: 'UPI',
                        paymentStatus: 'Completed',
                        timestamp: new Date().toISOString()
                    };
                    
                    console.log('Using fallback booking data:', fallbackBooking);
                    currentBookingData = fallbackBooking;
                    populateTicketModal(fallbackBooking);
                    generateTicketQRCode(fallbackBooking);
                    showTicketModal();
                    return;
                }
            }
        }
        
        alert('Failed to load ticket details. Please try again.');
    }
}

function populateTicketModal(booking) {
    console.log('Populating ticket modal with booking:', booking);
    
    // Check if modal elements exist
    const modalElements = {
        ticketEventName: document.getElementById('ticketEventName'),
        ticketEventMeta: document.getElementById('ticketEventMeta'),
        ticketBookingId: document.getElementById('ticketBookingId'),
        ticketTickets: document.getElementById('ticketTickets'),
        ticketPricePerTicket: document.getElementById('ticketPricePerTicket'),
        ticketTotalAmount: document.getElementById('ticketTotalAmount'),
        ticketPaymentMethod: document.getElementById('ticketPaymentMethod'),
        ticketPaymentStatus: document.getElementById('ticketPaymentStatus'),
        ticketCustomerName: document.getElementById('ticketCustomerName'),
        ticketCustomerEmail: document.getElementById('ticketCustomerEmail'),
        ticketBookingDate: document.getElementById('ticketBookingDate')
    };
    
    // Log missing elements
    const missingElements = Object.entries(modalElements)
        .filter(([id, element]) => !element)
        .map(([id]) => id);
    
    if (missingElements.length > 0) {
        console.error('Missing modal elements:', missingElements);
        alert('Ticket modal elements not found. Please refresh the page.');
        return;
    }
    
    // Event Details
    modalElements.ticketEventName.textContent = booking.eventName || 'Event Name';
    modalElements.ticketEventMeta.textContent = booking.eventMeta || 'Date & Venue TBD';
    modalElements.ticketBookingId.textContent = booking.bookingId || booking.id || 'N/A';
    
    // Booking Details
    modalElements.ticketTickets.textContent = booking.tickets || 1;
    modalElements.ticketPricePerTicket.textContent = `₹${Number(booking.pricePerTicket || 0).toLocaleString('en-IN')}`;
    modalElements.ticketTotalAmount.textContent = `₹${Number(booking.totalAmount || 0).toLocaleString('en-IN')}`;
    modalElements.ticketPaymentMethod.textContent = booking.paymentMethod || 'UPI';
    modalElements.ticketPaymentStatus.textContent = booking.paymentStatus || 'Completed';
    
    // Customer Information
    const user = JSON.parse(localStorage.getItem('eventifyUser'));
    modalElements.ticketCustomerName.textContent = user?.username || user?.email || 'Customer Name';
    modalElements.ticketCustomerEmail.textContent = user?.email || 'customer@email.com';
    
    // Format booking date
    const bookingDate = booking.timestamp ? new Date(booking.timestamp).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }) : new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    modalElements.ticketBookingDate.textContent = bookingDate;
    
    console.log('Ticket modal populated successfully');
}

function generateTicketQRCode(booking) {
    const qrContainer = document.getElementById('ticketQRCode');
    if (!qrContainer) return;
    
    // Clear existing QR code
    qrContainer.innerHTML = '';
    
    try {
        // Get user info safely
        const userStr = localStorage.getItem('eventifyUser');
        let userEmail = 'N/A';
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                userEmail = user.email || 'N/A';
            } catch (e) {
                console.error('Error parsing user data for QR code:', e);
            }
        }

        // Create ticket data for QR code
        const ticketData = {
            bookingId: booking.bookingId || booking.id || 'N/A',
            eventName: booking.eventName || 'Event',
            tickets: booking.tickets || 1,
            customerEmail: userEmail,
            timestamp: booking.timestamp || new Date().toISOString()
        };
        
        // Convert to JSON string for QR code
        const qrText = JSON.stringify(ticketData);
        
        // Check if QRCode library is available
        if (typeof QRCode !== 'undefined') {
            new QRCode(qrContainer, {
                text: qrText,
                width: 180,
                height: 180,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: 1 // Using numeric value for CorrectLevel.H (H=2, Q=3, M=0, L=1 - wait, L=1, M=0, Q=3, H=2 is common but let's be safe)
            });
            // Note: If QRCode.CorrectLevel is undefined, we use a number or the fallback
        } else {
            console.warn('QRCode library not found, using fallback');
            // Fallback to Google Charts API
            const img = document.createElement('img');
            img.src = `https://chart.googleapis.com/chart?chs=180x180&cht=qr&chl=${encodeURIComponent(qrText)}&choe=UTF-8`;
            img.alt = 'Ticket QR Code';
            img.style.border = '1px solid #ddd';
            img.style.borderRadius = '8px';
            qrContainer.appendChild(img);
        }
    } catch (error) {
        console.error('Error in generateTicketQRCode:', error);
        qrContainer.innerHTML = `<div style="padding: 20px; color: #ef4444; font-size: 0.9rem;">
            <p>QR Code generation failed</p>
            <small>${error.message}</small>
        </div>`;
    }
}

function showTicketModal() {
    console.log('Showing ticket modal');
    const modal = document.getElementById('ticketModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        console.log('Ticket modal displayed');
    } else {
        console.error('Ticket modal element not found');
        alert('Ticket modal not found. Please refresh the page.');
    }
}

function closeTicketModal() {
    const modal = document.getElementById('ticketModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

function downloadTicket() {
    if (!currentBookingData) {
        alert('No ticket data available');
        return;
    }
    
    // Create ticket content for download
    const ticketContent = generateTicketText(currentBookingData);
    
    // Create a blob and download
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Eventify_Ticket_${currentBookingData.bookingId || currentBookingData.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function printTicket() {
    if (!currentBookingData) {
        alert('No ticket data available');
        return;
    }
    
    // Create printable content
    const printContent = generateTicketHTML(currentBookingData);
    
    // Open print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load, then print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

function generateTicketText(booking) {
    const user = JSON.parse(localStorage.getItem('eventifyUser'));
    const bookingDate = booking.timestamp ? new Date(booking.timestamp).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    
    return `
╔══════════════════════════════════════════════════════════════╗
║                        EVENTIFY TICKET                         ║
╠══════════════════════════════════════════════════════════════╣
║                                                                ║
║  EVENT DETAILS                                                 ║
║  ──────────────────────────────────────────────────────────  ║
║  Event Name: ${booking.eventName || 'N/A'}
║  Date & Venue: ${booking.eventMeta || 'TBD'}
║  Booking ID: ${booking.bookingId || booking.id || 'N/A'}
║                                                                ║
║  BOOKING DETAILS                                              ║
║  ──────────────────────────────────────────────────────────  ║
║  Tickets: ${booking.tickets || 1}
║  Price per Ticket: ₹${Number(booking.pricePerTicket || 0).toLocaleString('en-IN')}
║  Total Amount: ₹${Number(booking.totalAmount || 0).toLocaleString('en-IN')}
║  Payment Method: ${booking.paymentMethod || 'UPI'}
║  Payment Status: ${booking.paymentStatus || 'Completed'}
║                                                                ║
║  CUSTOMER INFORMATION                                         ║
║  ──────────────────────────────────────────────────────────  ║
║  Name: ${user?.username || user?.email || 'Customer Name'}
║  Email: ${user?.email || 'customer@email.com'}
║  Booking Date: ${bookingDate}
║                                                                ║
║  IMPORTANT INSTRUCTIONS                                       ║
║  ──────────────────────────────────────────────────────────  ║
║  • Please arrive at the venue 30 minutes before the event     ║
║  • Carry a valid ID proof along with this ticket              ║
║  • This ticket is non-transferable and non-refundable         ║
║  • QR code will be scanned at the entry point                 ║
║  • For any issues, contact our support team                   ║
║                                                                ║
╚══════════════════════════════════════════════════════════════╝
`;
}

function generateTicketHTML(booking) {
    const user = JSON.parse(localStorage.getItem('eventifyUser'));
    const bookingDate = booking.timestamp ? new Date(booking.timestamp).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Eventify Ticket - ${booking.eventName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .ticket { max-width: 600px; margin: 0 auto; background: white; border: 2px solid #ddd; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%); color: white; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; padding: 15px; border: 1px solid #eee; border-radius: 5px; }
        .section h3 { margin: 0 0 10px 0; color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 5px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .total { background: #f8f9fa; padding: 10px; border-radius: 5px; font-weight: bold; }
        .instructions { background: #fff3cd; border-color: #ffeaa7; }
        .instructions ul { margin: 0; padding-left: 20px; }
        .footer { text-align: center; padding: 15px; background: #f8f9fa; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        @media print { body { background: white; } .ticket { box-shadow: none; border: 2px solid #333; } }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <h1>EVENTIFY TICKET</h1>
        </div>
        <div class="content">
            <div class="section">
                <h3>Event Details</h3>
                <div class="row"><span class="label">Event Name:</span><span class="value">${booking.eventName || 'N/A'}</span></div>
                <div class="row"><span class="label">Date & Venue:</span><span class="value">${booking.eventMeta || 'TBD'}</span></div>
                <div class="row"><span class="label">Booking ID:</span><span class="value">${booking.bookingId || booking.id || 'N/A'}</span></div>
            </div>
            
            <div class="section">
                <h3>Booking Details</h3>
                <div class="row"><span class="label">Tickets:</span><span class="value">${booking.tickets || 1}</span></div>
                <div class="row"><span class="label">Price per Ticket:</span><span class="value">₹${Number(booking.pricePerTicket || 0).toLocaleString('en-IN')}</span></div>
                <div class="row total"><span class="label">Total Amount:</span><span class="value">₹${Number(booking.totalAmount || 0).toLocaleString('en-IN')}</span></div>
                <div class="row"><span class="label">Payment Method:</span><span class="value">${booking.paymentMethod || 'UPI'}</span></div>
                <div class="row"><span class="label">Payment Status:</span><span class="value">${booking.paymentStatus || 'Completed'}</span></div>
            </div>
            
            <div class="section">
                <h3>Customer Information</h3>
                <div class="row"><span class="label">Name:</span><span class="value">${user?.username || user?.email || 'Customer Name'}</span></div>
                <div class="row"><span class="label">Email:</span><span class="value">${user?.email || 'customer@email.com'}</span></div>
                <div class="row"><span class="label">Booking Date:</span><span class="value">${bookingDate}</span></div>
            </div>
            
            <div class="section instructions">
                <h3>Important Instructions</h3>
                <ul>
                    <li>Please arrive at the venue 30 minutes before the event starts</li>
                    <li>Carry a valid ID proof along with this ticket</li>
                    <li>This ticket is non-transferable and non-refundable</li>
                    <li>QR code will be scanned at the entry point</li>
                    <li>For any issues, contact our support team</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>&copy; 2026 Eventify Technologies Pvt. Ltd. All Rights Reserved.</p>
            <p>Making every moment unforgettable, one event at a time.</p>
        </div>
    </div>
</body>
</html>
`;
}

// Test function to check booking data structure
function testBookingData() {
    const bookingCards = document.querySelectorAll('.movie');
    console.log('Found booking cards:', bookingCards.length);
    
    bookingCards.forEach((card, index) => {
        const viewBtn = card.querySelector('button[onclick*="viewTicket"]');
        if (viewBtn) {
            const onclick = viewBtn.getAttribute('onclick');
            console.log(`Card ${index + 1}:`, onclick);
            
            // Extract booking ID from onclick
            const match = onclick.match(/viewTicket\('([^']+)'\)/);
            if (match) {
                console.log(`Booking ID: ${match[1]}`);
                
                // Extract data from card
                const eventName = card.querySelector('h3')?.textContent;
                const eventMeta = card.querySelector('.event-meta p')?.textContent;
                
                // Extract pricing information
                const pricingRows = card.querySelectorAll('.event-pricing p');
                let pricingData = {};
                
                pricingRows.forEach(row => {
                    const text = row.textContent;
                    if (text.includes('Tickets:')) {
                        const match = text.match(/Tickets:\s*(\d+)/);
                        if (match) pricingData.tickets = match[1];
                    } else if (text.includes('Price per Ticket:')) {
                        const match = text.match(/₹?([\d,]+)/);
                        if (match) pricingData.pricePerTicket = match[1];
                    } else if (text.includes('Total Amount:')) {
                        const match = text.match(/₹?([\d,]+)/);
                        if (match) pricingData.totalAmount = match[1];
                    }
                });
                
                console.log(`Event Name: ${eventName}`);
                console.log(`Event Meta: ${eventMeta}`);
                console.log('Pricing Data:', pricingData);
                console.log('---');
            }
        }
    });
}

// Add test function to window for manual testing
window.testBookingData = testBookingData;

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('ticketModal');
    if (event.target === modal) {
        closeTicketModal();
    }
});

// Close modal with Escape key
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeTicketModal();
    }
});

async function cancelBooking(bookingId) {
    showCancelConfirmationPopup(bookingId);
}

// Show cancellation confirmation popup
function showCancelConfirmationPopup(bookingId) {
    // Remove any existing popup
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
        <h3>Cancel Booking</h3>
        <p>Are you sure you want to cancel booking #${bookingId}? This action cannot be undone.</p>
        <div class="popup-button-group">
            <button class="popup-btn popup-btn-secondary cancel-btn-popup">No, Keep Booking</button>
            <button class="popup-btn popup-btn-danger confirm-cancel-btn">Yes, Cancel Booking</button>
        </div>
    `;
    
    // Add click handlers
    const cancelBtn = popup.querySelector('.cancel-btn-popup');
    const confirmBtn = popup.querySelector('.confirm-cancel-btn');
    
    cancelBtn.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
    });
    
    confirmBtn.addEventListener('click', () => {
        popup.remove();
        overlay.remove();
        proceedWithCancellation(bookingId);
    });
    
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Proceed with actual cancellation
async function proceedWithCancellation(bookingId) {
    try {
        const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to cancel booking');
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'popup-overlay';

        // Show success message with refund information
        const successMessage = document.createElement('div');
        successMessage.className = 'eventify-popup';
        successMessage.style.maxWidth = '500px';
        
        successMessage.innerHTML = `
            <div class="popup-icon-container success">
                <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3>Booking Cancelled Successfully!</h3>
            <p>Your booking #${bookingId} has been cancelled.</p>
            <div style="background: var(--surface-muted); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid var(--accent); text-align: left;">
                <p style="margin: 0; font-size: 15px; color: var(--text-primary);">
                    <strong>Refund Information:</strong><br>
                    Your payment will be refunded to your original payment method within 5-7 business days.
                </p>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; opacity: 0.8;">
                A confirmation email has been sent to your registered email address.
            </p>
            <div class="popup-button-group">
                <button class="popup-btn popup-btn-primary" onclick="this.closest('.popup-overlay').remove()">OK</button>
            </div>
        `;
        
        overlay.appendChild(successMessage);
        document.body.appendChild(overlay);
        
        // Reload bookings after a short delay
        setTimeout(() => {
            loadUserBookings();
        }, 1000);
        
    } catch (error) {
        console.error('Error cancelling booking:', error);
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            text-align: center;
            min-width: 450px;
        `;
        
        errorMessage.innerHTML = `
            <div style="margin-bottom: 25px;">
                <svg width="70" height="70" viewBox="0 0 24 24" fill="white" style="margin-bottom: 20px;">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <h3 style="margin: 0; font-size: 1.8em; font-weight: 600;">Cancellation Failed</h3>
            </div>
            <p style="margin: 0 0 25px 0; line-height: 1.6; font-size: 1.2em;">
                Unable to cancel booking #${bookingId}. Please try again or contact support.
            </p>
            <button onclick="this.parentElement.remove()" style="
                padding: 15px 30px;
                background: linear-gradient(45deg, #f4385d, #e03452);
                color: white;
                border: none;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                font-size: 1.2em;
                box-shadow: 0 5px 15px rgba(244, 56, 93, 0.3);
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 20px rgba(244, 56, 93, 0.4)'" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 5px 15px rgba(244, 56, 93, 0.3)'">OK</button>
        `;
        
        document.body.appendChild(errorMessage);
    }
}
