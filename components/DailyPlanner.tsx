'use client';

import { useEffect, useState } from 'react';
import { format, startOfDay, endOfDay, addDays, setHours } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  Target,
  FileText,
  Plus,
  Trash2,
  Edit2,
  MoreVertical,
} from 'lucide-react';
import { Todo, Post, Goal } from '@/types';
import {
  getTodos,
  toggleTodo,
  toggleSubtask,
  getPosts,
  getGoals,
} from '@/lib/storage';

export default function DailyPlanner() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    setMounted(true);
    loadAll();
  }, [selectedDate]);

  const loadAll = () => {
    console.log('📅 [PLANNER] Loading data for:', selectedDate);
    setTodos(getTodos());
    setPosts(getPosts());
    setGoals(getGoals());
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

  // Group items by hour
  const getItemsByHour = () => {
    const hourMap: Record<number, { todos: Todo[]; posts: Post[]; goals: Goal[] }> = {};

    // Initialize all hours
    for (let i = 0; i < 24; i++) {
      hourMap[i] = { todos: [], posts: [], goals: [] };
    }

    // Group todos by hour
    dayTodos.forEach((todo) => {
      if (todo.dueDate) {
        const hour = new Date(todo.dueDate).getHours();
        hourMap[hour].todos.push(todo);
      }
    });

    // Group posts by hour
    dayPosts.forEach((post) => {
      if (post.scheduledFor) {
        const hour = new Date(post.scheduledFor).getHours();
        hourMap[hour].posts.push(post);
      }
    });

    // Group goals by hour (default to 9:00 if no time)
    dayGoals.forEach((goal) => {
      const hour = 9; // Default hour for goals
      hourMap[hour].goals.push(goal);
    });

    return hourMap;
  };

  const hourMap = getItemsByHour();

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    loadAll();
  };

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    toggleSubtask(todoId, subtaskId);
    loadAll();
  };

  if (!mounted) return null;

  const completedTodos = dayTodos.filter((t) => t.completed).length;
  const totalTodos = dayTodos.length;
  const progressPercent = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header avec navigation */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Calendar className="w-8 h-8 md:w-10 md:h-10 text-orange-600 dark:text-orange-400" />
                Planning Quotidien
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
              </p>
            </div>

            {/* Navigation de date */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                className="p-3 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-all hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>

              <button
                onClick={() => setSelectedDate(new Date())}
                className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                  isToday
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/30'
                }`}
              >
                Aujourd'hui
              </button>

              <button
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="p-3 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-all hover:scale-110"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {totalTodos > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Progression du jour
                </span>
                <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  {completedTodos} / {totalTodos} complétées ({Math.round(progressPercent)}%)
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
        </div>

        {/* Timeline par heure */}
        <div className="space-y-4">
          {Object.entries(hourMap)
            .filter(([_, items]) => items.todos.length > 0 || items.posts.length > 0 || items.goals.length > 0)
            .map(([hourStr, items]) => {
              const hour = parseInt(hourStr);
              const hasItems = items.todos.length > 0 || items.posts.length > 0 || items.goals.length > 0;

              if (!hasItems) return null;

              return (
                <div
                  key={hour}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all"
                >
                  {/* Header de l'heure */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {hour.toString().padStart(2, '0')}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">h00</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {hour < 12 ? 'Matin' : hour < 18 ? 'Après-midi' : 'Soirée'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {items.todos.length} tâche{items.todos.length > 1 ? 's' : ''} • {items.posts.length} post{items.posts.length > 1 ? 's' : ''} • {items.goals.length} objectif{items.goals.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Todos */}
                  {items.todos.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {items.todos.map((todo) => (
                        <div
                          key={todo.id}
                          className={`group p-4 rounded-2xl border-2 transition-all hover:shadow-md ${
                            todo.completed
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              : 'bg-white dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => handleToggleTodo(todo.id)}
                              className="mt-1 flex-shrink-0"
                            >
                              {todo.completed ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              ) : (
                                <Circle className="w-6 h-6 text-gray-400 hover:text-orange-500 transition-colors" />
                              )}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4
                                  className={`font-semibold text-gray-800 dark:text-white ${
                                    todo.completed ? 'line-through text-gray-500' : ''
                                  }`}
                                >
                                  {todo.title}
                                </h4>

                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      todo.priority === 'HIGH'
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                        : todo.priority === 'MEDIUM'
                                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                    }`}
                                  >
                                    {todo.priority}
                                  </span>

                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {format(new Date(todo.dueDate!), 'HH:mm')}
                                  </span>
                                </div>
                              </div>

                              {todo.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                  {todo.description}
                                </p>
                              )}

                              {/* Sous-tâches */}
                              {todo.subtasks && todo.subtasks.length > 0 && (
                                <div className="mt-3 space-y-2 pl-4 border-l-2 border-orange-200 dark:border-orange-800">
                                  {todo.subtasks.map((subtask) => (
                                    <div
                                      key={subtask.id}
                                      className="flex items-center gap-2 group/subtask"
                                    >
                                      <button
                                        onClick={() => handleToggleSubtask(todo.id, subtask.id)}
                                        className="flex-shrink-0"
                                      >
                                        {subtask.completed ? (
                                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        ) : (
                                          <Circle className="w-4 h-4 text-gray-400 hover:text-orange-500 transition-colors" />
                                        )}
                                      </button>
                                      <span
                                        className={`text-sm ${
                                          subtask.completed
                                            ? 'line-through text-gray-400'
                                            : 'text-gray-700 dark:text-gray-300'
                                        }`}
                                      >
                                        {subtask.title}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {todo.platform && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium">
                                    {todo.platform}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Posts */}
                  {items.posts.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {items.posts.map((post) => (
                        <div
                          key={post.id}
                          className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800"
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-blue-500 mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-semibold">
                                  {post.platform}
                                </span>
                                <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {format(new Date(post.scheduledFor!), 'HH:mm')}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                {post.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Goals */}
                  {items.goals.length > 0 && (
                    <div className="space-y-3">
                      {items.goals.map((goal) => (
                        <div
                          key={goal.id}
                          className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800"
                        >
                          <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-green-500 mt-1" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                {goal.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                                    style={{
                                      width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                  {goal.currentValue} / {goal.targetValue} {goal.unit}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Empty state */}
        {dayTodos.length === 0 && dayPosts.length === 0 && dayGoals.length === 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 md:p-16 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              Aucune activité prévue
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Vous n'avez rien de planifié pour le {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Utilisez les sections Tâches, Contenu et Objectifs pour planifier votre journée
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
