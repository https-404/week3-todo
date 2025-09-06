import readline from 'readline';
import addCommand from './commands/add.js';
import deleteCommand from './commands/delete.js';
import doneCommand from './commands/done.js';
import helpCommand from './commands/help.js';
import listCommand from './commands/list.js';
import loginCommand from './commands/login.js';
import logoutCommand from './commands/logout.js';
import whoamiCommand from './commands/whoami.js';

const commands = {
  add: addCommand,
  delete: deleteCommand,
  done: doneCommand,
  help: helpCommand,
  list: listCommand,
  login: loginCommand,
  logout: logoutCommand,
  whoami: whoamiCommand,
  exit: () => process.exit(0),
  quit: () => process.exit(0)
};

export default function startCLI() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ' todo>> '
  });

  rl.prompt();

  rl.on('line', line => {
    const [cmd, ...args] = line.trim().split(' ');
    const action = commands[cmd];
    if (action) {
      action(args);
    } else {
      console.log(` Unknown command: ${cmd}. Try "help"`);
    }
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(' Thanks for using the Todo App');
    process.exit(0);
  });
}
