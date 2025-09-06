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

// user commands
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

// router
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
    case 'exit': case 'quit':
      console.log('Goodbye!'); process.exit(0); break;
    default:
      console.log("Unknown command. Type 'help'.");
  }
}

process.stdin.on("data", (data) => {
  manageInput(data.toString());
});
