import todoService from '../services/todoService.js';
import printer from '../utils/printer.js';

export default function doneCommand(args) {
  try {
    const id = parseInt(args[0]);
    const todo = todoService.markDone(id);
    printer.success(`Marked #${todo.todoId} as finished`);
  } catch (err) {
    printer.error(err.message);
  }
}
