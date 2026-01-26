const express = require("express");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3003;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev, hostname: "0.0.0.0", port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Custom route
  server.get("/hello", (req, res) => {
    res.send("Hello custom server!");
  });

  // Next.js handler
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, "0.0.0.0", err => {
    if (err) throw err;
    console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  });
});
