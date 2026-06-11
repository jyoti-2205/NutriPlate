# NutriPlate — Health-Aware Food Ordering System

**NutriPlate** is a full-stack web app for smart food ordering with real-time health warnings based on cholesterol, blood sugar, and BMI.

## Features

- User registration, login & JWT authentication
- Health profile with **edit profile** (cholesterol, sugar)
- **Health score** (0–100) and **BMI on dashboard**
- Food menu with **search**, Veg/Non-Veg filter, favorites
- **Nutrition tags** on each food item
- Safe/risky warnings per user health profile
- **Personalized recommendations** (safe foods only)
- **Shopping cart** with multi-item checkout
- **Order history**
- BMI calculator
- **Admin panel** — add/delete menu items
- **Dark mode**
- Mobile responsive UI

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Axios, Context API |
| Backend | Node.js, Express.js, JWT, bcrypt |
| Database | MySQL |

## Setup

### Prerequisites

- Node.js v16+
- MySQL running locally

### 1. Environment (optional)

Copy `backend/.env.example` to `backend/.env` and set your MySQL password:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=health_aware_db
JWT_SECRET=your_secret
PORT=5000
```

### 2. Backend

```bash
cd backend
npm install
npm start
```

Runs at **http://localhost:5000** — auto-seeds database on start.

### 3. Frontend

```bash
cd frontend
npm install
npm start
```

Opens at **http://localhost:3000**

## Demo Login (Users)

| Username | Password |
|----------|----------|
| `arun_sharma` | `password123` |

All seeded users use `password123`.

## Admin Login (Menu management only)

**URL:** `http://localhost:3000/admin/login`

Only pre-configured admins can access `/admin`. Regular user login does **not** work here.

| Admin Username | Password | Name |
|----------------|----------|------|
| `admin_arun` | `NutriAdmin@2026` | Arun Sharma (Admin) |
| `admin_priya` | `NutriAdmin@2026` | Priya Verma (Admin) |

To add/change admins, edit `backend/database/adminCatalog.js` and restart the backend.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register |
| POST | `/api/auth/login` | No | Login |
| PUT | `/api/auth/profile/:userId` | Yes | Update health stats |
| GET | `/api/foods` | No | List foods (`?filter=safe`, `?meal_type=Veg`) |
| POST | `/api/foods` | Yes | Add food (admin) |
| DELETE | `/api/foods/:id` | Yes | Delete food (admin) |
| GET | `/api/recommend/:userId` | Yes | Safe recommendations |
| POST | `/api/orders` | Yes | Place order |
| GET | `/api/orders/:userId` | Yes | Order history |

## Food Images

Edit URLs in both files (keep in sync):

- `backend/database/foodImages.js`
- `frontend/src/utils/foodImages.js`

## Project Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/dashboard` | Health overview + quick actions |
| `/foods` | Menu with search & filters |
| `/cart` | Shopping cart |
| `/recommendations` | Safe food suggestions |
| `/orders` | Order history |
| `/profile/edit` | Edit health profile |
| `/bmi` | BMI calculator |
| `/admin` | Manage menu items |
