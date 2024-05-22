const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const directoryPath = __dirname;
const usersFilePath = path.join(directoryPath, 'users.json');
const contactsFilePath = path.join(directoryPath, 'contacts.json');

app.use(express.static(directoryPath));

let users = [];
try {
  const userData = fs.readFileSync(usersFilePath, 'utf8');
  users = JSON.parse(userData).users;
} catch (err) {
  console.error('Error reading users file:', err);
}

app.get('/', (req, res) => {
  res.sendFile(path.join(directoryPath, 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    if (username === 'admin' && password === 'admin') {
      res.redirect('/admin.html');
    } else {
      res.redirect('/index.html');
    }
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

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  const contact = { name, email, message };

  let contacts = [];
  try {
    const contactsData = fs.readFileSync(contactsFilePath, 'utf8');
    contacts = JSON.parse(contactsData);
  } catch (err) {
    console.error('Error reading contacts file:', err);
  }

  contacts.push(contact);

  fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));

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

app.get('/users', (req, res) => {
  try {
    const userData = fs.readFileSync(usersFilePath, 'utf8');
    const existingUsers = JSON.parse(userData).users;
    res.json(existingUsers);
  } catch (err) {
    console.error('Error reading users file:', err);
    res.status(500).json({ error: 'Failed to read users file' });
  }
});

app.get('/messages', (req, res) => {
  try {
    const contactsData = fs.readFileSync(contactsFilePath, 'utf8');
    const messages = JSON.parse(contactsData);
    res.json(messages);
  } catch (err) {
    console.error('Error reading contacts file:', err);
    res.status(500).json({ error: 'Failed to read contacts file' });
  }
});

// Serve index.html with JavaScript
app.get('/index.html', (req, res) => {
  res.sendFile(path.join(directoryPath, 'index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
