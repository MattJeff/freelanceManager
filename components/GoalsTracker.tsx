'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash2, Edit2, X, Save, Target, TrendingUp, Award, PlusCircle, MinusCircle } from 'lucide-react';
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
    category: '',
    currentValue: 0,
    targetValue: 100,
    unit: 'unités',
    targetDate: '',
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
      category: formData.category || undefined,
      currentValue: formData.currentValue,
      targetValue: formData.targetValue,
      unit: formData.unit,
      targetDate: new Date(formData.targetDate),
      completed: formData.currentValue >= formData.targetValue,
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
      category: goal.category || '',
      currentValue: goal.currentValue,
      targetValue: goal.targetValue,
      unit: goal.unit,
      targetDate: format(new Date(goal.targetDate), 'yyyy-MM-dd'),
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif?')) {
      deleteGoal(id);
      loadGoals();
    }
  };

  const handleValueChange = (id: string, currentValue: number) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      updateGoal(id, {
        currentValue,
        completed: currentValue >= goal.targetValue
      });
      loadGoals();
    }
  };

  const incrementValue = (id: string, amount: number) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      const newValue = Math.max(0, goal.currentValue + amount);
      handleValueChange(id, newValue);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      currentValue: 0,
      targetValue: 100,
      unit: 'unités',
      targetDate: '',
    });
    setShowForm(false);
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  };

  if (!mounted) return null;

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  // Group goals by category
  const goalsByCategory = activeGoals.reduce((acc, goal) => {
    const cat = goal.category || 'AUTRE';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(goal);
    return acc;
  }, {} as Record<string, Goal[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Target className="w-7 h-7 text-blue-500" />
              Suivi des Objectifs
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {activeGoals.length} objectif(s) en cours • {completedGoals.length}{' '}
              complété(s)
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
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
                  placeholder="Ex: Atteindre 1000 followers LinkedIn"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Détails de l'objectif..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Autre</option>
                  <option value="LINKEDIN">LinkedIn</option>
                  <option value="TIKTOK">TikTok</option>
                  <option value="INSTAGRAM">Instagram</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="YOUTUBE">YouTube</option>
                  <option value="BUSINESS">Business</option>
                  <option value="CONTENT">Contenu</option>
                </select>
              </div>

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
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valeur actuelle *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.currentValue}
                  onChange={(e) =>
                    setFormData({ ...formData, currentValue: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valeur cible *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.targetValue}
                  onChange={(e) =>
                    setFormData({ ...formData, targetValue: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="1000"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unité *
                </label>
                <input
                  type="text"
                  required
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="followers, clients, posts, €..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ex: "followers", "connexions", "clients", "posts", "€", "%"
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Mettre à jour' : 'Ajouter'}
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

      {/* Active Goals by Category */}
      {Object.keys(goalsByCategory).length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Aucun objectif actif. Cliquez sur "Nouvel Objectif" pour commencer!
          </p>
        </div>
      ) : (
        Object.entries(goalsByCategory).map(([category, goals]) => (
          <div key={category}>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" />
              {category}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {goals.map((goal) => {
                const progress = calculateProgress(goal.currentValue, goal.targetValue);

                return (
                  <div
                    key={goal.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                          {goal.title}
                        </h4>
                        {goal.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(goal)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Progression
                        </span>
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {progress}%
                        </span>
                      </div>
                      <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Current / Target Values */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Actuel
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => incrementValue(goal.id, -1)}
                              className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all"
                              title="- 1"
                            >
                              <MinusCircle className="w-5 h-5" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={goal.currentValue}
                              onChange={(e) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                handleValueChange(goal.id, val);
                              }}
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <button
                              onClick={() => incrementValue(goal.id, 1)}
                              className="p-1 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-all"
                              title="+ 1"
                            >
                              <PlusCircle className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-center px-4">
                          <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">/</span>
                        </div>

                        <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                            Objectif
                          </label>
                          <div className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-center font-bold">
                            {goal.targetValue}
                          </div>
                        </div>
                      </div>

                      <div className="text-center mt-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {goal.unit}
                        </span>
                      </div>

                      {/* Quick increment buttons */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => incrementValue(goal.id, 10)}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => incrementValue(goal.id, 100)}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
                        >
                          +100
                        </button>
                        <button
                          onClick={() => incrementValue(goal.id, 1000)}
                          className="flex-1 px-3 py-2 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                        >
                          +1000
                        </button>
                      </div>
                    </div>

                    {/* Target Date */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Échéance
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {format(new Date(goal.targetDate), 'dd MMM yyyy', {
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Objectifs complétés ({completedGoals.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {goal.currentValue}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    / {goal.targetValue} {goal.unit}
                  </span>
                </div>

                <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Complété!
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
