const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const directoryPath = __dirname;
const usersFilePath = path.join(directoryPath, 'users.json');
const contactsFilePath = path.join(directoryPath, 'contacts.json'); // New file for storing contact data

app.use(express.static(directoryPath));

let users = [];
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
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.redirect('/index.html');
  } else {
    console.log('Invalid username or password');
    res.sendFile(path.join(directoryPath, 'login.html'), { loginError: 'Invalid username or password.' });
  }
});

app.post('/register', (req, res) => {
  const { regUsername, regPassword } = req.body;
  const existingUser = users.find(u => u.username === regUsername);
  if (existingUser) {
    console.log('Username already exists. Please choose a different username.');
    return res.sendFile(path.join(directoryPath, 'login.html'), { registerError: 'Username already exists. Please choose a different username.' });
  } else {
    users.push({ username: regUsername, password: regPassword });
    fs.writeFileSync(usersFilePath, JSON.stringify({ users }, null, 2));
    res.redirect('/index.html');
  }
});

// Route to handle contact form submission
app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  const contact = { name, email, message };

  // Read existing contacts data from file
  let contacts = [];
  try {
    const contactsData = fs.readFileSync(contactsFilePath, 'utf8');
    contacts = JSON.parse(contactsData);
  } catch (err) {
    console.error('Error reading contacts file:', err);
  }

  // Append new contact to existing contacts
  contacts.push(contact);

  // Write updated contacts data back to file
  fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));

  // Instead of sending a new page, send a response with a JavaScript snippet to trigger a popup
  const popupScript = `
    <script>
      alert('Message sent successfully!');
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    </script>
  `;
  res.send(popupScript);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
