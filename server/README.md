# Crowdfunding Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment
Create a `.env` file in the server directory:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- MongoDB URI
- JWT Secret
- Stripe API Keys
- Admin credentials

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
mongod
```

### 4. Run the Server
```bash
npm run dev
```

Server will run on http://localhost:5000

## Default Admin Credentials
- Email: admin@fundrise.com
- Password: Admin@123

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/logout` - Logout user
- GET `/api/auth/me` - Get current user

### Projects (Public)
- GET `/api/projects` - Get all active projects
- GET `/api/projects/featured` - Get featured projects
- GET `/api/projects/:id` - Get single project

### Admin (Admin Only)
- GET `/api/admin/stats` - Get platform statistics
- GET `/api/admin/projects` - Get all projects
- POST `/api/admin/projects` - Create new project
- PUT `/api/admin/projects/:id` - Update project
- DELETE `/api/admin/projects/:id` - Delete project

### Payments (Authenticated)
- POST `/api/payments/create-intent` - Create payment intent
- POST `/api/payments/confirm` - Confirm payment and generate certificate
- GET `/api/payments/certificate/:paymentId` - Download certificate

## Features
- ✅ MongoDB database
- ✅ JWT authentication
- ✅ Admin-only project creation
- ✅ Stripe payment integration
- ✅ Automatic certificate generation
- ✅ Role-based access control
