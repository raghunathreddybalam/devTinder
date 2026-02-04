1.

create a file in system
create a repository
initalize the repositiory by using npm init (it will install package json files)
install express
create a server
Listen to port
write request handlers for /test and /test2
install nodemon and update in package.json file

2.

initalize the git
.giignore
create a remote repo in github
push all code to remote origin

3.

- Express matches middleware/routes in the order you register them.
- Put more specific paths (e.g., `/test/rim`) above broader ones (e.g., `/test` or `/`).
- If a broader handler should not block downstream handlers, call `next()` inside it.
- Use `app.get("/")` if you only want to serve the root; keep catch-all `/` handlers last.

4.

- Route params example: `app.get("/user/:userId/:name/:password", ...)`—use `req.params` to read path variables when the values are part of the URL and required to reach that route.
- Regex route example: `app.get(/\.fly$/, ...)` to match any path ending with `.fly`; useful when you need pattern-based matches instead of fixed strings.
- Query params example: `app.get("/user", ...)` with `req.query` to read `?key=value` filters; good for optional filters, pagination, or flags without changing the path.

5.

- Route-level middleware chain: `app.use("/user", h1, h2, h3)` runs handlers in order; each must call `next()` to pass control.
- If a handler sends a response without calling `next()`, the chain stops there.
- Use this pattern to layer concerns: auth, validation, logging, then final responder.

6.

- Separated auth middleware into `middlewares/auth.js` with `adminAuth` and `userAuth` that check a token and return 401 when unauthorized.
- Mounted admin guard globally: `app.use("/admin", adminAuth)` so all `/admin/*` routes require the admin token.
- Added user-specific middleware: `app.use("/user/profile", userAuth, handler)` to protect profile endpoints.
- Example public route: `app.use("/user/login", ...)` remains open; protected routes sit behind their respective middleware.

7.

- Error handlers must have 4 args `(err, req, res, next)` or Express won’t treat them as error middleware.
- To reach them, a normal handler should `throw` or call `next(err)`, e.g., `app.get("/getuserdata", (req, res, next) => next(new Error("user not found")));`.
- Register the global error handler after all routes: `app.use((err, req, res, next) => res.status(500).send("something went wrong"));`.
- If you send a response in a handler, don’t call `next()` afterward unless you intend further processing.

8.

- MongoDB Atlas quick setup: copy the SRV URI from Atlas, append a DB name (e.g., `/devTinder`), and use it in `mongoose.connect`.
- Allow your IP in Atlas Network Access (or 0.0.0.0/0 temporarily) and wait ~1 minute for rules to apply.
- If you see `EBADNAME _mongodb._tcp...`, it’s a DNS/SRV issue—recheck the host spelling or use a non-SRV URI.
- If you see “Could not connect… IP isn’t whitelisted,” add your current IP; VPN/proxy IPs may differ.

9.

- Connect to the database before starting the server so requests don’t fail mid-flight when DB is unavailable.
- Pattern: await `connectDB()` and only then call `app.listen(...)`; if connect fails, log and exit instead of serving bad responses.

10.

- In `models/user.js`, defined a Mongoose schema with `firstName`, `lastName`, `email`, `password`, `age`, and `gender`, and created a reusable `User` model for database operations.

11.

- `app.use(express.json())` is built-in middleware that parses incoming JSON request bodies and populates `req.body` with the parsed object.
- Without it, `req.body` would be `undefined` when clients send JSON data.
- Created a `/signup` POST route that reads user data from `req.body`, creates a new `User` instance, and saves it to MongoDB.
- Wrapped the save operation in try-catch: success returns "user added successfully", failure returns 400 with the error message.

12.

## Password Encryption with bcrypt

- Never store passwords as plain text — if database is hacked, all passwords are exposed.
- **Hashing** = one-way conversion; you can't reverse a hash back to the original password.
- **Salt** = random string added before hashing to make each hash unique (even for same passwords).
- **Salt Rounds** = complexity level; `saltRounds = 10` means 2^10 = 1024 iterations.
- Higher salt rounds = slower hashing = harder for hackers to brute-force.
- Use `bcrypt.hash(password, 10)` to create a hash during signup.
- Use `bcrypt.compare(password, storedHash)` to verify password during login.
- `bcrypt.compare()` returns `true` if password matches, `false` otherwise.

13.

## Mongoose Schema Validation

- **Built-in validators** (`minLength`, `maxLength`, `required`, `min`, `max`) generate automatic error messages.
- **Custom validators** use `validate(value) { throw new Error("...") }` for custom error messages.
- Validation runs when calling `.save()` on a document.
- `unique: true` creates a MongoDB index, not a validator — it only works if index was created successfully.
- If duplicates existed before adding `unique: true`, the index fails silently. Use `Model.syncIndexes()` to recreate.

14.

## API Data Validation Pattern

- Validate data BEFORE database operations for faster failure and cleaner errors.
- Use `Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))` to whitelist allowed fields.
- This prevents users from updating sensitive fields like `email` or `password` through update APIs.
- Return early with `return res.status(400).send("error")` if validation fails.

15.

## Cookie vs Token Authentication

| Feature   | Cookie 🍪               | Token 🎟️                  |
| --------- | ----------------------- | ------------------------- |
| Stored by | Browser (automatically) | You (localStorage/memory) |
| Sent by   | Browser (automatically) | You (manually in headers) |
| Works on  | Same domain only        | Any domain (APIs, mobile) |
| Best for  | Traditional websites    | APIs, mobile apps, SPAs   |

16.

## JWT (JSON Web Token) Authentication

### What is JWT?

- A signed token containing user data (like user ID).
- Server creates it, client stores it, server verifies it later.
- Structure: `header.payload.signature` (e.g., `eyJhbG...`)

### Login Flow:

1. User sends email & password to `/login`.
2. Server finds user by email in database.
3. Server compares password with stored hash using `bcrypt.compare()`.
4. If valid, server creates JWT: `jwt.sign({_id: user._id}, "secret")`.
5. Server sends token to browser as cookie: `res.cookie("token", token)`.
6. Browser stores cookie automatically.

### Profile/Protected Route Flow:

1. User visits `/profile`.
2. Browser automatically sends cookie with request.
3. Server extracts token from cookies: `const { token } = req.cookies`.
4. Server verifies token: `jwt.verify(token, "secret")` — returns decoded data or throws error.
5. Server extracts user ID from decoded token: `const { _id } = decodedMssg`.
6. Server finds user in DB: `User.findById(_id)`.
7. If user exists, send user data; otherwise, send error.

### Why Check if User Exists After Token Verification?

- Token validity ≠ User existence.
- User could be deleted after login but token still valid.
- Always verify user still exists in database.

17.

## Cookie Parser Middleware

- Install: `npm install cookie-parser`
- Use: `app.use(cookieParser())` to parse cookies from requests.
- Access cookies: `req.cookies` returns an object like `{ token: "abc", sessionId: "xyz" }`.
- Set cookies: `res.cookie("name", "value")` sends cookie to browser.

18.

## JavaScript Destructuring

- Shortcut to extract properties from objects.
- `const { token } = cookies` is same as `const token = cookies.token`.
- Can extract multiple: `const { name, email, age } = user`.
- Works with arrays too: `const [first, second] = arr`.
