import React, { useState } from 'react';

interface AddTodoProps {
  onAdd: (title: string) => void;
  isAdding: boolean;
}

export function AddTodo({ onAdd, isAdding }: AddTodoProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input 
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Adicionar nova tarefa..." 
        className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        disabled={isAdding}
      />
      <button 
        type="submit" 
        disabled={!title.trim() || isAdding}
        className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAdding ? 'Adicionando...' : 'Adicionar'}
      </button>
    </form>
  );
}
