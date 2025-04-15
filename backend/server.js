const express = require('express');
const cors = require('cors');
const { connectDB, Todo } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Connessione al DB
connectDB();

// API Endpoints
app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll({ order: [['created_at', 'DESC']] });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/todos', async (req, res) => {
  console.log('Ricevuto POST /todos con body:', req.body); // <-- Aggiungi questo
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    console.error('Errore completo:', err); // Log dettagliato
    res.status(400).json({ error: err.message });
  }
});

//app.post('/todos', async (req, res) => {
//  try {
//    const todo = await Todo.create(req.body);
//    res.status(201).json(todo2);
//  } catch (err) {
//    res.status(400).json({ error: err.message });
//  }
//});
//
app.patch('/todos/:id', async (req, res) => {
  try {
    const [affectedRows] = await Todo.update(req.body, {
      where: { id: req.params.id },
      returning: true
    });

    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Task non trovato' });
    }

    const updatedTodo = await Todo.findByPk(req.params.id);
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const deleted = await Todo.destroy({ where: { id: req.params.id } });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Task non trovato' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
