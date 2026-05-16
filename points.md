# DevTinder - Code Documentation

## What We Built & Why

---

## 1. User Model (`src/models/user.js`)

### Schema Fields

| Field       | Type     | Purpose                                              |
| ----------- | -------- | ---------------------------------------------------- |
| `firstName` | String   | User's first name (4-50 chars, required)             |
| `lastName`  | String   | User's last name (2-50 chars, required)              |
| `email`     | String   | User's email - unique, trimmed, lowercase, validated |
| `password`  | String   | Hashed password (validated for strength)             |
| `age`       | Number   | Must be 18+ (minimum age validation)                 |
| `gender`    | String   | Only allows: "male", "female", "others"              |
| `photoUrl`  | String   | Profile picture URL (validated, has default)         |
| `skills`    | [String] | Array of skills                                      |
| `about`     | String   | User bio (has default value)                         |

### Schema Options

- **`timestamps: true`** → Mongoose automatically adds `createdAt` and `updatedAt` fields

### Schema Methods (Instance Methods)

#### `getJWT()`

```javascript
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "secret", {
    expiresIn: "1h",
  });
  return token;
};
```

**What it does:** Creates a JWT token for the user  
**Why we need it:** After login, we give user a token so they don't have to login again for 1 hour  
**How it works:**

- `this` refers to the user document calling this method
- `jwt.sign()` creates a token containing the user's `_id`
- Token expires in 1 hour (`"1h"`)

#### `validatePassword()`

```javascript
userSchema.methods.validatePassword = async function (passwordInputuser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordvalid = await bcrypt.compare(passwordInputuser, passwordHash);
  return isPasswordvalid;
};
```

**What it does:** Compares plain text password with hashed password in DB  
**Why we need it:** We store hashed passwords (not plain text), so we need bcrypt to compare  
**How it works:**

- Takes the password user typed during login
- Compares it with the hashed password stored in database
- Returns `true` if match, `false` if not

---

## 2. App Routes (`src/app.js`)

### POST `/signup` - User Registration

**Flow:**

1. Validate incoming data using `validationData(req)`
2. Extract `firstName`, `lastName`, `email`, `password` from request body
3. Hash the password using `bcrypt.hash(password, 10)` (10 = salt rounds)
4. Create new User document and save to MongoDB
5. Send success response

**Why hash password?**  
Never store plain text passwords! If database is hacked, hackers only get hashed passwords which are useless.

```javascript
const passwordHash = await bcrypt.hash(password, 10);
```

---

### POST `/login` - User Authentication

**Flow:**

1. Get `email` and `password` from request body
2. Find user by email in database
3. If user not found → throw error
4. Validate password using `user.validatePassword(password)`
5. If password valid → generate JWT token using `user.getJWT()`
6. Set token in cookie using `res.cookie("token", token)`
7. Send success response

**Why use cookies?**  
Browser automatically sends cookies with every request, so user stays logged in.

```javascript
const token = await user.getJWT();
res.cookie("token", token);
```

---

### GET `/profile` - Get Logged-in User Data

**Flow:**

1. Request first goes through `userAuth` middleware
2. Middleware validates the JWT token from cookie
3. If valid, middleware attaches `user` to `req.user`
4. Route handler sends back the user data

```javascript
app.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});
```

---

## 3. Authentication Middleware (`src/middlewares/auth.js`)

**What it does:**

- Reads JWT token from cookies
- Verifies token is valid and not expired
- Finds user from database using the `_id` in token
- Attaches user to `req.user` for route handlers to use

**Why we need it:**  
Protected routes (like `/profile`) should only work for logged-in users. Middleware checks this before the route runs.

---

## 4. Key Concepts Summary

### Authentication Flow

```
SIGNUP → Hash password → Save to DB

LOGIN → Find user → Validate password → Generate JWT → Set Cookie

PROTECTED ROUTE → Check Cookie → Verify JWT → Get User → Allow Access
```

### Libraries Used

| Library         | Purpose                                   |
| --------------- | ----------------------------------------- |
| `bcrypt`        | Hash passwords & compare hashed passwords |
| `jsonwebtoken`  | Create & verify JWT tokens                |
| `validator`     | Validate email, URL, password strength    |
| `cookie-parser` | Read cookies from requests                |
| `mongoose`      | MongoDB object modeling                   |

### Security Practices

1. **Never store plain passwords** → Use bcrypt to hash
2. **Use JWT for sessions** → Stateless authentication
3. **Set token in HTTP cookies** → More secure than localStorage
4. **Validate all inputs** → Using validator library
5. **Use middleware for auth** → DRY principle, reusable protection

---

## 5. Quick Reference

### To test signup (Postman/Thunder Client):

```
POST http://localhost:3000/signup
Body (JSON):
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Test@1234"
}
```

### To test login:

```
POST http://localhost:3000/login
Body (JSON):
{
    "email": "john@example.com",
    "password": "Test@1234"
}
```

### To test profile (after login):

```
GET http://localhost:3000/profile
(Cookie will be sent automatically if using same client)
```

---

## 6. Route Refactor & Bug Fixes (May 16, 2026)

This section documents what we did when splitting routes into separate files and fixing errors that blocked `npm start` and Postman signup (`404 Cannot POST /signup`).

### What we changed (big picture)

We moved API logic out of `src/app.js` into **route modules** under `src/routes/`, and wired them back into the main app with `app.use()`.

