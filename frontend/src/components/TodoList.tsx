import type { Task } from '../types/Task';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  tasks: Task[];
  onToggle: (id: number, currentStatus: boolean) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export function TodoList({ tasks, onToggle, onDelete, isLoading }: TodoListProps) {
  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Carregando tarefas...</div>;
  }

  if (tasks.length === 0) {
    return <div className="text-center py-4 text-gray-500">Nenhuma tarefa encontrada.</div>;
  }

  return (
    <ul className="space-y-3">
      {tasks.map(task => (
        <TodoItem 
          key={task.id} 
          task={task} 
          onToggle={onToggle} 
          onDelete={onDelete} 
        />
      ))}
    </ul>
  );
}
