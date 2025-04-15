const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database in memoria
let todos = [];

// API Routes
app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const todo = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  todos.push(todo);
  res.status(201).json(todo);
});
// Aggiungi queste route dopo quelle esistenti
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get('todos').find({ id }).assign(req.body).write();
  res.json(db.get('todos').find({ id }).value());
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get('todos').remove({ id }).write();
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
