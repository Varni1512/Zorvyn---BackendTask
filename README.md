# Zorvyn Finance Manager

A robust, full-stack financial record and user management application built to handle tracking, categorization, and aggregation of financial data with role-based access control.

## 🚀 Features

- **Role-Based Access Control (RBAC):** Distinct permissions for `Viewer`, `Analyst`, and `Admin`.
- **Financial Records Management:** Full CRUD capabilities for tracking Income and Expenses over time.
- **Dynamic Dashboards:** Advanced MongoDB Aggregation pipelines generating category visualizations, total cash flows, and monthly financial trends.
- **Type-Safe Validation:** Strictly typed API endpoints validated at runtime with `Zod`.
- **Error Handling:** Robust, centralized async error handling avoiding raw application crashes.

## 🏗 Architecture & Tech Stack

**Backend System:**
- **Node.js & Express:** Lightweight, scalable server base.
- **TypeScript:** Strict type checking to prevent runtime property errors.
- **MongoDB & Mongoose:** NoSQL data modeling with embedded schemas, indexing, and high-performance `$facet` aggregation pipelines.
- **JWT & bcrypt:** Stateless, secure JSON Web Token authentication.
- **Zod:** Runtime schema validation for data integrity.

## 👥 User Roles & Access Hierarchy

The system defines specific privileges to protect data:

| Role | Permissions |
| ---- | ----------- |
| **Viewer** | Default level. Can view and manage *only* their own personal financial records and personal dashboard. Cannot read global system data. Cannot create records by default. |
| **Analyst** | Analytical level. Granted read-only permission to query and summarize financial records *across all users*. Ideal for reporting. |
| **Admin** | Management level. Full CRUD rights on any record. Controls user promotion, suspension (`isActive`), and role assignment. |

## ⚙️ Backend Setup & Installation

**Prerequisites:** Node.js (v18+) and a MongoDB instance (local or Atlas).

1. **Navigate to the Backend Directory:**
   ```bash
   cd backend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/zorvyn
   JWT_SECRET=super_secret_jwt_key
   NODE_ENV=development
   ```

4. **Seed the Database (Optional):**
   ```bash
   npm run seed
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Build for Production:**
   ```bash
   npm run build
   npm run start
   ```

## 🗺️ Core API Routes

### Authentication
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate and retrieve JWT token.
- `GET /api/auth/me` - Fetch active user profile.

### Users (Admin Only)
- `GET /api/users` - List all users.
- `PUT /api/users/:id/role` - Update user access level.
- `PUT /api/users/:id/status` - Toggle active/inactive.

### Financial Records
- `GET /api/records` - List records (Globally for Admin/Analyst, isolated for Viewer).
- `POST /api/records` - Create a new entry (Admin).
- `PUT /api/records/:id` - Update existing entry (Admin).
- `DELETE /api/records/:id` - Remove an entry (Admin).

### Dashboard Summaries
- `GET /api/dashboard` - Retrieve aggregated insights (Totals, Trends, Categories).

---
*Built with professional development standards in mind.*
