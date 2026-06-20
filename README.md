# Eventify - Event Booking Platform

![Eventify Banner](Resource/img/readme-banner.png)

Eventify is a full-stack event booking web application where users can browse events, create an account, book tickets, view their bookings, and open generated ticket details. The project is built with a static HTML/CSS/JavaScript frontend, a Node.js + Express backend, and a MongoDB database.

The live application is deployed with:

- Frontend: Vercel
- Backend API: Render
- Database: MongoDB Atlas

## Live Link

- Frontend: https://eventify-booking-app.vercel.app/
- Backend health check: https://eventify-b3n8.onrender.com/api/health

## Features

- User registration and login
- Password hashing with bcryptjs
- JWT-based authentication response
- Event discovery pages with responsive UI
- Ticket booking flow
- My Bookings dashboard
- Ticket detail modal with QR-style ticket display
- Booking cancellation
- Light and dark theme support
- Mobile responsive navigation and layouts
- REST API connected to a MongoDB database

## Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript ES modules
- Vercel deployment

### Backend

- Node.js
- Express.js
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- Render deployment

### Database

- MongoDB
- MongoDB Atlas

## Project Structure

```text
eventify/
├── index.html
├── about.html
├── bookings.html
├── payment.html
├── support.html
├── CSS/
├── JavaScript/
│   ├── api-config.js
│   ├── bookings.js
│   ├── payment.js
│   └── script.js
├── Resource/
│   ├── img/
│   └── svg/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── db.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## API Configuration

The frontend API base URL is configured in [JavaScript/api-config.js](JavaScript/api-config.js).

```js
window.EVENTIFY_API_BASE_URL = isLocalhost
  ? 'http://localhost:5000/api'
  : 'https://eventify-b3n8.onrender.com/api';
```

When running locally, the frontend calls `http://localhost:5000/api`. When deployed, it calls the Render backend.

## Getting Started Locally

### Prerequisites

- Node.js 16 or later
- npm
- MongoDB database, local or MongoDB Atlas
- A static file server for the frontend, such as VS Code Live Server or `npx serve`

### 1. Clone the Repository

```bash
git clone https://github.com/sahiljayant19/eventify.git
cd eventify
```

### 2. Set Up the Database

Set up a MongoDB database (either locally or on MongoDB Atlas). There is no SQL schema setup required, as MongoDB dynamically creates databases and collections.

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `backend` folder:

```bash
cd backend
cp .env.example .env
```

Update the values:

```env
PORT=5000
NODE_ENV=development

CLIENT_URL=http://127.0.0.1:5500

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/eventify?retryWrites=true&w=majority&appName=eventify-cluster

JWT_SECRET=replace_with_a_strong_secret
```

For MongoDB Atlas, replace `<username>`, `<password>`, and `<cluster-host>` with your Atlas credentials. Make sure to URL-encode your password if it contains special characters.

### 4. Install and Run the Backend

```bash
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

### 5. Run the Frontend

From the project root, run a static server:

```bash
npx serve .
```

You can also use VS Code Live Server. For local API calls, open the frontend on `localhost` or `127.0.0.1`.

## Environment Variables

Backend variables used by the current code:

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Backend port. Defaults to `5000`. |
| `NODE_ENV` | No | Runtime environment label. |
| `CLIENT_URL` | No | Frontend URL reserved for CORS allowlist configuration. |
| `MONGODB_URI` | Yes | MongoDB connection URI string. |
| `JWT_SECRET` | Yes | Secret key used to sign JWTs. |

## API Endpoints

Base URL:

```text
/api
```

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Register a new user. |
| `POST` | `/auth/login` | Log in and receive user data plus JWT token. |

### Bookings

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/bookings` | Create a booking. |
| `GET` | `/bookings` | Get bookings. Supports `?userId=<id>`. |
| `GET` | `/bookings/:id` | Get one booking by ID. |
| `DELETE` | `/bookings/:id` | Cancel/delete a booking. |

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Check whether the backend is running. |

## Example API Payloads

### Register

```json
{
  "username": "Sahil",
  "email": "sahil@example.com",
  "password": "password123"
}
```

### Login

```json
{
  "email": "sahil@example.com",
  "password": "password123"
}
```

### Create Booking

```json
{
  "eventName": "Arijit Singh Live",
  "eventMeta": "Mumbai | 24 May 2026",
  "tickets": 2,
  "pricePerTicket": 1999,
  "totalAmount": 3998,
  "userId": 1
}
```

## Deployment Notes

### Frontend on Vercel

The frontend is a static site, so it can be deployed directly from the repository root. Vercel serves the HTML, CSS, JavaScript, and assets.

Important file:

- [JavaScript/api-config.js](JavaScript/api-config.js): controls whether the app uses local API or Render API.

### Backend on Render

Render should run the backend from the `backend` directory.

Recommended settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Add the backend environment variables in Render:

```env
PORT=5000
NODE_ENV=production
CLIENT_URL=https://eventify-booking-app.vercel.app
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-jwt-secret
```

### MongoDB Atlas

Create a MongoDB Atlas cluster, create a database named `eventify`, and retrieve your connection URI string. Add it as the `MONGODB_URI` environment variable in Render.

## Security Notes

- Keep `.env` files private.
- Use a strong `JWT_SECRET` in production.
- Do not commit database credentials.
- The backend uses Mongoose ORM to securely interact with MongoDB.
- Passwords are stored as bcrypt hashes.

## Useful Commands

```bash
# Start backend in development
cd backend
npm run dev

# Start backend in production mode
cd backend
npm start

# Serve frontend locally from project root
npx serve .
```

## Author

**Sahil Jayant**

- Email: [sahiljayantwork@gmail.com](mailto:sahiljayantwork@gmail.com)
- GitHub: https://github.com/sahiljayant19

## Project Goal

Eventify demonstrates a practical full-stack workflow: a responsive frontend, REST API, authentication, booking persistence, and cloud deployment across Vercel, Render, and MongoDB Atlas.

## Live Link
https://eventify-booking-app.vercel.app/
