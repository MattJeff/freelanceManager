'use client';

import { useEffect, useState } from 'react';
import { format, startOfDay, endOfDay, addDays, startOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Edit2,
  X,
  Save,
  Target,
  FileText,
  ListTodo,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Todo, Post, Goal, Priority, Platform } from '@/types';
import {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  getPosts,
  addPost,
  updatePost,
  deletePost,
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from '@/lib/storage';

type ItemType = 'todo' | 'post' | 'goal';

export default function DailyPlanner() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<ItemType>('todo');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Todo form
  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Priority,
    platform: '' as Platform | '',
    dueDate: '',
    dueTime: '12:00',
  });

  // Post form
  const [postForm, setPostForm] = useState({
    platform: 'LINKEDIN' as Platform,
    content: '',
    scheduledDate: '',
    scheduledTime: '12:00',
  });

  // Goal form
  const [goalForm, setGoalForm] = useState({
    title: '',
    description: '',
    category: '',
    currentValue: 0,
    targetValue: 100,
    unit: 'unités',
    targetDate: '',
  });

  useEffect(() => {
    setMounted(true);
    loadAll();
  }, []);

  const loadAll = () => {
    console.log('📅 [PLANNER] Loading all data for DailyPlanner...');
    const loadedTodos = getTodos();
    const loadedPosts = getPosts();
    const loadedGoals = getGoals();
    console.log('📅 [PLANNER] Loaded:', {
      todos: loadedTodos.length,
      posts: loadedPosts.length,
      goals: loadedGoals.length
    });
    setTodos(loadedTodos);
    setPosts(loadedPosts);
    setGoals(loadedGoals);
  };

  // Filter items by selected date
  const getItemsForDate = (date: Date) => {
    const start = startOfDay(date);
    const end = endOfDay(date);

    const dayTodos = todos.filter((t) => {
      if (!t.dueDate) return false;
      const dueDate = new Date(t.dueDate);
      return dueDate >= start && dueDate <= end;
    });

    const dayPosts = posts.filter((p) => {
      if (!p.scheduledFor) return false;
      const scheduledDate = new Date(p.scheduledFor);
      return scheduledDate >= start && scheduledDate <= end;
    });

    const dayGoals = goals.filter((g) => {
      const targetDate = new Date(g.targetDate);
      return targetDate >= start && targetDate <= end;
    });

    return { dayTodos, dayPosts, dayGoals };
  };

  const { dayTodos, dayPosts, dayGoals } = getItemsForDate(selectedDate);

  // Sort items by time
  const sortedTodos = [...dayTodos].sort((a, b) => {
    if (!a.dueDate || !b.dueDate) return 0;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const sortedPosts = [...dayPosts].sort((a, b) => {
    if (!a.scheduledFor || !b.scheduledFor) return 0;
    return new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime();
  });

  // Todo CRUD
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📅 [PLANNER] handleAddTodo called - editingId:', editingId);

    const todoData = {
      title: todoForm.title,
      description: todoForm.description || undefined,
      priority: todoForm.priority,
      platform: todoForm.platform || undefined,
      dueDate: new Date(`${todoForm.dueDate}T${todoForm.dueTime}`),
      completed: false,
    };

    console.log('📅 [PLANNER] Todo data:', todoData);

    if (editingId && formType === 'todo') {
      console.log('📅 [PLANNER] Updating existing todo');
      updateTodo(editingId, todoData);
    } else {
      console.log('📅 [PLANNER] Creating new todo');
      addTodo(todoData);
    }

    resetForms();
    loadAll();
  };

  const handleDeleteTodo = (id: string) => {
    if (confirm('Supprimer cette tâche?')) {
      deleteTodo(id);
      loadAll();
    }
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    loadAll();
  };

  const handleEditTodo = (todo: Todo) => {
    setFormType('todo');
    setEditingId(todo.id);
    setTodoForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      platform: todo.platform || '',
      dueDate: todo.dueDate ? format(new Date(todo.dueDate), 'yyyy-MM-dd') : '',
      dueTime: todo.dueDate ? format(new Date(todo.dueDate), 'HH:mm') : '12:00',
    });
    setShowForm(true);
  };

  // Post CRUD
  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📅 [PLANNER] handleAddPost called - editingId:', editingId);

    const postData = {
      platform: postForm.platform,
      content: postForm.content,
      scheduledFor: new Date(`${postForm.scheduledDate}T${postForm.scheduledTime}`),
      published: false,
    };

    console.log('📅 [PLANNER] Post data:', postData);

    if (editingId && formType === 'post') {
      console.log('📅 [PLANNER] Updating existing post');
      updatePost(editingId, postData);
    } else {
      console.log('📅 [PLANNER] Creating new post');
      addPost(postData);
    }

    resetForms();
    loadAll();
  };

  const handleDeletePost = (id: string) => {
    if (confirm('Supprimer ce post?')) {
      deletePost(id);
      loadAll();
    }
  };

  const handleEditPost = (post: Post) => {
    setFormType('post');
    setEditingId(post.id);
    setPostForm({
      platform: post.platform,
      content: post.content,
      scheduledDate: post.scheduledFor
        ? format(new Date(post.scheduledFor), 'yyyy-MM-dd')
        : '',
      scheduledTime: post.scheduledFor
        ? format(new Date(post.scheduledFor), 'HH:mm')
        : '12:00',
    });
    setShowForm(true);
  };

  // Goal CRUD
  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📅 [PLANNER] handleAddGoal called - editingId:', editingId);

    const goalData = {
      title: goalForm.title,
      description: goalForm.description || undefined,
      category: goalForm.category || undefined,
      currentValue: goalForm.currentValue,
      targetValue: goalForm.targetValue,
      unit: goalForm.unit,
      targetDate: new Date(goalForm.targetDate),
      completed: false,
    };

    console.log('📅 [PLANNER] Goal data:', goalData);

    if (editingId && formType === 'goal') {
      console.log('📅 [PLANNER] Updating existing goal');
      updateGoal(editingId, goalData);
    } else {
      console.log('📅 [PLANNER] Creating new goal');
      addGoal(goalData);
    }

    resetForms();
    loadAll();
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm('Supprimer cet objectif?')) {
      deleteGoal(id);
      loadAll();
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setFormType('goal');
    setEditingId(goal.id);
    setGoalForm({
      title: goal.title,
      description: goal.description || '',
      category: goal.category || '',
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      unit: goal.unit,
      targetDate: format(new Date(goal.targetDate), 'yyyy-MM-dd'),
    });
    setShowForm(true);
  };

  const resetForms = () => {
    setTodoForm({
      title: '',
      description: '',
      priority: 'MEDIUM',
      platform: '',
      dueDate: format(selectedDate, 'yyyy-MM-dd'),
      dueTime: '12:00',
    });
    setPostForm({
      platform: 'LINKEDIN',
      content: '',
      scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
      scheduledTime: '12:00',
    });
    setGoalForm({
      title: '',
      description: '',
      category: '',
      currentValue: 0,
      targetValue: 100,
      unit: 'unités',
      targetDate: format(selectedDate, 'yyyy-MM-dd'),
    });
    setShowForm(false);
    setEditingId(null);
  };

  const openNewForm = (type: ItemType) => {
    setFormType(type);
    setEditingId(null);
    // Pre-fill dates with selected date
    setTodoForm({ ...todoForm, dueDate: format(selectedDate, 'yyyy-MM-dd') });
    setPostForm({ ...postForm, scheduledDate: format(selectedDate, 'yyyy-MM-dd') });
    setGoalForm({ ...goalForm, targetDate: format(selectedDate, 'yyyy-MM-dd') });
    setShowForm(true);
  };

  if (!mounted) return null;

  const completedTodos = sortedTodos.filter((t) => t.completed).length;
  const totalTodos = sortedTodos.length;
  const progressPercent = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Date Navigation Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Planning Quotidien
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, -1))}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setSelectedDate(new Date())}
              className="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
            >
              Aujourd'hui
            </button>
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 1))}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {totalTodos > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {completedTodos} / {totalTodos} tâches complétées
              </span>
              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Quick Add Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => openNewForm('todo')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Tâche
          </button>
          <button
            onClick={() => openNewForm('post')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Post
          </button>
          <button
            onClick={() => openNewForm('goal')}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Objectif
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {editingId ? 'Modifier' : 'Nouveau'}{' '}
              {formType === 'todo' ? 'Tâche' : formType === 'post' ? 'Post' : 'Objectif'}
            </h3>
            <button
              onClick={resetForms}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Todo Form */}
          {formType === 'todo' && (
            <form onSubmit={handleAddTodo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={todoForm.title}
                  onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Publier sur LinkedIn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={todoForm.description}
                  onChange={(e) => setTodoForm({ ...todoForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Détails..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Priorité
                  </label>
                  <select
                    value={todoForm.priority}
                    onChange={(e) =>
                      setTodoForm({ ...todoForm, priority: e.target.value as Priority })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
                    value={todoForm.platform}
                    onChange={(e) =>
                      setTodoForm({ ...todoForm, platform: e.target.value as Platform | '' })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={todoForm.dueDate}
                    onChange={(e) => setTodoForm({ ...todoForm, dueDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    required
                    value={todoForm.dueTime}
                    onChange={(e) => setTodoForm({ ...todoForm, dueTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </form>
          )}

          {/* Post Form */}
          {formType === 'post' && (
            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Plateforme *
                </label>
                <select
                  value={postForm.platform}
                  onChange={(e) =>
                    setPostForm({ ...postForm, platform: e.target.value as Platform })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="TWITTER">Twitter</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="YOUTUBE">YouTube</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contenu *
                </label>
                <textarea
                  required
                  value={postForm.content}
                  onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="Contenu du post..."
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {postForm.content.length} caractères
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={postForm.scheduledDate}
                    onChange={(e) => setPostForm({ ...postForm, scheduledDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Heure *
                  </label>
                  <input
                    type="time"
                    required
                    value={postForm.scheduledTime}
                    onChange={(e) => setPostForm({ ...postForm, scheduledTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </form>
          )}

          {/* Goal Form */}
          {formType === 'goal' && (
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  required
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Atteindre 1000 followers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={goalForm.description}
                  onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Détails..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    value={goalForm.category}
                    onChange={(e) => setGoalForm({ ...goalForm, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: LINKEDIN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unité *
                  </label>
                  <input
                    type="text"
                    required
                    value={goalForm.unit}
                    onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: followers"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valeur actuelle
                  </label>
                  <input
                    type="number"
                    value={goalForm.currentValue}
                    onChange={(e) =>
                      setGoalForm({ ...goalForm, currentValue: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valeur cible *
                  </label>
                  <input
                    type="number"
                    required
                    value={goalForm.targetValue}
                    onChange={(e) =>
                      setGoalForm({ ...goalForm, targetValue: parseInt(e.target.value) || 100 })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date cible *
                </label>
                <input
                  type="date"
                  required
                  value={goalForm.targetDate}
                  onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Mettre à jour' : 'Ajouter'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* Timeline View */}
      <div className="space-y-4">
        {/* Todos Section */}
        {sortedTodos.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-orange-500" />
              Tâches ({sortedTodos.length})
            </h3>

            <div className="space-y-3">
              {sortedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-orange-500 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              todo.completed
                                ? 'line-through text-gray-400'
                                : 'text-gray-800 dark:text-white'
                            }`}
                          >
                            {todo.title}
                          </h4>
                          {todo.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {todo.description}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditTodo(todo)}
                            className="p-1.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {todo.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            {format(new Date(todo.dueDate), 'HH:mm')}
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
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
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-orange-900/30 dark:text-orange-400 font-medium">
                            {todo.platform}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts Section */}
        {sortedPosts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-500" />
              Posts planifiés ({sortedPosts.length})
            </h3>

            <div className="space-y-3">
              {sortedPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 text-sm font-medium">
                        {post.platform}
                      </span>
                      {post.scheduledFor && (
                        <span className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          {format(new Date(post.scheduledFor), 'HH:mm')}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="p-1.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {post.content.substring(0, 200)}
                    {post.content.length > 200 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goals Section */}
        {dayGoals.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Objectifs à atteindre ({dayGoals.length})
            </h3>

            <div className="space-y-3">
              {dayGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                        {goal.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {goal.currentValue} / {goal.targetValue} {goal.unit}
                        </span>
                        {goal.category && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                            {goal.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditGoal(goal)}
                        className="p-1.5 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (goal.currentValue / goal.targetValue) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {sortedTodos.length === 0 && sortedPosts.length === 0 && dayGoals.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              Aucune activité prévue pour cette date
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
              Commencez à planifier votre journée en ajoutant des tâches, posts ou objectifs
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => openNewForm('todo')}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Ajouter une tâche
              </button>
              <button
                onClick={() => openNewForm('post')}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                Planifier un post
              </button>
              <button
                onClick={() => openNewForm('goal')}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Définir un objectif
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
