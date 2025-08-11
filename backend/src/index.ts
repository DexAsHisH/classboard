import express from "express";
import cors from "cors";
import login from "./routes/auth/login.js";
import signup from "./routes/auth/signup.js";
import dashboard from "./routes/dashboard.js";
import assignment from "./routes/assignment.js";
import courses from "./routes/courses.js";
import cookieParser from "cookie-parser";
import { protectedAuth } from "./middleware/protectedAuth.js";
import me from "./routes/auth/me.js";

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigins = [
  "http://localhost:5173",
  "https://class-board.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", login);
app.use("/api", signup);
app.use("/api", protectedAuth, me);
app.use("/api", protectedAuth, dashboard);
app.use("/api", protectedAuth, courses);
app.use("/api", protectedAuth, assignment);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
export default app;
