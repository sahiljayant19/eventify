# 🎫 Eventify Platform - Event & Concert Booking System

A modern, full-stack event and concert booking platform with user authentication, real-time booking management, and secure payment processing.

## ✨ Key Features

- **User Authentication** - Secure registration & login with JWT authentication
- **Event Discovery** - Browse events with ratings, pricing, and availability
- **Smart Booking System** - Real-time booking flow with seat/ticket management
- **My Bookings Dashboard** - View and manage all user bookings
- **QR Code Tickets** - Generate, download, and print digital tickets
- **Payment Processing** - Multiple payment methods (UPI, Card, Bank Transfer)
- **Responsive Design** - Fully mobile-optimized across all devices

## 🛠️ Tech Stack & Tool Versions

### Frontend
- **HTML5** - Semantic markup and accessibility
- **CSS3** - Modern styling with animations and gradients
- **JavaScript (ES6+)** - Vanilla JS with async/await and modern features
- **QR Code Library** - Dynamic ticket generation

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** (^4.18.2) - Lightweight web framework
- **Prisma** (^5.7.0) - Modern ORM & database toolkit
- **MySQL 2** (^3.6.5) - Database driver
- **JWT** (^9.0.2) - Secure token authentication
- **bcryptjs** (^2.4.3) - Password hashing & security
- **CORS** (^2.8.5) - Cross-origin resource sharing
- **Dotenv** (^16.3.1) - Environment configuration

### Development Tools
- **Nodemon** (^3.0.2) - Development server with auto-reload
- **npm** - Package manager (v10+)

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **MySQL** (v5.7+)
- Modern web browser

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with database configuration:
```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/eventify"
PORT=8080
```

4. Set up database:
```bash
npm run db:push              # Push schema to database
npm run db:generate         # Generate Prisma client
```

5. Start the backend server:
```bash
npm run dev                  # Development mode (with auto-reload)
# or
npm start                    # Production mode
```

The backend will be available at `http://localhost:8080`

### Frontend Setup

1. From the project root, serve the frontend:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Or open index.html directly in your browser
```

2. Access the application at `http://localhost:8000` (or your chosen port)

## 📱 Application Pages

- **Home** (`index.html`) - Event discovery and browsing
- **My Bookings** (`bookings.html`) - Booking management and ticket retrieval
- **Payment** (`payment.html`) - Secure payment processing
- **About** (`about.html`) - Platform information

## 🔗 API Endpoints

### Base URL: `http://localhost:8080/api`

### Authentication
- `POST /auth/register` - User registration with email and password
- `POST /auth/login` - User login and JWT token generation

### Bookings
- `GET /bookings?userId={id}` - Retrieve all user bookings
- `POST /bookings` - Create a new booking (requires JWT token)
- `GET /bookings/{id}` - Get specific booking details
- `DELETE /bookings/{id}` - Cancel booking (requires JWT token)

### Health Check
- `GET /health` - Backend API health status

## 🔐 Security Features

- JWT-based authentication with secure token validation
- Password hashing using bcryptjs (bcrypt algorithm)
- CORS protection for cross-origin requests
- Environment variables for sensitive configuration
- Graceful error handling and logging

## 🎨 Highlights

### Advanced Booking System
- Real-time availability verification
- Secure JWT-authenticated requests
- QR code generation for digital tickets
- Ticket download and print functionality
- Booking confirmation and management

### User Experience
- Smooth animations and transitions
- Gradient-based modern UI design
- Fully responsive mobile and desktop views
- Intuitive navigation and checkout flow
- Interactive event discovery

### Performance & Reliability
- Optimized CSS for mobile performance
- Async/await for smooth data fetching
- Graceful error handling
- Database connection pooling with Prisma
- Proper shutdown handling with signal listeners

## 📁 Project Structure

