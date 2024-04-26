const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, 'public')));


let users = JSON.parse(fs.readFileSync('users.json', 'utf8')).users;


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


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


app.post('/register', (req, res) => {
  const { regUsername, regPassword } = req.body;

  
  const existingUser = users.find(u => u.username === regUsername);

  if (existingUser) {
    res.redirect('/?registerError=Username already exists. Please choose a different username, or use existing credentials.');
  } else {
    users.push({ username: regUsername, password: regPassword });
    fs.writeFileSync('users.json', JSON.stringify({ users }, null, 2));
    res.send('Registration successful!');
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
