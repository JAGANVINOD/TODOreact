import React, { useEffect, useState } from "react";
import "./style.css"

const API = "http://localhost:5000/todos";




export default function App() {




  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5;


  const loadTodos = async (p = 1) => {
    const res = await fetch(`${API}?page=${p}&limit=${limit}`);
    const data = await res.json();
    setTodos(data.todos);
    setPage(data.page);
    setTotal(data.total);
  };

  useEffect(() => {
    loadTodos();
  }, []);


  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert("Title required");
    if (editing) {
      await fetch(`${API}/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditing(null);
    } else {
      await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: "", description: "" });
    loadTodos(page);
  };



  const deleteTodo = async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadTodos(page);
  };

  const updateStatus = async (id, status) => {
    await fetch(`${API}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadTodos(page);
  };



  const startEdit = (todo) => {
    setEditing(todo);
    setForm({ title: todo.title, description: todo.description });
  };

  const totalPages = Math.ceil(total / limit);



  const btnStyle = {
    padding: "6px 12px",
    border: "none",
    borderRadius: "4px",
    color: "white",
    marginRight: "6px",
    cursor: "pointer",
  };
  const btnAdd = { ...btnStyle, backgroundColor: "#28a745" };      
  const btnCancel = { ...btnStyle, backgroundColor: "#6c757d" };   
  const btnEdit = { ...btnStyle, backgroundColor: "#007bff" };    
  const btnDelete = { ...btnStyle, backgroundColor: "#dc3545" };   
  const btnPage = { ...btnStyle, backgroundColor: "#54687b" };     



  return (
    
    <div style={{ margin: "30px auto", width: "400px" }}>
      <h1>Todo List App (Page {page})</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <button type="submit" style={btnAdd}>
          {editing ? "Update Todo" : "Add Todo"}
        </button>
        {editing && (
          <button
            type="button"
            style={btnCancel}
            onClick={() => {
              setEditing(null);
              setForm({ title: "", description: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />



      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "6px",
          }}
        >
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <p>
            Status:
            <select
              value={todo.status}
              onChange={(e) => updateStatus(todo.id, e.target.value)}
              style={{ marginLeft: "5px" }}
            >
              <option>Pending</option>
              <option>In-Progress</option>
              <option>Completed</option>
            </select>
          </p>
          <button style={btnEdit} onClick={() => startEdit(todo)}>
            Edit
          </button>
          <button style={btnDelete} onClick={() => deleteTodo(todo.id)}>
            Delete
          </button>
        </div>
      ))}

  

      <div style={{ marginTop: "20px" }}>
        <button
          style={btnPage}
          onClick={() => loadTodos(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {page} of {totalPages || 1}
        </span>
        <button
          style={btnPage}
          onClick={() => loadTodos(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}