| File | Responsibility |
| ---- | -------------- |
| `src/routes/auth.js` | `POST /signup`, `POST /login` |
| `src/routes/profile.js` | `GET /profile` (protected with `userAuth`) |
| `src/routes/request.js` | `POST /sendConnectionRequest` (protected) |
| `src/middlewares/auth.js` | `userAuth` middleware (JWT from cookie) |
| `src/app.js` | Express setup, DB connect, **mount routers** |

**Important rule:** `require("./routes/auth.js")` only **loads** the router. Routes are **not live** until you mount them:

```javascript
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/request.js");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
```

Without `app.use(...)`, the server still runs and Mongo connects, but every API call returns **404** (e.g. `Cannot POST /signup`).

---

### Bug 1: `Cannot find module './middlewares/auth'`

**Where:** `src/routes/profile.js`, `src/routes/request.js`

**Wrong:**

```javascript
const { userAuth } = require("./middlewares/auth");
```

**Why it failed:** Files in `src/routes/` tried to load `src/routes/middlewares/auth.js`, which does not exist. The real file is `src/middlewares/auth.js`.

**Fix:**

```javascript
const { userAuth } = require("../middlewares/auth");
```

`..` goes up one folder: `routes` → `src`, then into `middlewares/auth.js`.

---

### Bug 2: `ReferenceError: requestRouter is not defined`

**Where:** `src/routes/request.js`

**Wrong:**

```javascript
const requestAuth = express.Router();  // created as requestAuth

requestRouter.post("/sendConnectionRequest", ...);  // used requestRouter
module.exports = requestRouter;
```

**Fix:** Use one name everywhere — `requestRouter` (matches `app.js`).

**Also fixed in the same file:**

```javascript
req.send(...)   // wrong — request has no .send()
res.send(...)   // correct — response sends data to client
```

---

### Bug 3: `profile.js` used `app` instead of `profileRouter`

**Where:** `src/routes/profile.js`

**Wrong:** `app.get("/profile", ...)` — `app` is not defined in a route file.

**Fix:**

```javascript
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

module.exports = profileRouter;
```

---

### Bug 4: Wrong `require` paths in `auth.js`

**Where:** `src/routes/auth.js`

**Wrong (from `src/routes/`):**

```javascript
const { validationData } = require("./utils/validation");
const User = require("./models/user");
```

**Fix:**

```javascript
const { validationData } = require("../utils/validation");
const User = require("../models/user");
```

Same reason as middleware: paths are relative to the **current file’s folder**, not the project root.

---

### Bug 5: Postman `404 Cannot POST /signup` (main issue)

**Symptom:** Server logs showed:

```
connected to mongo databaase
server is running on port
```

But Postman returned **404** for `POST http://localhost:3000/signup`.

**Cause:** Routers were **imported** in `app.js` but **not mounted** with `app.use()`. Express had no handler for `/signup`.

**Not the cause:** Server does **not** need to “fully load” anything extra after Mongo + listen. Once those two log lines appear, the server is ready — the problem was missing route registration.

**Fix:** Add the three `app.use("/", ...)` lines shown in the table above.

**After fix:** Signup returns **200** with `user added successully` (when body passes validation and email is new).

---

### How to verify routes are working

1. Save all files (`app.js`, `routes/*.js`).
2. Restart server: `Ctrl+C`, then `npm start`.
3. Postman:
   - Method: **POST**
   - URL: `http://localhost:3000/signup`
   - Body: **raw** → **JSON**

```json
{
  "firstName": "dhoni",
  "lastName": "singh",
  "email": "dhoni@gmail.com",
  "gender": "male",
  "password": "Dhoni@123"
}
```

**Validation reminders** (from `src/utils/validation.js`):

- `firstName` / `lastName` required; `firstName` length **4–50**
- `email` must be valid (validator)
- `password` must be strong (validator)

If route exists but data is bad → **400** with error message (not 404).

---

### Common errors cheat sheet

| Error | Meaning | What to check |
| ----- | ------- | ------------- |
| `Cannot find module './middlewares/auth'` | Wrong relative path from `routes/` | Use `../middlewares/auth` |
| `requestRouter is not defined` | Variable name mismatch | Same name when creating router and exporting |
| `Cannot POST /signup` (404) | Route not registered | `app.use("/", authRouter)` in `app.js` |
| `validationData is not defined` | Missing or wrong import in `auth.js` | `require("../utils/validation")` |
| Changes in editor but 404 persists | Old process or unsaved file | Save files, restart `npm start` |

---

### Mental model: request flow after refactor

```
Client (Postman)
    → POST /signup
    → app.js (express.json, cookieParser)
    → app.use("/", authRouter)
    → authRouter.post("/signup", handler)
    → validationData → bcrypt.hash → User.save()
    → response
```

Protected route example (`/profile`):

```
GET /profile
    → app.use("/", profileRouter)
    → profileRouter.get("/profile", userAuth, handler)
    → userAuth reads cookie token → sets req.user
    → handler sends req.user
```

---

### Files touched in this session

- `src/app.js` — mount `authRouter`, `profileRouter`, `requestRouter`
- `src/routes/auth.js` — fix imports (`../utils`, `../models`)
- `src/routes/profile.js` — `../middlewares/auth`, use `profileRouter`
- `src/routes/request.js` — `requestRouter` naming, `res.send`, `../middlewares/auth`

---

_Last Updated: May 16, 2026_
