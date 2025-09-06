console.log("Welcome to Todo CLI! Type 'help' for commands:");

const users = {};
let currentUser = null;

function ensureUser(username) {
  if (!users[username]) users[username] = { todos: [], nextId: 1 };
}
function getUserStore() {
  if (!currentUser) return null;
  return users[currentUser];
}
function formatTodo(todo) {
  return `[${todo.id}] ${todo.done ? '✔' : ' '}\t${todo.text}`;
}
function parseQuoted(arg) {
  const m = (arg||'').trim().match(/^['"]([\s\S]*)['"]$/);
  return m ? m[1] : null;
}

function cmdLogin(arg) {
  const username = (arg || '').trim();
  if (!username) return console.log('Usage: login <username>');
  ensureUser(username);
  currentUser = username;
  console.log(`Logged in as: ${username}`);
}
function cmdWhoami() {
  if (!currentUser) return console.log('Not logged in');
  console.log(currentUser);
}
function cmdLogout() {
  if (!currentUser) return console.log('Not logged in');
  console.log(`Logged out: ${currentUser}`);
  currentUser = null;
}

function cmdAdd(arg) {
  const store = getUserStore();
  if (!store) return console.log('Please login first');
  const text = parseQuoted(arg);
  if (text === null) return console.log('Usage: add "<text>"');
  if (!text.trim()) return console.log('Todo cannot be empty');
  const todo = { id: store.nextId++, text: text.trim(), done: false, createdAt: Date.now() };
  store.todos.push(todo);
  console.log(`Added todo [${todo.id}]`);
}
function cmdList(arg) {
  const store = getUserStore();
  if (!store) return console.log('Please login first');
  const filter = ((arg||'').trim().toLowerCase() || 'all');
  let items = store.todos.slice();
  if (filter === 'pending') items = items.filter(t => !t.done);
  if (filter === 'done') items = items.filter(t => t.done);
  items.sort((a,b)=>b.createdAt - a.createdAt);
  if (items.length === 0) return console.log('(no todos)');
  items.forEach(t => console.log(formatTodo(t)));
}

function manageInput(raw) {
  const input = (raw || '').trim();
  if (!input) return;

  const firstSpace = input.indexOf(' ');
  const cmd = firstSpace === -1 ? input : input.slice(0, firstSpace);
  const arg = firstSpace === -1 ? '' : input.slice(firstSpace + 1);

  switch (cmd.toLowerCase()) {
    case 'help':
      console.log(`Commands:
  login <username>
  whoami
  logout
  add "<text>"
  list [all|pending|done]
  done <id>
  delete <id>
  help
  exit / quit`);
      break;
    case 'login': cmdLogin(arg); break;
    case 'whoami': cmdWhoami(); break;
    case 'logout': cmdLogout(); break;
    case 'add': cmdAdd(arg); break;
    case 'list': cmdList(arg); break;
    case 'exit': case 'quit':
      console.log('Goodbye!'); process.exit(0); break;
    default:
      console.log("Unknown command. Type 'help'.");
  }
}

process.stdin.on("data", (data) => {
  manageInput(data.toString());
});
