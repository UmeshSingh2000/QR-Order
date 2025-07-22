# 🍽️ QR-Based Order System for Restaurants

A full-stack MERN (MongoDB, Express, React, Node.js) web application that allows customers to place orders in a restaurant by scanning a QR code. Designed to streamline the ordering process and reduce dependency on wait staff.

## 🚀 Features

- 📱 **QR Code-based Access**: Each table has a unique QR code that leads to a digital menu.
- 📋 **Dynamic Menu**: View categorized menu items with prices, descriptions, and optional images.
- 🛒 **Add to Cart**: Customers can add multiple items, select variants (half/full, small/medium/large), and update quantities.
- ✅ **Place Orders**: Orders are sent directly to the kitchen system for processing.
- 🔐 **Admin Dashboard**:
  - Manage menu sections and items.
  - Track ongoing and completed orders.
- 🧾 **Order Tracking**: Customers can track the status of their order (Pending, Preparing, Served).

## 🧱 Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS**
- **Axios** for API calls
- **React Router DOM**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**

### Utilities
- **JWT Authentication**
- **bcryptjs** for password hashing
- **qrcode** package for dynamic QR code generation
- **dotenv** for environment configuration

# Installation Steps
Follow these steps to get the project running on your local machine:
- Clone the Repository
```
git clone https://github.com/UmeshSingh2000/QR-Order.git
cd QR-Order
```
- Setup the Backend (Express + MongoDB)
```
cd Backend
npm install
```
- Create .env file
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
- Start Backend Server
```
npm run dev
```
- Setup the Frontend
```
cd UserFrontend
npm install
npm run dev
```
- Setup the AdminFrontend
```
cd AminFrontend
npm install
npm run dev
