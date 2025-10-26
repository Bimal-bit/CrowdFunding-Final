# 🚀 FundRise - Crowdfunding Platform

A modern, full-stack crowdfunding platform built with React, Node.js, and MongoDB. Enable creators to launch projects and backers to support innovative ideas.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Frontend](#frontend)
- [Backend](#backend)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## ✨ Features

### Core Features
- 🎯 **Project Creation** - Create and manage crowdfunding campaigns
- ✅ **Campaign Approval System** - Submit campaign requests for admin verification
- 💳 **Secure Payments** - Stripe integration for safe transactions
- 📊 **Analytics Dashboard** - Track project performance and backer engagement
- 👥 **User Management** - Authentication and authorization system
- 📧 **Receipt Generation** - Automatic PDF receipts for contributions
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** - Works seamlessly on all devices

### User Roles
- **Admin** - Review and approve campaign requests, manage projects, access analytics
- **Regular User** - Submit campaign requests, browse projects, make contributions, view dashboard

### Payment Features
- Stripe payment integration
- Multiple payment methods support
- Automatic receipt generation (PDF)
- Payment history tracking
- Secure payment processing

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **UI Components:** Framer Motion for animations
- **Charts:** Recharts for data visualization
- **Icons:** Lucide React
- **Payment:** Stripe React SDK
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Payment:** Stripe API
- **PDF Generation:** PDFKit
- **File Upload:** Multer + Cloudinary
- **Security:** Helmet, CORS, Rate Limiting

---

## 📁 Project Structure

```
Crowd-Funding-Main-main/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Layout/      # Header, Footer
│   │   │   ├── Payment/     # Payment modal, Stripe integration
│   │   │   └── Project/     # Project cards, details
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── context/         # React Context (Auth)
│   │   ├── services/        # API calls
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.ts       # Vite configuration
│
├── server/                   # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── project.controller.js
│   │   │   ├── payment.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/          # MongoDB schemas
│   │   │   ├── User.model.js
│   │   │   ├── Project.model.js
│   │   │   └── Payment.model.js
│   │   ├── routes/          # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── project.routes.js
│   │   │   └── payment.routes.js
│   │   ├── middleware/      # Custom middleware
│   │   │   ├── auth.js
│   │   │   └── upload.js
│   │   ├── utils/           # Utility functions
│   │   │   ├── generateReceipt.js
│   │   │   └── generateToken.js
│   │   ├── config/          # Configuration files
│   │   └── server.js        # Entry point
│   ├── certificates/        # Generated certificates
│   ├── receipts/            # Generated receipts
│   ├── package.json
│   └── .env.example         # Environment variables template
│
├── STRIPE_TEST_CARDS.md     # Stripe test card numbers
├── DASHBOARD_COMPLETE_GUIDE.md
└── README.md                # This file
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Stripe Account (for payments)
- Cloudinary Account (for image uploads)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Crowd-Funding-Main-main
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../server
npm install
```

4. **Setup Environment Variables**

Create `.env` file in `server/` directory:
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/crowdfunding
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crowdfunding

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Backend URL
BACKEND_URL=http://localhost:5000
```

Create `.env` file in `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

5. **Start Development Servers**

Terminal 1 - Backend:
```bash
cd server
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

6. **Access the Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

---

## 💻 Frontend

### Technology Details

**React + TypeScript**
- Type-safe component development
- Better IDE support and error catching
- Improved code maintainability

**Vite**
- Fast development server with HMR
- Optimized production builds
- Modern ES modules support

**Tailwind CSS**
- Utility-first CSS framework
- Responsive design out of the box
- Custom color schemes and gradients

**Key Libraries:**
- `react-router-dom` - Client-side routing
- `framer-motion` - Smooth animations
- `recharts` - Data visualization
- `lucide-react` - Modern icon set
- `@stripe/react-stripe-js` - Payment integration

### Frontend Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx       # Navigation bar
│   │   └── Footer.tsx       # Footer component
│   ├── Payment/
│   │   └── PaymentModal.tsx # Stripe payment form
│   └── Project/
│       ├── ProjectCard.tsx  # Project preview card
│       └── ProjectDetails.tsx
│
├── pages/
│   ├── HomePage.tsx         # Landing page
│   ├── ProjectsPage.tsx     # Browse projects
│   ├── ProjectDetailPage.tsx
│   ├── DashboardPage.tsx    # User dashboard
│   ├── AdminDashboard.tsx   # Admin panel
│   ├── LoginPage.tsx
│   └── SignupPage.tsx
│
├── context/
│   └── AuthContext.tsx      # Authentication state
│
├── services/
│   └── api.js               # API client
│
└── App.tsx                  # Main app with routes
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Key Features

**Authentication**
- JWT-based authentication
- Protected routes
- Persistent login sessions
- Role-based access control

**Dashboard**
- User profile management
- Project statistics
- Analytics charts
- Payment history

**Payment Integration**
- Stripe Elements integration
- Secure card processing
- Real-time payment status
- Receipt generation

---

## 🔧 Backend

### Technology Details

**Express.js**
- RESTful API architecture
- Middleware-based request handling
- Error handling and validation
- CORS and security headers

**MongoDB + Mongoose**
- NoSQL database
- Schema validation
- Relationship management
- Indexing for performance

**Security Features:**
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- Helmet for security headers
- CORS configuration
- Input validation

### Backend Structure

```
src/
├── controllers/
│   ├── auth.controller.js      # Login, signup, logout
│   ├── project.controller.js   # CRUD operations
│   ├── payment.controller.js   # Payment processing
│   └── admin.controller.js     # Admin operations
│
├── models/
│   ├── User.model.js           # User schema
│   ├── Project.model.js        # Project schema
│   └── Payment.model.js        # Payment schema
│
├── routes/
│   ├── auth.routes.js          # /api/auth/*
│   ├── project.routes.js       # /api/projects/*
│   ├── payment.routes.js       # /api/payments/*
│   └── admin.routes.js         # /api/admin/*
│
├── middleware/
│   ├── auth.js                 # JWT verification
│   ├── admin.js                # Admin check
│   └── upload.js               # File upload (Multer)
│
├── utils/
│   ├── generateReceipt.js      # PDF receipt generation
│   └── generateToken.js        # JWT token creation
│
└── server.js                   # Express app setup
```

### API Endpoints

#### Authentication
```
POST   /api/auth/signup        # Register new user
POST   /api/auth/login         # User login
GET    /api/auth/me            # Get current user
POST   /api/auth/logout        # Logout user
```

#### Projects
```
GET    /api/projects           # Get all projects
GET    /api/projects/:id       # Get single project
POST   /api/projects           # Create project (Admin)
PUT    /api/projects/:id       # Update project (Admin)
DELETE /api/projects/:id       # Delete project (Admin)
```

#### Campaign Requests
```
POST   /api/campaign-requests              # Submit campaign request
GET    /api/campaign-requests/my-requests  # Get user's requests
GET    /api/campaign-requests/:id          # Get request details
DELETE /api/campaign-requests/:id          # Delete own request
GET    /api/campaign-requests              # Get all requests (Admin)
PUT    /api/campaign-requests/:id/approve  # Approve request (Admin)
PUT    /api/campaign-requests/:id/reject   # Reject request (Admin)
```

#### Payments
```
POST   /api/payments/create-intent    # Create payment intent
POST   /api/payments/confirm          # Confirm payment
GET    /api/payments/receipt/:id      # Download receipt
```

#### Admin
```
GET    /api/admin/dashboard    # Admin dashboard stats
GET    /api/admin/users        # Get all users
GET    /api/admin/payments     # Get all payments
```

### Available Scripts

```bash
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
```

### Database Models

**User Model**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  createdAt: Date
}
```

**Project Model**
```javascript
{
  title: String,
  description: String,
  goal: Number,
  raised: Number,
  category: String,
  image: String,
  creator: ObjectId (User),
  backers: Number,
  deadline: Date,
  status: String,
  rewards: Array,
  createdAt: Date
}
```

**Payment Model**
```javascript
{
  user: ObjectId (User),
  project: ObjectId (Project),
  amount: Number,
  stripePaymentId: String,
  status: String,
  receiptUrl: String,
  createdAt: Date
}
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/crowdfunding` |
| `JWT_SECRET` | Secret key for JWT | `your_secret_key` |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `STRIPE_SECRET_KEY` | Stripe secret key | `sk_test_...` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | `pk_test_...` |

---

## 🧪 Testing

### Test Stripe Payments

Use these test card numbers (see `STRIPE_TEST_CARDS.md` for more):

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
ZIP: 12345
```

**Declined Payment:**
```
Card: 4000 0000 0000 0002
Expiry: 12/25
CVC: 123
ZIP: 12345
```

### Testing Checklist

- [ ] User registration and login
- [ ] Browse projects
- [ ] Create project (admin only)
- [ ] Make payment with test card
- [ ] Download receipt
- [ ] View dashboard
- [ ] Edit profile
- [ ] Change password
- [ ] Admin dashboard access

---

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to Vercel or Netlify

3. Set environment variables in hosting platform

### Backend Deployment (Heroku/Railway)

1. Ensure all environment variables are set

2. Deploy to Heroku:
```bash
cd server
heroku create your-app-name
git push heroku main
```

3. Or deploy to Railway:
- Connect GitHub repository
- Set environment variables
- Deploy automatically

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in environment variables
4. Whitelist IP addresses

---

## 🔒 Security

### Implemented Security Measures

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Helmet for security headers
- ✅ Rate limiting on API endpoints
- ✅ Input validation and sanitization
- ✅ Protected routes (frontend & backend)
- ✅ Admin-only actions
- ✅ Secure payment processing (Stripe)

### Best Practices

- Never commit `.env` files
- Use strong JWT secrets
- Keep dependencies updated
- Use HTTPS in production
- Validate all user inputs
- Implement proper error handling

---

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Your Name** - Initial work

---

## 🙏 Acknowledgments

- Stripe for payment processing
- Cloudinary for image hosting
- MongoDB for database
- React and Node.js communities

---

## 📞 Support

For support, email support@fundrise.com or open an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Email notifications
- [ ] Social media integration
- [ ] Project comments and updates
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] Multi-currency support
- [ ] Reward fulfillment tracking

---

**Built with ❤️ using React, Node.js, and MongoDB**
