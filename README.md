# 🚀 Zorvyn Finance Manager

A **production-grade full-stack finance management system** built using the **MERN stack**, designed to handle financial data processing, role-based access control, and real-time dashboard analytics.

---

## 🔥 Features

- 🔐 Secure JWT-based Authentication
- 👥 Role-Based Access Control (RBAC)
- 💰 Financial Record Management (Income & Expense Tracking)
- 📊 Dynamic Dashboard with Aggregated Insights
- ⚡ Fully Integrated MERN Stack (Frontend + Backend)
- 🧠 Clean Architecture & Scalable Code Structure

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js (Vite), TypeScript, Tailwind CSS, Axios, Context API |
| **Backend** | Node.js, Express.js, TypeScript, MongoDB + Mongoose |
| **Security** | JWT, bcrypt, Zod |

---

## 📂 Project Structure

```
zorvyn/
├── backend/
│   └── src/
│       ├── config/         # DB connection
│       ├── controllers/    # auth, dashboard, record, user
│       ├── middlewares/    # auth, error, validate
│       ├── models/         # FinancialRecord, User
│       ├── routes/         # auth, dashboard, record, user
│       ├── schemas/        # Zod schemas
│       ├── app.ts
│       ├── seed.ts
│       └── server.ts
│
└── frontend/
    └── src/
        ├── components/layout/   # Layout, Navbar, ProtectedRoute, Sidebar
        ├── pages/               # Dashboard, Login, Records, UserManagement
        ├── services/            # api.ts (Axios)
        ├── store/               # auth context
        └── App.tsx
```

---

## 👥 User Roles & Permissions

| Role | Access Level |
|------|-------------|
| **Viewer** | View personal financial data |
| **Analyst** | View and analyze all data (read-only) |
| **Admin** | Full system access |

Role-based access is enforced using backend middleware.

---

## ⚙️ Setup & Installation

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/zorvyn
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 API Endpoints

### 🔐 Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### 👥 Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| PUT | `/api/users/:id/role` | Update user role |
| PUT | `/api/users/:id/status` | Update user status |

### 💰 Records
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/records` | Get all records |
| POST | `/api/records` | Create a record |
| PUT | `/api/records/:id` | Update a record |
| DELETE | `/api/records/:id` | Delete a record |

### 📊 Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get aggregated dashboard data |

---

## 📊 Dashboard & Analytics

- Total Income & Expenses
- Net Balance
- Category-wise breakdown
- Monthly trends
- Recent activity

Powered by **MongoDB Aggregation Pipelines**.

---

## 🔐 Security

- JWT-based authentication with protected routes
- Password hashing via bcrypt
- Role-based authorization middleware
- Input validation with Zod schemas
- Centralized error handling

---

## 🧠 Key Engineering Decisions

- Modular architecture (controllers, routes, services)
- Centralized error handling middleware
- Schema validation with Zod
- Scalable folder structure
- Clean separation of frontend & backend concerns
