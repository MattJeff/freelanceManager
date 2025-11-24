'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash2, Edit2, X, Save, Target, TrendingUp } from 'lucide-react';
import { Goal } from '@/types';
import { getGoals, addGoal, updateGoal, deleteGoal } from '@/lib/storage';
import { initialGoals } from '@/lib/initial-data';

export default function GoalsTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    progress: 0,
  });

  useEffect(() => {
    setMounted(true);
    loadGoals();
  }, []);

  const loadGoals = () => {
    const storedGoals = getGoals();
    if (storedGoals.length === 0) {
      initialGoals.forEach((goal) => addGoal(goal));
      setGoals(getGoals());
    } else {
      setGoals(storedGoals);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goalData = {
      title: formData.title,
      description: formData.description || undefined,
      targetDate: new Date(formData.targetDate),
      progress: formData.progress,
      completed: formData.progress >= 100,
    };

    if (editingId) {
      updateGoal(editingId, goalData);
      setEditingId(null);
    } else {
      addGoal(goalData);
    }

    resetForm();
    loadGoals();
  };

  const handleEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      targetDate: format(new Date(goal.targetDate), 'yyyy-MM-dd'),
      progress: goal.progress,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Etes-vous sur de vouloir supprimer cet objectif?')) {
      deleteGoal(id);
      loadGoals();
    }
  };

  const handleProgressChange = (id: string, progress: number) => {
    updateGoal(id, { progress, completed: progress >= 100 });
    loadGoals();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetDate: '',
      progress: 0,
    });
    setShowForm(false);
  };

  if (!mounted) return null;

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Suivi des Objectifs
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {activeGoals.length} objectif(s) en cours, {completedGoals.length}{' '}
              complete(s)
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
            {showForm ? 'Annuler' : 'Nouvel Objectif'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingId ? 'Modifier l\'objectif' : 'Nouvel objectif'}
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: Atteindre 10K followers LinkedIn..."
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
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Details de l'objectif..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date cible *
                </label>
                <input
                  type="date"
                  required
                  value={formData.targetDate}
                  onChange={(e) =>
                    setFormData({ ...formData, targetDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Progression ({formData.progress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({ ...formData, progress: parseInt(e.target.value) })
                  }
                  className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
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

      {/* Active Goals */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          Objectifs actifs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeGoals.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Aucun objectif actif. Cliquez sur "Nouvel Objectif" pour commencer!
              </p>
            </div>
          ) : (
            activeGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white flex-1">
                    {goal.title}
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {goal.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {goal.description}
                  </p>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progression
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {goal.progress}%
                    </span>
                  </div>

                  <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) =>
                      handleProgressChange(goal.id, parseInt(e.target.value))
                    }
                    className="w-full mt-2 h-2 bg-transparent rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Echeance:{' '}
                  {format(new Date(goal.targetDate), 'dd MMMM yyyy', {
                    locale: fr,
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Objectifs completes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedGoals.map((goal) => (
              <div
                key={goal.id}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-6 border-2 border-green-200 dark:border-green-800"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-lg font-bold text-gray-800 dark:text-white flex-1">
                    {goal.title}
                  </h4>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {goal.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {goal.description}
                  </p>
                )}

                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Complete!
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
