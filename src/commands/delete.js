import todoService from '../services/todoService.js';
import printer from '../utils/printer.js';

export default function deleteCommand(args) {
  try {
    const id = parseInt(args[0]);
    const todo = todoService.remove(id);
    printer.success(`Deleted #${todo.todoId}: ${todo.description}`);
  } catch (err) {
    printer.error(err.message);
  }
}
