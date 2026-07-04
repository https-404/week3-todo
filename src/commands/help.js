export default function helpCommand() {
  console.log('\n📝 === TODO APP HELP MENU ===\n');
  console.log('Available Commands:');
  console.log('  login <username>            Login as a user ');
  console.log('  whoami                      Show current user');
  console.log('  add "<todo>"                Add a new todo');
  console.log('  list [all|pending|done]     Show todos');
  console.log('  done <id>                   Mark a todo as finished');
  console.log('  delete <id>                 Delete a todo');
  console.log('  logout                      Logout');
  console.log('  help                        Show this menu');
  console.log('  exit / quit                 Close the app');
  console.log('\n===============================\n');
}
