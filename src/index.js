const readline = require('readline');


const users = {}; 
let currentUser = null;


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: ' * '
});

// Show Welcome message
function WelcomeMessage() {
  console.log('Welcome to Todo CLI!');
  console.log('Type "help" for available commands or "login <username>" to get started.');
  console.log('Type "exit" to quit the program.\n');
}

// Show help command
function showHelp() {
  console.log('\nAvailable commands:');
  console.log('  login <username>     - Switch or create a user');
  console.log('  whoami               - Show current user');
  console.log('  add "<text>"         - Add a new todo item');
  console.log('  list [all|pending|done] - List todos');
  console.log('  done <id>            - Mark a todo done');
  console.log('  delete <id>          - Delete a todo item');
  console.log('  help                 - Show help commands');
  console.log('  logout               - Logout current user');
  console.log('  exit                 - Exit the program\n');
}

// Login/create a user
function loginUser(username) {
  if (!username || username.trim() === '') {
    console.log('Error: Username cannot be empty');  //reject username if empty
    return;
  }

  username = username.trim();
  
  if (!users[username]) {
    users[username] = {
      todos: [],
      nextId: 1
    };
    console.log(`New user "${username}" created and logged in.`);
  } else {
    console.log("Logged in as ",username);
  }
  
  currentUser = username;
}

// Show current user
function showCurrentUser() {
  if (currentUser) {
    console.log(`Current user: ${currentUser}`);
  } else {
    console.log('No user logged in. Use "login <username>" to login.');
  }
}

// Add todo item
function addTodo(text) {
  if (!currentUser) {
    console.log('Error: Please login first using "login <username>"'); //No user logged in
    return;
  }

  if (!text || text.trim() === '') {
    console.log('Error: Todo text cannot be empty'); //rejject empty todos
    return;
  }

  const user = users[currentUser];
  const activeTodos = user.todos.filter(todo => !todo.done);
  
  //Max 10 active todos per user
  if (activeTodos.length >= 10) {
    console.log('Error: Maximum 10 active todos allowed per user.');
    console.log('You are not allowed to create any more Todos')
    return;
  }

  const newTodo = {
    id: user.nextId++,
    text: text.trim(),
    done: false,
    createdAt: new Date()
  };

  user.todos.unshift(newTodo); 
  console.log(`Todo added with ID ${newTodo.id}: "${newTodo.text}"`);  //show newest first
}

// List all todos of a user.
function listTodos(filter = 'all') {
  if (!currentUser) {
    console.log('Error: Please login first using "login <username>"');
    return;
  }

  const user = users[currentUser];
  let todosToShow = user.todos;

  // show pending,done using filter
  if (filter === 'pending') {
    todosToShow = user.todos.filter(todo => !todo.done);
  } 
  else if (filter === 'done') {
    todosToShow = user.todos.filter(todo => todo.done);
  } 
  else if (filter !== 'all') {
    console.log('Error: Invalid filter. Use "all", "pending", or "done"');
    return;
  }

  if (todosToShow.length === 0) {
    console.log(`No ${filter === 'all' ? '' : filter + ' '}todos found.`);
    return;
  }

  console.log(`\n${filter.charAt(0).toUpperCase() + filter.slice(1)} todos for ${currentUser}:`);
  todosToShow.forEach(todo => {
    const status = todo.done ? '✓' : '○';
    const statusText = todo.done ? ' (DONE)' : '';
    console.log(`  ${status} ${todo.id}: ${todo.text}${statusText}`);
  });
  console.log();
}

// Mark todo as done
function markTodoDone(idStr) {
  if (!currentUser) {
    console.log('Error: Please login first using "login <username>"');
    return;
  }

  const id = parseInt(idStr);
  if (isNaN(id)) {
    console.log('Error: Invalid ID. Please provide a number.');
    return;
  }

  const user = users[currentUser];
  const todo = user.todos.find(t => t.id === id);

  if (!todo) {
    console.log(`Error: Todo with ID ${id} not found.`);
    return;
  }

  if (todo.done) {
    console.log(`Todo ${id} is already completed.`);
    return;
  }

  todo.done = true;
  console.log(`Todo ${id} marked as done: "${todo.text}"`);
}

// Delete a todo
function deleteTodo(idStr) {
  if (!currentUser) {
    console.log('Error: Please login first using "login <username>"');
    return;
  }

  const id = parseInt(idStr);
  if (isNaN(id)) {
    console.log('Error: Invalid ID. Please provide a number.');
    return;
  }

  const user = users[currentUser];
  const todoIndex = user.todos.findIndex(t => t.id === id);

  if (todoIndex === -1) {
    console.log(`Error: Todo with ID ${id} not found.`);
    return;
  }

  const deletedTodo = user.todos.splice(todoIndex, 1)[0];
  console.log(`Todo ${id} deleted: "${deletedTodo.text}"`);
}

// Logout user
function logoutUser() {
  if (!currentUser) {
    console.log('No user is currently logged in.');
    return;
  }
  
  console.log(`Logged out from "${currentUser}".`);
  currentUser = null;
}


function executeCommand(input) {
  const trimmed = input.trim();
  
  if (trimmed === '') {
    return;
  }

  if (trimmed === 'exit') {
    console.log('Goodbye!');
    rl.close();
    return;
  }

  const parts = trimmed.split(' ');
  const command = parts[0].toLowerCase();

  switch (command) {
    case 'help':
      showHelp();
      break;

    case 'login':
      if (parts.length < 2) {
        console.log('Usage: login <username>');
      } else {
        loginUser(parts.slice(1).join(' '));
      }
      break;

    case 'whoami':
      showCurrentUser();
      break;

    case 'add':
      // Must be in quotes
      const addMatch = trimmed.match(/^add\s+"(.+)"$/);
      if (addMatch) {
        addTodo(addMatch[1]);
      } else {
        console.log('Usage: add "<text>" (text must be in quotes)');
      }
      break;

    case 'list':
      const filter = parts[1] || 'all';
      listTodos(filter);
      break;

    case 'done':
      if (parts.length < 2) {
        console.log('Usage: done <id>');
      } else {
        markTodoDone(parts[1]);
      }
      break;

    case 'delete':
      if (parts.length < 2) {
        console.log('Usage: delete <id>');
      } else {
        deleteTodo(parts[1]);
      }
      break;

    case 'logout':
      logoutUser();
      break;

    default:
      console.log(`Unknown command: ${command}. Type "help" for available commands.`);
      break;
  }
}

//user input
rl.on('line', (input) => {
  executeCommand(input);
  rl.prompt();
});

rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
});

// Start the application
WelcomeMessage();
rl.prompt();


rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
});

// Start the application
showWelcome();
rl.prompt();
