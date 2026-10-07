import type { Task } from '../types/Task';

interface TodoItemProps {
  task: Task;
  onToggle: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ task, onToggle, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3 overflow-hidden">
        <input 
          type="checkbox" 
          checked={task.completed}
          onChange={() => onToggle(task.id, task.completed)}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
        />
        <span 
          className={`text-gray-700 truncate ${task.completed ? 'line-through text-gray-400' : ''}`}
          title={task.title}
        >
          {task.title}
        </span>
      </div>
      <button 
        onClick={() => onDelete(task.id)}
        className="text-red-500 hover:text-red-700 p-1 ml-2 flex-shrink-0"
        aria-label="Excluir tarefa"
      >
        Excluir
      </button>
    </li>
  );
}
