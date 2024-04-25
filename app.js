const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware to parse JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Load users from JSON file
let users = JSON.parse(fs.readFileSync('users.json', 'utf8')).users;

// Route to serve login form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Route to handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user in the JSON file
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.send('Login successful!');
  } else {
    res.redirect('/?loginError=Invalid username or password.');
  }
});

// Route to handle registration form submission
app.post('/register', (req, res) => {
  const { regUsername, regPassword } = req.body;

  // Check if the username already exists
  const existingUser = users.find(u => u.username === regUsername);

  if (existingUser) {
    res.redirect('/?registerError=Username already exists. Please choose a different username, or use existing credentials.');
  } else {
    // Add new user to the users array
    users.push({ username: regUsername, password: regPassword });

    // Update the users.json file with the new user data
    fs.writeFileSync('users.json', JSON.stringify({ users }, null, 2));

    res.send('Registration successful!');
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
