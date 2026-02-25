const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let todos = [];
let id = 1;



// Get todos (paginated)
app.get("/todos", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const start = (page - 1) * limit;
  const end = start + limit;

  const pagedTodos = todos.slice(start, end);
  res.json({
    page,
    limit,
    total: todos.length,
    todos: pagedTodos
  });
});



// Create new todo
app.post("/todos", (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: "Title required" });

  const newTodo = { id: id++, title, description: description || "", status: "Pending" };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});



// Update todo

app.put("/todos/:id", (req, res) => {

  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ error: "Not found" });

  const { title, description, status } = req.body;
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (status !== undefined) todo.status = status;

  res.json(todo);
});


// Delete todo
app.delete("/todos/:id", (req, res) => {
  todos = todos.filter(t => t.id !== parseInt(req.params.id));
  res.status(204).send();
});




const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));