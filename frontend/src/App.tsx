import { useEffect, useState } from 'react';
import { api } from './services/api';
import type { Task } from './types/Task';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar as tarefas. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (title: string) => {
    try {
      setIsAdding(true);
      const newTask = await api.createTask(title);
      setTasks((prev) => [...prev, newTask]);
    } catch (err) {
      console.error(err);
      alert('Erro ao criar a tarefa.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleTask = async (id: number, currentStatus: boolean) => {
    try {
      // Optimistic update
      setTasks((prev) => 
        prev.map(task => task.id === id ? { ...task, completed: !currentStatus } : task)
      );
      await api.updateTask(id, { completed: !currentStatus });
    } catch (err) {
      console.error(err);
      // Revert on error
      setTasks((prev) => 
        prev.map(task => task.id === id ? { ...task, completed: currentStatus } : task)
      );
      alert('Erro ao atualizar a tarefa.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao deletar a tarefa.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Todo List</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <AddTodo onAdd={handleAddTask} isAdding={isAdding} />
        
        <TodoList 
          tasks={tasks} 
          isLoading={isLoading} 
          onToggle={handleToggleTask} 
          onDelete={handleDeleteTask} 
        />
      </div>
    </div>
  );
}

export default App;
