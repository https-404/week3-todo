import userService from '../services/userService.js';
import printer from '../utils/printer.js';

export default function loginCommand(args) {
  try {
    const username = args[0];
    const user = userService.login(username);
    printer.success(`Welcome ${user.userName}!`);
  } catch (err) {
    printer.error(err.message);
  }
}
