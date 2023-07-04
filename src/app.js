// Module imports
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// Express setup
const app = express();
const port = 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data store
let users = [];

// Get all users API
app.get('/users', async (request, response) => {
  try {
    return response.status(200).send({
      message: "Users retrieved",
      success: true,
      users: users
    });
  } catch (err) {
    console.log(err);
    return response.status(500).send({ error: "Internal Server Error" });
  }
});

// Add new user API
app.post('/add', async (request, response) => {
  const { email, firstName } = request.body;
  if (!email || !firstName) return response.status(400).send({ error: "Invalid request body" });
  try {
    const id = uuidv4();
    const newUser = { id, email, firstName };
    users.push(newUser);
    return response.status(201).send({
      message: "User added",
      success: true
    });
  } catch (err) {
    console.log(err);
    return response.status(500).send({ error: "Internal Server Error" });
  }
});

// Update user API
app.put('/update/:id', async (request, response) => {
  const { email, firstName } = request.body;
  const { id } = request.params;
  if (!id || (!email && !firstName)) return response.status(400).send({ error: "Invalid request body" });
  try {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return response.status(404).send({ message: "User not found" });
    if (email) users[userIndex].email = email;
    if (firstName) users[userIndex].firstName = firstName;
    return response.status(200).send({
      message: "User updated",
      success: true
    });
  } catch (err) {
    console.log(err);
    return response.status(500).send({ error: "Internal Server Error" });
  }
});

// Get single user API
app.get('/user/:id', async (request, response) => {
  const { id } = request.params;
  if (!id) return response.status(400).send({ error: "Invalid request body" });
  try {
    const user = users.find(user => user.id === id);
    if (!user) return response.status(404).send({ message: "User not found" });
    return response.status(200).send({
      success: true,
      user: user
    });
  } catch (err) {
    console.log(err);
    return response.status(500).send({ error: "Internal Server Error" });
  }
});

// Server listening
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
