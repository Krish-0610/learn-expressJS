# Express.js Boilerplate

A boilerplate for building RESTful APIs using **Express.js**, **Mongoose**, and **MongoDB**. This project offers a clean and structured setup for developing APIs with built-in support for authentication, error handling, and database integration.

---

## 🔧 Project Structure

```
src/
├── controllers/     # Application logic
├── models/          # Mongoose models (schemas)
├── routes/          # API route definitions
├── db/              # MongoDB connection config
├── middleware/      # Custom Express middlewares
├── utils/           # Reusable helper functions
.env                 # Environment variables
.gitignore           # Files ignored by Git
app.js               # Express app setup
index.js             # Entry point (server startup)
constants.js         # Centralized constant values
```

---

## 🌐 Database Setup

1. Configure MongoDB connection in `src/db/index.js` using `mongoose`.
2. Create a `.env` file at the root with:

```env
MONGO_URI=mongodb://localhost:27017/{DB_NAME}
```

Replace `{DB_NAME}` with your desired DB name.

3. Initialize DB connection in `src/index.js`:

```js
import { connectDB } from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.on("error", (err) => {
      console.error("App error:", err);
      throw err;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
```

---

## 🚀 Express App Setup

In `src/app.js`:

```js
import express from "express";
import cors from "cors";
import { router } from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", router);

export { app };
```

---

## 🧠 Models

Define your Mongoose schemas in `src/models/`. Example:

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
export default User;
```

---

## 🛠️ Utilities

Add utility functions in `src/utils/`.

### Error Handler (`apiError.js`):

```js
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
```

### Async Wrapper (`asyncHandler.js`):

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export { asyncHandler };
```

Use `asyncHandler` to eliminate repeated `try/catch` blocks in controllers.
Majority of your controller functions can be wrapped with this utility to handle errors gracefully.

---

## 📦 Controllers

Located in `src/controllers/`, controllers handle business logic.

Example: `userController.js`

```js
import User from "../models/user.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, data: user });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.status(200).json({ success: true, data: user });
});

export { register, login };
```

This controller handles user registration and login, using the `asyncHandler` utility to manage asynchronous operations and error handling.

---

## 🛡️ Middleware

Custom middlewares in `src/middleware/`.

Example: `auth.js`

```js
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new ApiError(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(new ApiError(403, "Forbidden"));
    req.user = user;
    next();
  });
};

export { authMiddleware };
```

Middleware functions can be used to process requests before they reach the controllers, such as authentication checks or logging.
`next()` is called to pass control to the next middleware or route handler.

---

## 🔁 Routes

Define endpoints in `src/routes/`.

### Example: `userRoutes.js`

```js
import express from "express";
import { register, login } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", authMiddleware, login);

export { router };
```

---

## 🔗 Combine Routes

Centralize routes in `src/app.js`:

```js
import express from "express";
import { router as userRoutes } from "./routes/userRoutes.js";

const router = express.Router();
router.use("/api/v1/users", userRoutes);

export { router };
```

With this setup, you can easily add more routes and controllers as your application grows.

- This file combines all the routes into a single router that can be used in the main application file.

- route: `/api/v1/users/register` for user registration
- route: `/api/v1/users/login` for user login

---

## 🚦 Starting the Server

### `src/index.js`:

```js
import { app } from "./app.js";
import connectDB from "./db/index.js";
import { app } from "./app.js";


connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(` Server is running at ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO DB connection failed !!!", err);
  });
```

---

