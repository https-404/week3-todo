import userService from '../services/userService.js';
import printer from '../utils/printer.js';

export default function logoutCommand() {
  const prev = userService.logout();
  if (prev) {
    printer.success(`Logged out ${prev}`);
  } else {
    printer.info('Nobody is logged in');
  }
}
