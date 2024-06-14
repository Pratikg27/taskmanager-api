const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

let tasks = [];

// Load tasks from tasks.json if it exists and is not empty
if (fs.existsSync('tasks.json')) {
  const data = fs.readFileSync('tasks.json', 'utf8');
  if (data) {
    tasks = JSON.parse(data);
  }
}

// Save tasks to tasks.json
const saveTasks = () => {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const task = { id: Date.now(), ...req.body };
  tasks.push(task);
  saveTasks();
  res.json(task);
});

// Update a task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
    saveTasks();
    res.json(tasks[taskIndex]);
  } else {
    res.status(404).send('Task not found');
  }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  tasks = tasks.filter(t => t.id !== taskId);
  saveTasks();
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
