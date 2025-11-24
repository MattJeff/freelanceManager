'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Clock, CheckCircle2, Circle, ChevronRight } from 'lucide-react';
import { Todo } from '@/types';
import { getTodos, toggleTodo, toggleSubtask } from '@/lib/storage';
import { initialTodos } from '@/lib/initial-data';
import { addTodo } from '@/lib/storage';

export default function DailyPlanner() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadTodos();
  }, []);

  const loadTodos = () => {
    const storedTodos = getTodos();
    if (storedTodos.length === 0) {
      initialTodos.forEach((todo) => addTodo(todo));
      setTodos(getTodos());
    } else {
      setTodos(storedTodos);
    }
  };

  const handleToggleTodo = (id: string) => {
    toggleTodo(id);
    loadTodos();
  };

  const handleToggleSubtask = (todoId: string, subtaskId: string) => {
    toggleSubtask(todoId, subtaskId);
    loadTodos();
  };

  const todayTodos = todos
    .filter((todo) => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      const today = new Date();
      return (
        dueDate.getDate() === today.getDate() &&
        dueDate.getMonth() === today.getMonth() &&
        dueDate.getFullYear() === today.getFullYear()
      );
    })
    .sort((a, b) => {
      const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  const upcomingTodos = todos
    .filter((todo) => {
      if (!todo.dueDate) return false;
      const dueDate = new Date(todo.dueDate);
      const today = new Date();
      return dueDate > today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dueDate!);
      const dateB = new Date(b.dueDate!);
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  const completedToday = todayTodos.filter((t) => t.completed).length;
  const totalToday = todayTodos.length;
  const progressPercent = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header with date and progress */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {completedToday} / {totalToday} taches completees
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Aujourd'hui
          </h3>

          <div className="space-y-3">
            {todayTodos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Aucune tache pour aujourd'hui
              </p>
            ) : (
              todayTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="group bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTodo(todo.id)}
                      className="mt-1 flex-shrink-0"
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
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

                      {/* Subtasks */}
                      {todo.subtasks && todo.subtasks.length > 0 && (
                        <div className="mt-3 space-y-2 ml-2 border-l-2 border-gray-300 dark:border-gray-600 pl-3">
                          {todo.subtasks.map((subtask) => (
                            <div
                              key={subtask.id}
                              className="flex items-center gap-2"
                            >
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

                      <div className="flex items-center gap-2 mt-2">
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
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                            {todo.platform}
                          </span>
                        )}

                        {todo.dueDate && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {format(new Date(todo.dueDate), 'HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <ChevronRight className="w-5 h-5 text-purple-500" />
            A venir
          </h3>

          <div className="space-y-3">
            {upcomingTodos.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                Aucune tache a venir
              </p>
            ) : (
              upcomingTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                >
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">
                    {todo.title}
                  </h4>

                  <div className="flex items-center gap-2 flex-wrap">
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

                    {todo.dueDate && (
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {format(new Date(todo.dueDate), 'dd MMM, HH:mm', {
                          locale: fr,
                        })}
                      </span>
                    )}

                    {todo.platform && (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                        {todo.platform}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
