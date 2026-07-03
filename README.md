# Atlas ERP

A full-stack Enterprise Resource Planning system built with the MERN stack. Designed for small to mid-size companies to manage HR, Finance, Supply Chain, and AI-powered forecasting from a single internal dashboard.

**Live Demo:** [erp-gamma-teal.vercel.app](https://erp-gamma-teal.vercel.app)

---

## Features

### Authentication & Access Control
- JWT-based authentication with bcrypt password hashing
- Role-based access control — three roles: `admin`, `hr`, `employee`
- Protected routes on both frontend and backend
- Persistent login via localStorage

### HR Module
- Employee management — add, edit, remove employees
- Daily attendance marking (present / absent) with upsert logic
- Leave request workflow — employees apply, HR/admin approve or reject

### Finance Module
- Income and expense transaction tracking with categories
- Live summary — total income, total expense, net balance
- Last 6 months bar chart visualization

### Supply Chain Module
- Purchase order management with supplier and item tracking
- Status workflow — pending → approved → delivered
- Role-restricted actions (admin-only delete)

### AI Forecast Module
- Linear trend prediction based on last 6 months of expense data
- Google Gemini API integration for natural language financial insight
- Line chart showing historical data + predicted next month

### Dashboard
- Live overview combining all modules
- Today's attendance summary (present/absent count)
- Recent transactions
- Real-time employee count, net balance, and forecast

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| @google/generative-ai | Gemini AI integration |
| CORS | Cross-origin request handling |

### Frontend
| Technology | Purpose |
|---|---|
| React (Vite) | UI framework |
| Tailwind CSS v3 | Styling |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| Recharts | Data visualization |
| React Context API | Global auth state |

---

## Project Structure

```
atlas-erp/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── attendanceController.js
│   │   ├── leaveController.js
│   │   ├── financeController.js
│   │   ├── forecastController.js
│   │   └── supplyChainController.js
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification + role checks
│   ├── models/
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Attendance.js
│   │   ├── Leave.js
│   │   ├── Transaction.js
│   │   └── PurchaseOrder.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── financeRoutes.js
│   │   ├── forecastRoutes.js
│   │   └── supplyChainRoutes.js
│   ├── .env                       # Not committed
│   └── server.js
└── frontend/
    ├── src/
    │   ├── api.js                 # Centralized API base URL
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Layout.jsx
    │   │   └── ProtectedRoute.jsx
    │   └── pages/
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── Dashboard.jsx
    │       ├── HR.jsx
    │       ├── Finance.jsx
    │       ├── SupplyChain.jsx
    │       ├── Forecast.jsx
    │       └── Profile.jsx
    ├── .env                       # Not committed
    └── index.html
```

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login and get token |
| GET | `/api/auth/me` | Protected | Get current user |

### HR — Employees
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/employees` | admin, hr | Get all employees |
| POST | `/api/employees` | admin, hr | Add employee |
| PUT | `/api/employees/:id` | admin, hr | Update employee |
| DELETE | `/api/employees/:id` | admin only | Remove employee |

### HR — Attendance
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/attendance` | admin, hr | Mark attendance |
| GET | `/api/attendance?date=` | admin, hr | Get attendance by date |

### HR — Leave
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/leaves` | all roles | Apply for leave |
| GET | `/api/leaves` | all roles | Get leave requests |
| PUT | `/api/leaves/:id` | admin only | Approve or reject |

### Finance
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/finance/transactions` | admin, hr | Get all transactions |
| POST | `/api/finance/transactions` | admin, hr | Add transaction |
| DELETE | `/api/finance/transactions/:id` | admin, hr | Delete transaction |
| GET | `/api/finance/summary` | admin, hr | Get totals + monthly data |

### Supply Chain
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/supplychain` | all roles | Get all purchase orders |
| POST | `/api/supplychain` | admin, hr | Create purchase order |
| PUT | `/api/supplychain/:id` | admin, hr | Update order status |
| DELETE | `/api/supplychain/:id` | admin only | Delete order |

### Forecast
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/forecast/expense` | all roles | Get AI forecast + history |

---

## Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/atlas-erp.git
cd atlas-erp
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

Start the backend:
```bash
node server.js
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

### 4. Open the app
Go to `http://localhost:5173` and register an admin account.

---

## Deployment

| Service | Purpose | URL |
|---|---|---|
| Render | Backend hosting | https://erp-phxi.onrender.com |
| Vercel | Frontend hosting | https://erp-gamma-teal.vercel.app |
| MongoDB Atlas | Database | Cloud |

> **Note:** Render free tier sleeps after 15 minutes of inactivity. First request after sleep may take ~30 seconds.

---

## Design Decisions

**Employee ≠ User**
User model handles authentication. Employee model handles HR data. Separated intentionally — mirrors how real ERPs work where system access and HR records are managed independently.

**Upsert for Attendance**
Marking attendance twice on the same date updates the existing record instead of creating a duplicate. Ensures data integrity without extra validation logic.

**Math + AI for Forecast**
Linear trend calculation is the base prediction engine — fast, reliable, no external dependency. Gemini API adds qualitative reasoning on top. If the AI API is unavailable, the numeric prediction still works.

**Dual-layer Security**
Frontend hides UI elements based on role. Backend middleware enforces the same rules independently. Bypassing the UI doesn't grant access to restricted API endpoints.

---

## Roadmap

- [ ] Link User and Employee models on registration
- [ ] Input validation with express-validator on all endpoints  
- [ ] Payroll module (salary, deductions, payslip generation)
- [ ] Inventory management under Supply Chain
- [ ] Email notifications for leave approval/rejection
- [ ] Advanced AI forecast using income + expense combined analysis

---

## Author

**Soham Satale**
B.Tech EEE, VNIT Nagpur
[GitHub](https://github.com/YOUR_USERNAME)
