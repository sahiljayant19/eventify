🎫 Eventify Platform - Event & Concert Booking System
Eventify is a full-stack web application that simulates a real-world event and concert booking experience. It enables users to explore events, book tickets, and manage their bookings through a modern, responsive interface.
The platform is designed to reflect production-level architecture, including authentication, booking workflows, RESTful APIs, and database integration — making it a strong demonstration of practical full-stack development skills.
Built using Node.js, Express, MySQL, and modern frontend technologies, Eventify showcases how a complete booking system is structured from UI to backend logic.
🚀 Live Demo
👉 https://eventify-booking-app.vercel.app/⁠�
(Frontend demo showcasing UI and user flow)
📌 Project Status
This project includes:
Fully functional backend (Node.js + Express)
Database integration (MySQL + Prisma ORM)
Authentication & booking system
REST API architecture
⚠️ Note:
The live demo currently showcases only the frontend. Backend APIs and database are not deployed due to hosting limitations.
To experience full functionality:
Clone the repository
Configure the .env file
Set up MySQL locally
Run backend and frontend
✨ Key Features
🔐 JWT-based User Authentication (Login & Registration)
🎫 Event Discovery with pricing & availability
📦 Smart Booking System with ticket management
📊 User Bookings Dashboard
🎟 QR Code Ticket Generation
💳 Payment Flow UI (UPI / Card simulation)
📱 Fully Responsive Design
🛠 Tech Stack
Frontend
HTML5
CSS3 (Animations & Responsive Design)
JavaScript (ES6+)
Backend
Node.js
Express.js
Prisma ORM
MySQL
JWT Authentication
bcryptjs
Tools
Nodemon
dotenv
npm
⚙️ Environment Setup
Backend .env.example
Environment
PORT=8080

BASE_URL="http://localhost:8080"
CLIENT_URL="http://localhost:3000"

DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/eventify"

JWT_SECRET="your_secret_here"
JWT_EXPIRES_IN="7d"
🚀 Getting Started
1. Clone the Repository
Bash
git clone https://github.com/sahiljayant19/eventify
cd eventify
2. Backend Setup
Bash
cd backend
npm install
Create .env file and configure the database.
Run the server:
Bash
npm run dev
3. Database Setup
SQL
CREATE DATABASE eventify;
Then run:
Bash
npm run db:push
npm run db:generate
4. Frontend Setup
Bash
npx serve .
or
Bash
python -m http.server 8000
🔗 API Endpoints
Base URL

http://localhost:8080/api
Auth
POST /auth/register
POST /auth/login
Bookings
GET /bookings
POST /bookings
GET /bookings/:id
DELETE /bookings/:id
Health
GET /health
📁 Project Structure

eventify-platform/
├── frontend/
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── prisma/
├── assets/
└── README.md
🔐 Security
JWT-based authentication
Password hashing using bcrypt
CORS protection
Secure environment variable management
🎯 Highlights
Scalable full-stack architecture
Clean and modular REST API design
Responsive and user-friendly UI/UX
Real-world booking workflow simulation
Structured backend with separation of concerns
📦 Deployment
Frontend
Vercel / GitHub Pages
Backend (Optional)
Render / Railway
Database
MySQL (Local or Cloud)
👤 Author
Sahil Jayant
📧 sahiljayantwork@gmail.com
🔗 https://github.com/sahiljayant19⁠�
⭐ Project Goal
This project demonstrates:
Full-stack development capabilities
API design and backend architecture
Database integration and management
Real-world application workflows
📜 License
© 2026 Sahil Jayant. All rights reserved.
Unauthorized copying, distribution, or use of this project, via any medium, is strictly prohibited without prior permission from the author.