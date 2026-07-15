require("dotenv").config();
const userRepository = require("./userRepository");

const express = require("express");
const app = express();

app.use(express.json());


const bcrypt = require("bcrypt");

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const existingUser = userRepository.findByUsername(username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = userRepository.create(username, hashedPassword);

  res.status(201).json({ id: newUser.id, username: newUser.username });
});

const jwt = require("jsonwebtoken");
const fs = require("fs");

const PRIVATE_KEY = fs.readFileSync("private.pem", "utf8");
const PUBLIC_KEY = fs.readFileSync("public.pem", "utf8");

function authenticateToken(req, res, next) {
  // JWTs are typically sent in the Authorization header like:
  // Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // grab the part after "Bearer "

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, PUBLIC_KEY, (err, decodedPayload) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Attach the decoded user info to the request object,
    // so route handlers further down the chain can use it.
    req.user = decodedPayload;
    next(); // pass control to the next function — the actual route handler
  });
}

app.get('/profile', authenticateToken, (req, res) => {
  const user = userRepository.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, username: user.username });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = userRepository.findByUsername(username);
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) return res.status(401).json({ error: 'Invalid username or password' });

  const token = jwt.sign({ id: user.id, username: user.username }, PRIVATE_KEY, { expiresIn: '15m', algorithm: 'RS256' });
  res.json({ token });
});

app.get("/", (req, res) => {
  res.send("Server is Live");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
