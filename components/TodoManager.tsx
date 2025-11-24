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
  Clock,
  Flag,
  Tag,
  X,
} from 'lucide-react';
import { Todo, Priority, Platform } from '@/types';
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  addSubtaskToTodo,
  toggleSubtask,
  deleteSubtask,
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
    dueTime: '12:00',
  });

  useEffect(() => {
    setMounted(true);
    loadTodos();
  }, []);

  const loadTodos = () => {
    const loadedTodos = getTodos();
    console.log('Loaded todos:', loadedTodos);
    setTodos(loadedTodos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const todoData = {
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority,
      platform: formData.platform || undefined,
      dueDate: formData.dueDate
        ? new Date(`${formData.dueDate}T${formData.dueTime}`)
        : undefined,
      completed: false,
    };

    console.log('Submitting todo:', todoData, 'editingId:', editingId);

    if (editingId) {
      const updated = updateTodo(editingId, todoData);
      console.log('Updated:', updated);
    } else {
      const created = addTodo(todoData);
      console.log('Created:', created);
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
      dueTime: todo.dueDate ? format(new Date(todo.dueDate), 'HH:mm') : '12:00',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer cette tâche?')) {
      const success = deleteTodo(id);
      console.log('Delete result:', success);
      loadTodos();
    }
  };

  const handleToggle = (id: string) => {
    const result = toggleTodo(id);
    console.log('Toggle result:', result);
    loadTodos();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      platform: '',
      dueDate: '',
      dueTime: '12:00',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleAddSubtask = (todoId: string) => {
    const title = newSubtaskTitle[todoId]?.trim();
    if (!title) return;

    const result = addSubtaskToTodo(todoId, title);
    console.log('Add subtask result:', result);
    setNewSubtaskTitle({ ...newSubtaskTitle, [todoId]: '' });
    loadTodos();
  };

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    const result = toggleSubtask(todoId, subtaskId);
    console.log('Toggle subtask result:', result);
    loadTodos();
  };

  const handleDeleteSubtask = (todoId: string, subtaskId: string) => {
    if (confirm('Supprimer cette sous-tâche?')) {
      const result = deleteSubtask(todoId, subtaskId);
      console.log('Delete subtask result:', result);
      loadTodos();
    }
  };

  if (!mounted) return null;

  const priorityColors = {
    HIGH: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
    MEDIUM: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
    LOW: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                Mes Tâches
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {todos.filter((t) => t.completed).length} / {todos.length} complétées
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {showForm ? (
                <>
                  <X className="w-5 h-5" />
                  Annuler
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Nouvelle Tâche
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {todos.length > 0 && (
            <div className="mt-6">
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(todos.filter((t) => t.completed).length / todos.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {editingId ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="Ex: Publier sur LinkedIn..."
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                  placeholder="Détails de la tâche..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Flag className="w-4 h-4 inline mr-1" />
                    Priorité
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value as Priority })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  >
                    <option value="LOW">🟢 Basse</option>
                    <option value="MEDIUM">🟠 Moyenne</option>
                    <option value="HIGH">🔴 Haute</option>
                  </select>
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Plateforme
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value as Platform | '' })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  >
                    <option value="">Aucune</option>
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="TWITTER">Twitter</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="YOUTUBE">YouTube</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Heure
                  </label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {editingId ? 'Mettre à jour' : 'Créer la tâche'}
              </button>
            </form>
          </div>
        )}

        {/* Todos List */}
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-blue-500 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Aucune tâche
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Commencez par créer votre première tâche
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Créer une tâche
              </button>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border-2 ${
                  todo.completed
                    ? 'border-green-200 dark:border-green-800 opacity-75'
                    : priorityColors[todo.priority]
                } p-6 hover:shadow-xl transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggle(todo.id)}
                    className="flex-shrink-0 mt-1"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-7 h-7 text-green-500 dark:text-green-400 hover:scale-110 transition-transform" />
                    ) : (
                      <Circle className="w-7 h-7 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:scale-110 transition-all" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* Title */}
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        todo.completed
                          ? 'line-through text-gray-400 dark:text-gray-500'
                          : 'text-gray-800 dark:text-white'
                      }`}
                    >
                      {todo.title}
                    </h3>

                    {/* Description */}
                    {todo.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                        {todo.description}
                      </p>
                    )}

                    {/* Subtasks */}
                    {todo.subtasks && todo.subtasks.length > 0 && (
                      <div className="mb-4 space-y-2 ml-2 border-l-2 border-blue-200 dark:border-blue-700 pl-4">
                        {todo.subtasks.map((subtask) => (
                          <div key={subtask.id} className="flex items-center gap-2 group">
                            <button
                              onClick={() => handleToggleSubtask(todo.id, subtask.id)}
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
                              onClick={() => handleDeleteSubtask(todo.id, subtask.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Subtask */}
                    <div className="flex gap-2 mb-4">
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
                            e.preventDefault();
                            handleAddSubtask(todo.id);
                          }
                        }}
                        placeholder="Ajouter une sous-tâche..."
                        className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                      />
                      <button
                        onClick={() => handleAddSubtask(todo.id)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Priority Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          todo.priority === 'HIGH'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                            : todo.priority === 'MEDIUM'
                            ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        <Flag className="w-3 h-3" />
                        {todo.priority}
                      </span>

                      {/* Platform Badge */}
                      {todo.platform && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">
                          <Tag className="w-3 h-3" />
                          {todo.platform}
                        </span>
                      )}

                      {/* Due Date */}
                      {todo.dueDate && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(todo.dueDate), 'dd MMM, HH:mm', { locale: fr })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(todo)}
                      className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-all"
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
    </div>
  );
}
