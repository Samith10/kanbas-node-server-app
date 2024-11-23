let todos = [
    { id: 1, title: "Task 1", completed: false, description: "Description for Task 1" },
    { id: 2, title: "Task 2", completed: true, description: "Description for Task 2" },
    { id: 3, title: "Task 3", completed: false, description: "Description for Task 3" },
    { id: 4, title: "Task 4", completed: true, description: "Description for Task 4" },
];

export default function WorkingWithArrays(app) {
  app.get("/lab5/todos", (req, res) => {
    const { completed } = req.query;
    if (completed !== undefined) {
      const completedBool = completed === "true";
      const completedTodos = todos.filter((t) => t.completed === completedBool);
      res.json(completedTodos);
      return;
    }
    res.json(todos);
  });

  app.get("/lab5/todos/create", (req, res) => {
    const newTodo = {
      id: new Date().getTime(),
      title: "New Task",
      completed: false,
      description: "New task description",
    };
    todos.push(newTodo);
    res.json(todos);
  });

  app.get("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    res.json(todo);
  });

  app.get("/lab5/todos/:id/delete", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    todos.splice(todoIndex, 1);
    res.json(todos);
  });

  // Update title
  app.get("/lab5/todos/:id/title/:title", (req, res) => {
    const { id, title } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (todo) {
      todo.title = title;
      res.json(todo);
    } else {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
    }
  });

  // Update completed status
  app.get("/lab5/todos/:id/completed/:completed", (req, res) => {
    const { id, completed } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (todo) {
      todo.completed = completed === "true"; // Convert to boolean
      res.json(todo);
    } else {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
    }
  });

  // Update description
  app.get("/lab5/todos/:id/description/:description", (req, res) => {
    const { id, description } = req.params;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (todo) {
      todo.description = description;
      res.json(todo);
    } else {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
    }
  });

  // Delete todo
  app.delete("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
    if (todoIndex === -1) {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
      return;
    }
    todos.splice(todoIndex, 1);
    res.sendStatus(200);
  });

  // Update todo (general case, handles multiple fields)
  app.put("/lab5/todos/:id", (req, res) => {
    const { id } = req.params;
    const { title, completed, description } = req.body;
    const todo = todos.find((t) => t.id === parseInt(id));
    if (todo) {
      if (title !== undefined) todo.title = title;
      if (completed !== undefined) todo.completed = completed;
      if (description !== undefined) todo.description = description;
      res.json(todo);
    } else {
      res.status(404).json({ message: `Todo with ID ${id} not found` });
    }
  });
}
