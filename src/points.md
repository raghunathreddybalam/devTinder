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
