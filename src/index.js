console.log("Welcome to Todo CLI! Type 'help' for commands:");

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
    case 'exit':
    case 'quit':
      console.log('Goodbye!');
      process.exit(0);
      break;
    default:
      console.log("Unknown command. Type 'help'.");
  }
}

process.stdin.on("data", (data) => {
  manageInput(data.toString());
});

