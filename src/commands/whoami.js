import userService from '../services/userService.js';
import printer from '../utils/printer.js';

export default function whoamiCommand() {
  const user = userService.currentUser();
  if (user) {
    printer.info(`You are logged in as: ${user.userName}`);
  } else {
    printer.info('Nobody is logged in');
  }
}
