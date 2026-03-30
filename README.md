## 📌 Project Title

**Grocery List Manager – Purchase Tracking System**

---

## 📖 Description

Grocery List Manager is a full-stack web application built using the MERN stack that helps users manage their daily grocery items efficiently. It allows users to add items, categorize them, track purchased items, and manage their shopping list with a clean and interactive interface.

---

## 🚀 Project Overview

The application provides a centralized system where:

* 🛒 Grocery items can be added and managed
* 📦 Items can be marked as purchased
* 📊 Real-time updates are reflected in the UI
* 🔄 Data is stored and retrieved from MongoDB
* 🌐 Frontend and backend communicate seamlessly

The project follows a **MERN stack architecture** ensuring scalability and performance.

---

## 🛠️ Tech Stack

**Frontend:**

* React.js
* CSS (Custom Styling)

**Backend:**

* Node.js
* Express.js

**Database:**

* MongoDB

---

## ✨ Features

* ✅ Add new grocery items
* ✅ View all items
* ✅ Delete items
* ✅ Mark items as purchased
* ✅ View pending and bought items
* ✅ Filter items (All / Pending / Bought)
* ✅ Clear purchased items
* ✅ Checkout system with order summary
* ✅ Data persistence using MongoDB

---

## 🔗 API Endpoints

### Items

* `GET /items` → Get all items
* `GET /items/stats` → Get total, purchased, and pending count
* `POST /items` → Add new item
* `PUT /items/:id` → Update item (mark purchased)
* `DELETE /items/:id` → Delete item

---

## ⚙️ How It Works

1. User interacts with the frontend UI
2. React sends API requests using fetch
3. Express server handles routes and logic
4. Data is stored/retrieved from MongoDB
5. Response is sent back and displayed in UI

---

## 📦 Installation & Setup

```bash
# Clone repository
git clone <your-repo-link>

# Backend setup
cd backend
npm install
node server.js

# Frontend setup
cd frontend
npm install
npm start
