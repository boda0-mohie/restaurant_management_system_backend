# Restaurant Management System Backend (Node.js)

A fully featured **Restaurant Management System Backend** built using **Node.js, Express.js, MongoDB, and Stripe Payments**.  
This project simulates a real restaurant backend including **orders, payments, roles, dashboards, and analytics**.

---

## 🚀 Features

### 🔐 Authentication & Roles
- JWT-based Authentication
- Role-based Access Control (Admin, Chef, Delivery, User)

### 🍽️ Menu Management
- CRUD for menu items
- Categories module
- Item assignment to categories

### 🛒 Order Management
- Create orders
- Order workflow lifecycle:
  - `pending` → `preparing` (Chef)
  - `preparing` → `on_the_way` (Delivery)
  - `on_the_way` → `completed` (Delivery)
- User can view active orders and order history

### 👨‍🍳 Role Dashboards
- **User Dashboard** → orders + total spent + last order
- **Chef Dashboard** → assigned orders + mark as prepared
- **Delivery Dashboard** → assigned deliveries + update status
- **Admin Dashboard** → users, menu, analytics

### 💳 Stripe Payment Integration
- Stripe Checkout session
- Stripe Webhook support
- Auto-update order + payment status

### 📊 Admin Analytics
- Total orders
- Revenue
- Most ordered items
- Active users

---

## 🧩 System Architecture

### Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Stripe Payments**
- **JWT Authentication**

---

## 📁 Folder Structure
```
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── server.js
├── .env
└── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```
git clone https://github.com/boda0-mohie/restaurant_management_system_backend.git
cd restaurant_management_system_backend
```

### 2️⃣ Install dependencies
```
npm install
```

### 3️⃣ Create and configure `.env`
```
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
CLIENT_URL=http://localhost:3000
```

### 4️⃣ Run the server
```
npm run dev
```

---

## 🔌 API Endpoints Overview

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### User
- GET `/api/user/dashboard`

### Admin
- GET `/api/admin/analytics`
- PUT `/api/admin/user/:id`

### Menu & Categories
- CRUD operations

### Orders
- POST `/api/orders`
- GET `/api/orders/:id`
- PUT `/api/orders/:id/status`

### Payments
- POST `/api/payments/create-checkout-session`
- POST `/api/payments/webhook` *(Stripe only)*

---

## 🧪 Testing
Use Postman to test:
- Login and get token
- Create menu items
- Create order
- Start Stripe session
- Trigger webhook using Stripe CLI

```
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## 🏁 Roadmap (Future Versions)
- Add table reservation system
- Add push notifications (real-time)
- Add restaurant staff shifts management
- Add frontend using React

---

## 👤 Author
**Abdelrahman Mohie**
- Backend Developer
- GitHub: https://github.com/boda0-mohie

---

## ⭐ Contributions
Pull requests are welcome! Feel free to open issues.

---

## 📜 License
Open-source project. Use freely for learning or production.
