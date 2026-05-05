🎫 Eventify Platform - Event & Concert Booking System

Eventify is a full-stack web application designed to simulate a real-world event and concert booking experience. It allows users to discover events, book tickets, manage their bookings, and interact with a modern, responsive interface.

The platform focuses on replicating production-level features such as authentication, booking workflows, API-driven architecture, and database integration — making it a strong demonstration of practical full-stack development skills.

Built using Node.js, Express, MySQL, and modern frontend technologies, Eventify showcases how a complete booking system can be structured from UI to backend logic.


---

🚀 Live Demo

👉 https://eventify-booking-app.vercel.app/
(Frontend demo showcasing UI and user flow)


---

📌 Project Status

This project includes a complete backend (Node.js + Express) and database (MySQL) implementation with authentication, booking system, and API architecture.

The live demo currently showcases the frontend experience. Backend APIs and database are not deployed in the live version due to hosting limitations.

To experience full functionality:

Clone the repository

Configure the .env file

Set up MySQL locally

Run backend and frontend



---

✨ Key Features

🔐 User Authentication (JWT-based login & registration)

🎫 Event Discovery with pricing and availability

📦 Smart Booking System with ticket management

📊 My Bookings Dashboard

🎟 QR Code Ticket Generation

💳 Payment Flow UI (UPI / Card simulation)

📱 Fully Responsive Design



---

🛠 Tech Stack

Frontend

HTML5

CSS3 (animations, responsive design)

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



---

⚙️ Environment Setup

Backend .env.example

PORT=8080  
  
BASE_URL="http://localhost:8080"  
CLIENT_URL="http://localhost:3000"  
  
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/eventify"  
  
(Optional)  
JWT_SECRET="your_secret_here"  
JWT_EXPIRES_IN="7d"


---

🚀 Getting Started

1. Clone the Repository

git clone https://github.com/sahiljayant19/eventify  
cd eventify


---

2. Backend Setup

cd backend  
npm install

Create .env file and configure database.

Run:

npm run dev


---

3. Database Setup

CREATE DATABASE eventify;

Then:

npm run db:push  
npm run db:generate


---

4. Frontend Setup

npx serve .

or

python -m http.server 8000


---

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



---

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


---

🔐 Security

JWT Authentication

Password hashing (bcrypt)

CORS protection

Environment variable management



---

🎯 Highlights

Full-stack architecture

Clean REST API design

Responsive UI/UX

Modular backend structure

Real-world booking workflow



---

📦 Deployment

Frontend

Vercel / GitHub Pages


Backend (optional)

Render / Railway


Database

MySQL (local or cloud)



---

👤 Author

Sahil Jayant
📧 sahiljayantwork@gmail.com
🔗 https://github.com/sahiljayant19


---

⭐ Project Goal

This project demonstrates:

Full-stack development skills

API design & backend logic

Database integration

Real-world application flow


---

📜 License
© 2026 Sahil Jayant. All rights reserved.
Unauthorized copying, distribution, or use of this project, via any medium, is strictly prohibited without prior permission from the author.

---

> ⭐ Star this repo if you found it useful!
At the end add all right reserved