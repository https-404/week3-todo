import readline from 'readline';
const users = {}

let currentUser = null

let nextTodoId = 1

const availableCommands = {
    login: 'login "<username>" => Switch or create a user',
    logout: 'logout => Logout the current user',
    whoami: 'whoami => Show the current user',
    add: 'add "<text>" => Add a todo (text must be in quotes)',
    list: 'list \"[all|pending|done]\" => List todos with an optional filter',
    done: 'done \"<id>\" => Mark a todo as done',
    delete: 'delete \"<id>\" => Remove a todo',
    help: 'help => Show this list of commands',
    exit: 'exit => Exit the application'
}

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'todo> '
});

console.log("Welcome to Todo CLI!");
console.log("Please log in with \'login \"<username>\"\' to get started.");
readLine.prompt();

function handleLogin(username) {
  if (!username) {
    console.log("Please provide a username. Usage: login <username>");
    return;
  }
  if (!users[username]) {
    users[username] = [];
    console.log(`User '${username}' created.`);
  }
  currentUser = username;
  nextTodoId = users[username].length ==0 ? users[username].length + 1 : users[username].length
  console.log(`Logged in as '${currentUser}'.`);
  console.log(`Todo's Count '${nextTodoId}'.`);
}

function handleWhoami() {
  if (currentUser) {
    console.log(`You are currently logged in as '${currentUser}'.`);
  } else {
    console.log("You are not logged in. Use 'login <username>' to log in.");
  }
}

function handleAdd(todoText) {
  if (!currentUser) {
    console.log("You must be logged in to add a todo.");
    return;
  }
  if (!todoText) {
    console.log("Cannot add an empty todo. Usage: add \"<text>\"");
    return;
  }
  
  const userTodos = users[currentUser];
  // Check if the user has reached the active todo limit.
  const activeTodos = userTodos.filter(todo => !todo.done);
  if (activeTodos.length >= 10) {
    console.log("You have reached the maximum of 10 active todos. Please complete or delete some.");
    return;
  }
  
  const newTodo = {
    id: nextTodoId++,
    text: todoText,
    done: false
  };
  // Add the new todo to the beginning of the list to show newest first.
  userTodos.unshift(newTodo);
  console.log(`Added todo '${newTodo.text}' with ID ${newTodo.id}.`);
}
function handleList(filter) {
  if (!currentUser) {
    console.log("You must be logged in to list todos.");
    return;
  }
  
  let todos = users[currentUser];
  
  if (todos.length === 0) {
    console.log("Your todo list is empty.");
    return;
  }

  // Apply the filter.
  let filteredTodos;
  switch (filter) {
    case 'done':
      filteredTodos = todos.filter(todo => todo.done);
      break;
    case 'pending':
      filteredTodos = todos.filter(todo => !todo.done);
      break;
    case 'all':
    default:
      filteredTodos = todos;
      break;
  }

  if (filteredTodos.length === 0) {
    console.log(`No ${filter === 'pending' ? 'pending' : 'done'} todos found.`);
    return;
  }
  
  console.log(`--- Todo List for ${currentUser} (${filter || 'all'}) ---`);
  filteredTodos.forEach(todo => {
    const status = todo.done ? '👍' : '👎';
    console.log(`${status} ${todo.id}: ${todo.text}`);
  });
}
function handleDone(id) {
  if (!currentUser) {
    console.log("You must be logged in to mark a todo as done.");
    return;
  }
  if (!id) {
    console.log("Please provide a todo ID. Usage: \'done \"<id>\"\'");
    return;
  }
  
  const todoId = parseInt(id);
  const todo = users[currentUser].find(t => t.id === todoId);
  
  if (todo) {
    todo.done = true;
    console.log(`Todo with ID ${todoId} marked as done.`);
  } else {
    console.log(`Error: Todo with ID ${todoId} not found.`);
  }
}
function handleDelete(id) {
  if (!currentUser) {
    console.log("You must be logged in to delete a todo.");
    return;
  }
  if (!id) {
    console.log("Please provide a todo ID. Usage: \'delete \"<id>\"\'");
    return;
  }
  
  const todoId = parseInt(id);
  const userTodos = users[currentUser];
  const initialLength = userTodos.length;
  
  // Filter out the todo to be deleted.
  users[currentUser] = userTodos.filter(t => t.id !== todoId);
  
  if (users[currentUser].length < initialLength) {
    console.log(`Todo with ID ${todoId} deleted.`);
  } else {
    console.log(`Error: Todo with ID ${todoId} not found.`);
  }
}
function handleLogout() {
  if (currentUser) {
    console.log(`Successfully logged out from '${currentUser}'.`);
    currentUser = null;
    nextTodoId = 1
  } else {
    console.log("You are not currently logged in.");
  }
}
function handleHelp() {
  console.log("--- Available Commands ---");
  for (const cmd in availableCommands) {
    console.log(availableCommands[cmd]);
  }
}
readLine.on('line', (line) => {
  // Trim and split the input line into command and arguments.
  const parts = line.trim().split(/\s+(?=")/).map(s => s.replace(/"/g, ''));
  const command = parts[0];
  const args = parts.slice(1);
  
  switch (command) {
    case 'login':
      handleLogin(args[0]);
      break;
    case 'whoami':
      handleWhoami();
      break;
    case 'add':
      handleAdd(args[0]);
      break;
    case 'list':
      handleList(args[0]);
      break;
    case 'done':
      handleDone(args[0]);
      break;
    case 'delete':
      handleDelete(args[0]);
      break;
    case 'logout':
      handleLogout();
      break;
    case 'help':
      handleHelp();
      break;
    case 'exit':
      readLine.close();
      break;
    case '':
      break;
    default:
      console.log(`Unknown command: '${command}'. Type 'help' to see available commands.`);
  }
  
  readLine.prompt();
}).on('close', () => {
  console.log('Goodbye!');
  process.exit(0);
});