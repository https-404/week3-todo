
console.log("Welcome to Todo CLI! Type something and press enter:");

// In-memory data store
const users = {}; 
let currentUser = null;


function requireLogin() {
  if (!currentUser) {
    console.log("Please login first. Use: login <username>");
    return false;
  }
  return true;
}

function login(username) {
  if (!username) {
    console.log("Username required. Usage: login <username>");
    return;
  }
  if (!users[username]) {
    users[username] = { todos: [], counter: 1 };
    console.log(`Created new user: ${username}`);
  }
  currentUser = username;
  console.log(`Logged in as ${username}`);
}

function logout() {
  if (!currentUser) {
    console.log("No user is currently logged in.");
    return;
  }
  console.log(`Logged out from ${currentUser}`);
  currentUser = null;
}

function whoami() {
  if (!currentUser) {
    console.log("Not logged in.");
    return;
  }
  console.log(`Current user: ${currentUser}`);
}

function add(todoText) {
  if (!requireLogin()) return;
  if (!todoText) {
    console.log("Todo text cannot be empty.");
    return;
  }
  const user = users[currentUser];
  const activeTodos = user.todos.filter((t) => !t.done);
  if (activeTodos.length >= 10) {
    console.log("Cannot have more than 10 active todos.");
    return;
  }
  const todo = { id: user.counter++, text: todoText, done: false };
  user.todos.push(todo);
  console.log(`Added todo #${todo.id}: "${todo.text}"`);
}

function list(filter = "all") {
  if (!requireLogin()) return;
  const user = users[currentUser];
  let todos = [...user.todos].reverse(); // newest first
  if (filter === "pending") todos = todos.filter((t) => !t.done);
  if (filter === "done") todos = todos.filter((t) => t.done);

  if (todos.length === 0) {
    console.log("No todos to show.");
    return;
  }
  todos.forEach((t) => {
    console.log(
      `#${t.id} [${t.done ? "✔" : " "}] ${t.text}`
    );
  });
}

function markDone(id) {
  if (!requireLogin()) return;
  const user = users[currentUser];
  const todo = user.todos.find((t) => t.id === id);
  if (!todo) {
    console.log("Todo not found.");
    return;
  }
  if (todo.done) {
    console.log("ℹ Already marked as done.");
    return;
  }
  todo.done = true;
  console.log(`Todo #${id} marked as done.`);
}

function remove(id) {
  if (!requireLogin()) return;
  const user = users[currentUser];
  const idx = user.todos.findIndex((t) => t.id === id);
  if (idx === -1) {
    console.log("Todo not found.");
    return;
  }
  const [removed] = user.todos.splice(idx, 1);
  console.log(`Deleted todo #${removed.id}: "${removed.text}"`);
}

function help() {
  console.log(`
Available commands:
  login <username>         -> switch or create user
  logout                   -> logout current user
  whoami                   -> show current user
  add "<text>"             -> add a todo
  list [all|pending|done]  -> list todos
  done <id>                -> mark todo done
  delete <id>              -> remove todo
  help                     -> show commands
  exit                     -> quit program
`);
}

// Command dispatcher
function handleCommand(input) {
  const parts = input.match(/("[^"]+"|\S+)/g) || [];
  const cmd = parts[0];
  const args = parts.slice(1).map((a) => a.replace(/^"|"$/g, ""));

  switch (cmd) {
    case "login":
      login(args[0]);
      break;
    case "logout":
      logout();
      break;
    case "whoami":
      whoami();
      break;
    case "add":
      add(args.join(" "));
      break;
    case "list":
      list(args[0] || "all");
      break;
    case "done":
      markDone(Number(args[0]));
      break;
    case "delete":
      remove(Number(args[0]));
      break;
    case "help":
      help();
      break;
    case "exit":
      console.log("Goodbye!");
      process.exit(0);
      break;
    default:
      console.log("Unknown command. Type 'help' for usage.");
  }
}

process.stdin.on("data", (data) => {
  const input = data.toString().trim();
  if (input) handleCommand(input);
});
