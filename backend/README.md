# Eventify Backend (Node.js + Express + Prisma + MySQL)

A Node.js backend for the Eventify event booking platform, converted from Java Spring Boot.

## Features

- User registration and authentication with JWT
- Event booking management
- MySQL database with Prisma ORM
- RESTful API endpoints

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- npm or yarn

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up MySQL database:**
   - Create a MySQL database named `eventify`
   - Update the `DATABASE_URL` in `.env` file with your MySQL credentials

3. **Run database migrations:**
   ```bash
   npm run db:migrate
   ```

4. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

5. **Start the server:**
   ```bash
   npm run dev  # For development (with nodemon)
   # or
   npm start    # For production
   ```

The server will run on `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings (or filter by userId)
- `DELETE /api/bookings/:id` - Delete a booking

### Health Check
- `GET /api/health` - Check server status

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="mysql://username:password@localhost:3306/eventify"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8080
```

## Database Schema

The application uses two main tables:
- `users` - User accounts
- `bookings` - Event bookings linked to users

## Development

Use `npm run dev` for development with automatic restarts on file changes.