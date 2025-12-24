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
