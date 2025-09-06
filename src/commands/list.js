import todoService from '../services/todoService.js';
import printer from '../utils/printer.js';

export default function listCommand(args) {
  try {
    const filter = args[0] || 'all';
    const todos = todoService.list(filter);

    if (todos.length === 0) {
      printer.info(`No ${filter} todos`);
      return;
    }

    console.log('\n=== YOUR TODO LIST ===');
    for (let todo of todos) {
      const mark = todo.isCompleted ? '✓' : '○';
      const status = todo.isCompleted ? 'FINISHED' : 'TO DO';
      console.log(`#${todo.todoId} ${mark} ${todo.description} [${status}]`);
    }
    console.log('======================\n');
  } catch (err) {
    printer.error(err.message);
  }
}
