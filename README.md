# 💰 Expense Tracker

A full-stack Expense Tracker application built using the MERN stack.

The application allows users to securely create an account, log in, manage their daily expenses, search and filter transactions, and analyze spending through interactive charts and monthly summaries.

---

## ✨ Features

### Authentication

- User Registration
- User Login
- JWT Authentication
- Password Hashing
- Protected Routes
- User Profile
- Logout

### Expense Management

- Add Expense
- View Expenses
- Edit Expense
- Delete Expense
- Expense Notes
- Expense Categories
- Expense Dates

### Search & Filters

- Search expenses by title
- Filter expenses by category
- Filter expenses by month
- Clear month filter

### Dashboard & Analytics

- Total Expense Summary
- Current Month Spending
- Selected Month Spending
- Total Transaction Count
- Category-wise Spending Chart
- Monthly Spending Chart
- Interactive Chart Tooltips

### User Interface

- Responsive Dashboard
- Add Expense Modal
- Edit Expense Modal
- Profile Page
- Dark UI
- Mobile Responsive Design

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- React Router DOM
- Axios
- Recharts
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs
- CORS
- Validator
- dotenv

### Database

- MongoDB Atlas

---

## 📁 Project Structure

```text
expense-tracker/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🔐 Authentication

The application uses JWT-based authentication.

After successful login, the authenticated user can access protected pages and expense-related functionality.

Passwords are securely hashed before being stored in the database.

---

## 🔗 API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login an existing user |
| GET | `/api/auth/profile` | Get authenticated user profile |

### Expense Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expenses` | Create a new expense |
| GET | `/api/expenses` | Get user expenses |
| GET | `/api/expenses/:id` | Get a specific expense |
| PUT | `/api/expenses/:id` | Update an expense |
| DELETE | `/api/expenses/:id` | Delete an expense |

Protected endpoints require authentication.

---

## ⚙️ Environment Variables

Environment variables are required for both the backend and frontend.

### Backend

Create a `.env` file inside the `server` directory:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace the placeholder values with your own configuration.

### Frontend

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit `.env` files containing secrets or database credentials to GitHub.

---

## 🚀 Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project

```bash
cd expense-tracker
```

---

## 🖥️ Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create the required `.env` file.

Start the backend development server:

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:5000
```

---

## 💻 Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create the required `.env` file.

Start the frontend development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

## 📊 Dashboard

After authentication, users are redirected to the dashboard.

The dashboard provides:

- Total spending
- Current month spending
- Selected month spending
- Transaction count
- Category-wise expense analysis
- Monthly spending analysis
- Recent expenses
- Search functionality
- Category filtering
- Month filtering
- Add expense functionality
- Edit expense functionality
- Delete expense functionality

---

## 📈 Data Visualization

The application uses **Recharts** for expense visualization.

### Spending by Category

A chart displays how the user's total expenses are distributed across categories such as:

- Food
- Travel
- Shopping
- Bills
- Health
- Entertainment
- Other

### Monthly Spending

A bar chart provides a visual representation of expenses across different months.

---

## 🔎 Expense Filtering

Users can quickly find transactions using:

### Search

Search expenses using the expense title.

### Category Filter

Filter transactions based on their category.

### Month Filter

Select a specific month to view expenses and spending totals for that period.

---

## 👤 Profile

Authenticated users can access their profile page to view their account information.

The profile page displays:

- User name
- Email address
- Account status

Users can return directly to the dashboard from the profile page.

---

## 🔒 Security

The application includes several security-related features:

- Password hashing using bcryptjs
- JWT-based authentication
- Protected frontend routes
- Protected backend routes
- User-specific expense data
- Environment variables for sensitive configuration

---

## 📱 Responsive Design

The application is designed to work across different screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile

The dashboard, expense forms, filters, charts, and profile interface adapt to smaller screens.

---

## 🔄 Application Flow

```text
Register
   ↓
Login
   ↓
Authentication
   ↓
Protected Dashboard
   ↓
Expense Management
   ├── Add Expense
   ├── Edit Expense
   └── Delete Expense
   ↓
Search & Filters
   ↓
Expense Analytics
   ├── Category Chart
   └── Monthly Chart
   ↓
Profile / Logout
```

---

## 🧪 Main Functionalities to Test

Before deployment, verify the following:

- User registration works
- User login works
- Protected routes work
- Dashboard loads expenses
- Add Expense works
- Edit Expense works
- Delete Expense works
- Search works
- Category filter works
- Month filter works
- Clear Month works
- Charts update correctly
- Profile page opens
- Back to Dashboard works
- Logout works
- Responsive layout works

---

## 🌐 Deployment

The project contains separate frontend and backend applications.

Recommended deployment structure:

```text
Frontend
React + Vite
    ↓
Frontend Hosting

Backend
Node.js + Express
    ↓
Backend Hosting
    ↓
MongoDB Atlas
```

After deployment, configure the frontend API environment variable with the deployed backend API URL.

---

## 🔮 Future Improvements

Possible future enhancements include:

- Forgot Password
- Reset Password
- Email Verification
- User Profile Editing
- Budget Limits
- Budget Alerts
- Recurring Expenses
- Expense Pagination
- Advanced Date Filters
- Download Expense Reports
- CSV Export
- PDF Reports
- Dark/Light Theme Toggle
- Advanced Analytics

---

## 🎯 Project Purpose

This project was developed to practice and demonstrate full-stack MERN development, including:

- Frontend development with React
- REST API development
- Authentication and authorization
- MongoDB database integration
- CRUD operations
- API integration with Axios
- Protected routing
- Data visualization
- Search and filtering
- Responsive UI development

---

## 👨‍💻 Author

**Raju Kumar**

React & React Native Developer
