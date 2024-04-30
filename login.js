const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const directoryPath = __dirname;
const usersFilePath = path.join(directoryPath, 'users.json');

app.use(express.static(directoryPath));

// Initialize users array
let users = [];

// Read users data from JSON file
try {
  const userData = fs.readFileSync(usersFilePath, 'utf8');
  users = JSON.parse(userData).users;
} catch (err) {
  console.error('Error reading users file:', err);
}

app.get('/', (req, res) => {
  const { loginError, registerError } = req.query;
  res.sendFile(path.join(directoryPath, 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user in the users array
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Redirect to index.html upon successful login
    res.redirect('/index.html');
  } else {
    // Render login page with login error message
    res.sendFile(path.join(directoryPath, 'login.html'), { loginError: 'Invalid username or password.' });
  }
});


app.post('/register', (req, res) => {
  const { regUsername, regPassword } = req.body;

  // Check if the username already exists
  const existingUser = users.find(u => u.username === regUsername);

  if (existingUser) {
    // Render login page with registration error message
    return res.sendFile(path.join(directoryPath, 'login.html'), { registerError: 'Username already exists. Please choose a different username.' });
  } else {
    // Add new user to the users array
    users.push({ username: regUsername, password: regPassword });

    // Update the users.json file with the new user data
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));

    res.send('Registration successful!');
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});