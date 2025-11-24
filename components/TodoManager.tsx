'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Edit2,
  X,
  Save,
} from 'lucide-react';
import { Todo, Priority, Platform } from '@/types';
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  addSubtaskToTodo,
  updateSubtask,
  deleteSubtask,
  toggleSubtask,
} from '@/lib/storage';

export default function TodoManager() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<{ [key: string]: string }>({});
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Priority,
    platform: '' as Platform | '',
    dueDate: '',
    dueTime: '',
  });

  useEffect(() => {
    setMounted(true);
    loadTodos();
  }, []);

  const loadTodos = () => {
    setTodos(getTodos());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const todoData = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      platform: formData.platform || undefined,
      dueDate: formData.dueDate
        ? new Date(`${formData.dueDate}T${formData.dueTime || '12:00'}`)
        : undefined,
      completed: false,
    };

    if (editingId) {
      updateTodo(editingId, todoData);
      setEditingId(null);
    } else {
      addTodo(todoData);
    }

    resetForm();
    loadTodos();
  };

  const handleEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setFormData({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      platform: todo.platform || '',
      dueDate: todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : '',
      dueTime: todo.dueDate ? format(new Date(todo.dueDate), 'HH:mm') : '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Etes-vous sur de vouloir supprimer cette tache?')) {
      deleteTodo(id);
      loadTodos();
    }
  };

  const handleToggle = (id: string) => {
    toggleTodo(id);
    loadTodos();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      platform: '',
      dueDate: '',
      dueTime: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleAddSubtask = (todoId: string) => {
    const title = newSubtaskTitle[todoId]?.trim();
    if (!title) return;

    addSubtaskToTodo(todoId, title);
    setNewSubtaskTitle({ ...newSubtaskTitle, [todoId]: '' });
    loadTodos();
  };

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    toggleSubtask(todoId, subtaskId);
    loadTodos();
  };

  const handleDeleteSubtask = (todoId: string, subtaskId: string) => {
    if (confirm('Supprimer cette sous-tache?')) {
      deleteSubtask(todoId, subtaskId);
      loadTodos();
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Gestion des Taches
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {todos.length} tache(s) au total
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              resetForm();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? 'Annuler' : 'Nouvelle Tache'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingId ? 'Modifier la tache' : 'Nouvelle tache'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Titre *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ex: Publier un post LinkedIn..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Details de la tache..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priorite
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priority: e.target.value as Priority,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="LOW">Basse</option>
                  <option value="MEDIUM">Moyenne</option>
                  <option value="HIGH">Haute</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plateforme
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      platform: e.target.value as Platform | '',
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">Aucune</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="TWITTER">Twitter</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="YOUTUBE">YouTube</option>
                  <option value="MALT">Malt</option>
                  <option value="UPWORK">Upwork</option>
                  <option value="FIVERR">Fiverr</option>
                  <option value="FREELANCER">Freelancer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date d'echeance
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heure
                </label>
                <input
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dueTime: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Mettre a jour' : 'Ajouter'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Todos List */}
      <div className="grid grid-cols-1 gap-4">
        {todos.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Aucune tache. Cliquez sur "Nouvelle Tache" pour commencer!
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggle(todo.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {todo.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500 transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-lg font-semibold mb-2 ${
                      todo.completed
                        ? 'line-through text-gray-400'
                        : 'text-gray-800 dark:text-white'
                    }`}
                  >
                    {todo.title}
                  </h3>

                  {todo.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {todo.description}
                    </p>
                  )}

                  {/* Subtasks Section */}
                  {todo.subtasks && todo.subtasks.length > 0 && (
                    <div className="mb-4 ml-2 space-y-2 border-l-2 border-blue-300 dark:border-blue-700 pl-4">
                      {todo.subtasks.map((subtask) => (
                        <div
                          key={subtask.id}
                          className="flex items-center gap-2 group"
                        >
                          <button
                            onClick={() =>
                              handleToggleSubtask(todo.id, subtask.id)
                            }
                            className="flex-shrink-0"
                          >
                            {subtask.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors" />
                            )}
                          </button>
                          <span
                            className={`flex-1 text-sm ${
                              subtask.completed
                                ? 'line-through text-gray-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {subtask.title}
                          </span>
                          <button
                            onClick={() =>
                              handleDeleteSubtask(todo.id, subtask.id)
                            }
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Subtask Input */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSubtaskTitle[todo.id] || ''}
                      onChange={(e) =>
                        setNewSubtaskTitle({
                          ...newSubtaskTitle,
                          [todo.id]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubtask(todo.id);
                        }
                      }}
                      placeholder="Ajouter une sous-tache..."
                      className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleAddSubtask(todo.id)}
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        todo.priority === 'HIGH'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          : todo.priority === 'MEDIUM'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      }`}
                    >
                      {todo.priority}
                    </span>

                    {todo.platform && (
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                        {todo.platform}
                      </span>
                    )}

                    {todo.dueDate && (
                      <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(todo.dueDate), 'dd MMM yyyy, HH:mm', {
                          locale: fr,
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
