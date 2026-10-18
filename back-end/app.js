const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const globalError = require("./controller/errorController");
const paymentRouter = require("./routes/paymentRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const courseRouter = require("./routes/courseRoutes");
const surveyRouter = require("./routes/surveyRoutes");
const purchaseRouter = require("./routes/coursePurchaseRoutes");
const liveTutingRouter = require("./routes/liveTutingRoutes");
const QARouter = require("./routes/QARoutes");
const NoteRouter = require("./routes/noteRoutes");
const AnnouncementRouter = require("./routes/announcementRoutes");
const AppError = require("./utils/AppError");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://code-hives.netlify.app"],
    methods: ["GET", "POST", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

mongoose.set("strictQuery", true);

app.get("/", (req, res) => {
  res.send("hey");
});

app.use("/api/payment", paymentRouter);
app.use("/api/users", userRouter);
app.use("/api/review", reviewRouter);
app.use("/api/course", courseRouter);
app.use("/api/survey", surveyRouter);
app.use("/api/purchase", purchaseRouter);
app.use("/api/questions", QARouter);
app.use("/api/notes", NoteRouter);
app.use("/api/announcements", AnnouncementRouter);
app.use("/api/live-tutoring", liveTutingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalError);

// Connect once when this module loads.
// Don't make route registration depend on the connection promise.
const mongoConnection = mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});

mongoConnection
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Vercel can import the Express app.
module.exports = app;

// Run a local HTTP server only when executing this file directly.
if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  mongoConnection
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(() => {
      process.exitCode = 1;
    });
}
