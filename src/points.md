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
