// Import required modules
const express = require('express');
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(express.json());

// In-memory data source
let users = [
    { id: "1", firstName: "Ajay", lastName: "Solanke", hobby: "Writting"},
];

// Middleware to log request details
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - Status: ${res.statusCode}`);
    next();
});

// Validation middleware
function validateUser(req, res, next) {
    const { firstName, lastName, hobby } = req.body;
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ error: "All fields (firstName, lastName, hobby) are required." });
    }
    next();
}

// Routes
// GET /users - Fetch the list of all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// GET /users/:id - Fetch details of a specific user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json(user);
});

// POST /user - Add a new user
app.post('/user', validateUser, (req, res) => {
    const { firstName, lastName, hobby } = req.body;
    const newUser = {
        id: (users.length + 1).toString(),
        firstName,
        lastName,
        hobby,
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /user/:id - Update details of an existing user
app.put('/user/:id', validateUser, (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }
    const { firstName, lastName, hobby } = req.body;
    user.firstName = firstName;
    user.lastName = lastName;
    user.hobby = hobby;
    res.status(200).json(user);
});

// DELETE /user/:id - Delete a user by ID
app.delete('/user/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found." });
    }
    users.splice(userIndex, 1);
    res.status(200).json({ message: "User deleted successfully." });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
