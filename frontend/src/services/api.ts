import { Task } from '../types/Task';

const API_URL = 'http://localhost:3000/tasks';

export const api = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Falha ao buscar tarefas');
    return response.json();
  },

  createTask: async (title: string): Promise<Task> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, completed: false }),
    });
    if (!response.ok) throw new Error('Falha ao criar tarefa');
    return response.json();
  },

  updateTask: async (id: number, updates: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Falha ao atualizar tarefa');
    return response.json();
  },

  deleteTask: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Falha ao deletar tarefa');
  },
};
