import todoService from '../services/todoService.js';
import printer from '../utils/printer.js';

export default function addCommand(args) {
  try {
    const description = args.join(' ').replace(/^"|"$/g, '');
    const todo = todoService.add(description);
    printer.success(`Added #${todo.todoId}: ${todo.description}`);
  } catch (err) {
    printer.error(err.message);
  }
}
