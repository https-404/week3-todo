import store from './store.js';

function add(description) {
  if (!store.whoIsLoggedIn) throw new Error('Login first!');
  if (!description.trim()) throw new Error('Todo cannot be empty');

  const unfinishedCount = store.whoIsLoggedIn.userTodoList.length;
  if (unfinishedCount >= 10) throw new Error('Max 10 unfinished todos allowed');

  const newTodo = {
    todoId: store.todoIdCounter++,
    description: description.trim(),
    isCompleted: false,
    whenAdded: new Date()
  };

  store.whoIsLoggedIn.userTodoList.push(newTodo);
  return newTodo;
}

function list(filter = 'all') {
  if (!store.whoIsLoggedIn) throw new Error('Login first!');
  let todos = store.whoIsLoggedIn.userTodoList;
  if (filter === 'pending') todos = todos.filter(t => !t.isCompleted);
  if (filter === 'done') todos = todos.filter(t => t.isCompleted);
  return [...todos].reverse();
}

function markDone(id) {
  if (!store.whoIsLoggedIn) throw new Error('Login first!');
  const todo = findTodo(id);
  if (todo.isCompleted) throw new Error('Already finished');
  todo.isCompleted = true;
  return todo;
}

function remove(id) {
  if (!store.whoIsLoggedIn) throw new Error('Login first!');
  const idx = store.whoIsLoggedIn.userTodoList.findIndex(t => t.todoId === id);
  if (idx === -1) throw new Error('Todo not found');
  return store.whoIsLoggedIn.userTodoList.splice(idx, 1)[0];
}

function findTodo(id) {
  const todo = store.whoIsLoggedIn.userTodoList.find(t => t.todoId === id);
  if (!todo) throw new Error('Todo not found');
  return todo;
}

export default { add, list, markDone, remove };
