# DevTinder - Code Documentation

## What We Built & Why

---

## 1. User Model (`src/models/user.js`)

### Schema Fields

| Field | Type | Purpose |
|-------|------|---------|
| `firstName` | String | User's first name (4-50 chars, required) |
| `lastName` | String | User's last name (2-50 chars, required) |
| `email` | String | User's email - unique, trimmed, lowercase, validated |
| `password` | String | Hashed password (validated for strength) |
| `age` | Number | Must be 18+ (minimum age validation) |
| `gender` | String | Only allows: "male", "female", "others" |
| `photoUrl` | String | Profile picture URL (validated, has default) |
| `skills` | [String] | Array of skills |
| `about` | String | User bio (has default value) |

### Schema Options
- **`timestamps: true`** → Mongoose automatically adds `createdAt` and `updatedAt` fields

### Schema Methods (Instance Methods)

#### `getJWT()`
```javascript
userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "secret", { expiresIn: "1h" })
    return token;
}
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
}
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
app.get("/profile", userAuth, async(req, res) => {
    const user = req.user;
    res.send(user);
})
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

| Library | Purpose |
|---------|---------|
| `bcrypt` | Hash passwords & compare hashed passwords |
| `jsonwebtoken` | Create & verify JWT tokens |
| `validator` | Validate email, URL, password strength |
| `cookie-parser` | Read cookies from requests |
| `mongoose` | MongoDB object modeling |

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

*Last Updated: Feb 4, 2026*

