# CodeHive

CodeHive is a full-featured **MERN Stack** e-learning platform inspired by Udemy. It allows instructors to create and sell online courses, and enables students to buy, review, and learn through video content.

---

## 🚀 Features

- 🧑‍🏫 Instructor Dashboard:
  - My Courses
  - Create New Courses
  - Performance Analytics
  - Course Reviews
- 🎓 Student Dashboard:
  - Enrolled Courses
  - Leave Course Reviews
- 🔐 JWT-based Authentication
- 💳 Stripe Payment Integration
- 📹 Video Storage via Supabase
- 🔍 Search functionality
- ✍️ Course Reviews
- 🔄 CRUD operations
- 📡 Live Tutor

---

## 🧱 Tech Stack

| Frontend      | Backend         | Database | Tools & APIs                   |
|---------------|------------------|----------|--------------------------------|
| React + Vite  | Node.js + Express | MongoDB | Stripe, Supabase, JWT, Tailwind CSS |

---

## 📁 Project Structure

```
root/
├── front-end/     → React + Vite frontend
└── back-end/      → Express + MongoDB backend
```

---

## ⚙️ Installation

### 🔹 Frontend

```bash
cd front-end
npm install
npm run dev
```

### 🔹 Backend

```bash
cd back-end
npm install
npm start
```

---

## 🔐 Environment Variables

### 🔸 Frontend `.env`

```env
VITE_BACKEND_URL=https://your-backend-url.com
VITE_FRONTEND_URL=https://your-frontend-url.com
```

### 🔸 Backend `.env`

```env
PORT=8080
DATABASE_URL=mongodb://localhost:27017/CodeHive
MONGODB_URI=your_mongodb_connection_uri

JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRE=90

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```


## 🤝 Contributing

Pull requests are welcome! Please open an issue for major feature changes first.

---

## 📫 Contact

- GitHub: [@affan9431](https://github.com/affan9431)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
