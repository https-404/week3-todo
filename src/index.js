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
  if (!store) return console.log('Please login first: login <username>');
  const text = parseQuoted(arg);
  if (text === null) return console.log('Usage: add "<text>" (text must be quoted)');
  if (!text.trim()) return console.log('Todo cannot be empty');
  const activeCount = store.todos.filter(t => !t.done).length;
  if (activeCount >= 10) return console.log('You already have 10 active todos. Complete or delete some before adding.');
  const todo = { id: store.nextId++, text: text.trim(), done: false, createdAt: Date.now() };
  store.todos.push(todo);
  console.log(`Added todo [${todo.id}]`);
}
function cmdList(arg) {
  const store = getUserStore();
  if (!store) return console.log('Please login first: login <username>');
  const filter = ((arg||'').trim().toLowerCase() || 'all');
  if (!['all','pending','done'].includes(filter)) return console.log('Usage: list [all|pending|done]');
  let items = store.todos.slice();
  if (filter === 'pending') items = items.filter(t => !t.done);
  if (filter === 'done') items = items.filter(t => t.done);
  items.sort((a,b)=>b.createdAt - a.createdAt);
  if (items.length === 0) return console.log('(no todos)');
  items.forEach(t => console.log(formatTodo(t)));
}
function cmdDone(arg) {
  const store = getUserStore();
  if (!store) return console.log('Please login first: login <username>');
  const id = Number((arg||'').trim());
  if (!Number.isInteger(id)) return console.log('Usage: done <id>');
  const todo = store.todos.find(t => t.id === id);
  if (!todo) return console.log(`Todo with id ${id} not found.`);
  if (todo.done) return console.log(`Todo [${id}] is already done.`);
  todo.done = true;
  console.log(`Marked [${id}] done.`);
}
function cmdDelete(arg) {
  const store = getUserStore();
  if (!store) return console.log('Please login first: login <username>');
  const id = Number((arg||'').trim());
  if (!Number.isInteger(id)) return console.log('Usage: delete <id>');
  const idx = store.todos.findIndex(t => t.id === id);
  if (idx === -1) return console.log(`Todo with id ${id} not found.`);
  store.todos.splice(idx,1);
  console.log(`Deleted todo [${id}]`);
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
  login <username>            -> switch or create user
  whoami                      -> show current user
  logout                      -> logout current user
  add "<text>"                -> add a todo (text must be quoted)
  list [all|pending|done]     -> list todos (newest first)
  done <id>                   -> mark todo done
  delete <id>                 -> remove todo
  help                        -> show this help
  exit / quit                 -> exit the app`);
      break;
    case 'login': cmdLogin(arg); break;
    case 'whoami': cmdWhoami(); break;
    case 'logout': cmdLogout(); break;
    case 'add': cmdAdd(arg); break;
    case 'list': cmdList(arg); break;
    case 'done': cmdDone(arg); break;
    case 'delete': cmdDelete(arg); break;
    case 'exit': case 'quit':
      console.log('Goodbye!'); process.exit(0); break;
    default:
      console.log("Unknown command. Type 'help'.");
  }
}

process.stdin.on("data", (data) => {
  manageInput(data.toString());
});