```
eventify-platform/
├── index.html              # Home page - Event discovery
├── bookings.html           # My Bookings page
├── payment.html            # Payment processing page
├── about.html              # About page
├── CSS/                    # Stylesheets
│   ├── style.css           # Main stylesheet
│   ├── responsive.css      # Mobile responsiveness
│   ├── effects.css         # Animations & effects
│   ├── ticket-modal.css    # Ticket modal styles
│   └── ...                 # Other CSS modules
├── JavaScript/             # Frontend scripts
│   ├── script.js           # Main application logic
│   ├── bookings.js         # Booking management
│   ├── payment.js          # Payment handling
│   └── variables.js        # Global variables
├── Resource/               # Assets
│   ├── img/                # Images
│   └── svg/                # SVG icons
├── backend/                # Node.js backend
│   ├── server.js           # Express server entry point
│   ├── package.json        # Dependencies (Express, Prisma, JWT, etc.)
│   ├── routes/             # API route handlers
│   │   ├── auth.js         # Authentication endpoints
│   │   └── bookings.js     # Booking endpoints
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   └── bookingController.js
│   ├── middleware/         # Express middleware
│   │   └── auth.js         # JWT authentication
│   └── prisma/
│       └── schema.prisma   # Database schema
└── DEPLOYMENT.md           # Deployment guide
```

## 🔄 Development Workflow

### Running the Project Locally

1. **Backend**:
```bash
cd backend
npm install
npm run dev
```

2. **Frontend** (in a new terminal):
```bash
python -m http.server 8000
# Access: http://localhost:8000
```

### Database Migrations
```bash
cd backend
npm run db:migrate          # Create new migration
npm run db:push             # Push schema changes
npm run db:generate         # Regenerate Prisma client
```

## 📦 Dependencies Summary

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| prisma | ^5.7.0 | ORM & database management |
| @prisma/client | ^5.7.0 | Prisma client runtime |
| mysql2 | ^3.6.5 | MySQL driver |
| jsonwebtoken | ^9.0.2 | JWT authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| cors | ^2.8.5 | CORS middleware |
| dotenv | ^16.3.1 | Environment variables |
| nodemon | ^3.0.2 | Dev server auto-reload |

## 🚀 Deployment

### GitHub Pages (Frontend Only)
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main` or `gh-pages`)
4. Your site will be available at `https://username.github.io/repository-name`

### Full Stack Deployment
For production deployment:
- **Frontend**: Netlify, Vercel, or GitHub Pages
- **Backend**: Railway, Heroku, or AWS EC2
- **Database**: Supabase, Railway, or PlanetScale

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔒 Security Features

- JWT-based token authentication
- Password hashing with bcryptjs (bcrypt algorithm)
- CORS protection for cross-origin requests
- Environment variable configuration for secrets
- Input validation and error handling
- Graceful shutdown with database cleanup

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request for review

**Note:** This project is copyrighted and all contributions must be submitted via pull request for review and approval.

## 📄 License

© 2026 Sahil Jayant. **All Rights Reserved.**

This pContact

For inquiries or questions:
- 📧 **Email:** sahiljayantwork@gmail.com
- 💬 **GitHub Issues:** [Report Issues](https://github.com/sahiljayant19/Eventify-Platform/issuesout explicit permission
- ❌ Commercial Use: Cannot use for commercial purposes without permission

For licensing inquiries, please contact the author.

## 👥 Author

**Sahil Jayant** - *Initial work* - [GitHub Profile](https://github.com/sahiljayant19)

## 📞 Support & Contact

For support or inquiries:
- 📧 **Email:** sahiljayantwork@gmail.com
- 💬 **GitHub Issues:** [Report Issues](https://github.com/sahiljayant19/Eventify-Platform/issues)

---

⭐ **Star this repository if you found it helpful!**

### Project Highlights

This project demonstrates expertise in:
- **Full-stack web development** (Frontend + Backend)
- **Modern JavaScript** (ES6+, Async/Await)
- **Node.js & Express.js** API development
- **Database design** with Prisma ORM
- **Authentication & Security** (JWT, bcrypt)
- **Responsive UI/UX** design and CSS3 animations
- **RESTful API** architecture
- **Version control** with Git
- **Problem-solving** and debugging skills
