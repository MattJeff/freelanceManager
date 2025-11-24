'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash2, Edit2, X, Save, Target, TrendingUp, Award, PlusCircle, MinusCircle, Zap, Trophy } from 'lucide-react';
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
    console.log('🎯 Loading goals...');
    const storedGoals = getGoals();
    console.log('🎯 Stored goals:', storedGoals);
    if (storedGoals.length === 0) {
      console.log('🎯 No goals found, adding initial goals');
      initialGoals.forEach((goal) => addGoal(goal));
      setGoals(getGoals());
    } else {
      setGoals(storedGoals);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎯 Submitting goal:', formData, 'editingId:', editingId);

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

    console.log('🎯 Goal data:', goalData);

    if (editingId) {
      const updated = updateGoal(editingId, goalData);
      console.log('✏️ Updated goal:', updated);
      setEditingId(null);
    } else {
      const created = addGoal(goalData);
      console.log('➕ Created goal:', created);
    }

    resetForm();
    loadGoals();
  };

  const handleEdit = (goal: Goal) => {
    console.log('✏️ Editing goal:', goal);
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
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      console.log('🗑️ Deleting goal:', id);
      deleteGoal(id);
      loadGoals();
    }
  };

  const handleValueChange = (id: string, currentValue: number) => {
    console.log('🔄 Changing value for goal:', id, 'to:', currentValue);
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
    console.log('➕ Incrementing goal:', id, 'by:', amount);
    const goal = goals.find(g => g.id === id);
    if (goal) {
      const newValue = Math.max(0, goal.currentValue + amount);
      handleValueChange(id, newValue);
    }
  };

  const resetForm = () => {
    console.log('🔄 Resetting form');
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
    setEditingId(null);
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

  const categoryEmojis: Record<string, string> = {
    LINKEDIN: '💼',
    TIKTOK: '🎵',
    INSTAGRAM: '📸',
    FACEBOOK: '👥',
    YOUTUBE: '🎥',
    BUSINESS: '💰',
    CONTENT: '📝',
    AUTRE: '🎯',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                <Target className="w-8 h-8 md:w-10 md:h-10 text-orange-600 dark:text-orange-400" />
                Suivi des Objectifs
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-orange-600 dark:text-orange-400">{activeGoals.length}</span> en cours
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-green-600 dark:text-green-400">{completedGoals.length}</span> complété{completedGoals.length > 1 ? 's' : ''}
                </span>
              </p>
            </div>
            <button
              onClick={() => {
                console.log('🔘 Toggle form - current state:', showForm);
                if (showForm) {
                  resetForm();
                } else {
                  setShowForm(true);
                  setEditingId(null);
                }
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium whitespace-nowrap"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? 'Annuler' : 'Nouvel Objectif'}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 animate-slide-up">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent mb-6">
              {editingId ? '✏️ Modifier l\'objectif' : '🎯 Nouvel objectif'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Titre *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => {
                      console.log('🔄 Title changed:', e.target.value);
                      setFormData({ ...formData, title: e.target.value });
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="Ex: Atteindre 1000 followers LinkedIn"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      console.log('🔄 Description changed');
                      setFormData({ ...formData, description: e.target.value });
                    }}
                    rows={2}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="Détails de l'objectif..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      console.log('🔄 Category changed:', e.target.value);
                      setFormData({ ...formData, category: e.target.value });
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  >
                    <option value="">🎯 Autre</option>
                    <option value="LINKEDIN">💼 LinkedIn</option>
                    <option value="TIKTOK">🎵 TikTok</option>
                    <option value="INSTAGRAM">📸 Instagram</option>
                    <option value="FACEBOOK">👥 Facebook</option>
                    <option value="YOUTUBE">🎥 YouTube</option>
                    <option value="BUSINESS">💰 Business</option>
                    <option value="CONTENT">📝 Contenu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    📅 Date cible *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.targetDate}
                    onChange={(e) => {
                      console.log('🔄 Target date changed:', e.target.value);
                      setFormData({ ...formData, targetDate: e.target.value });
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Valeur actuelle *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.currentValue}
                    onChange={(e) => {
                      console.log('🔄 Current value changed:', e.target.value);
                      setFormData({ ...formData, currentValue: parseInt(e.target.value) || 0 });
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Valeur cible *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.targetValue}
                    onChange={(e) => {
                      console.log('🔄 Target value changed:', e.target.value);
                      setFormData({ ...formData, targetValue: parseInt(e.target.value) || 1 });
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="1000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Unité *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => {
                      console.log('🔄 Unit changed:', e.target.value);
                      setFormData({ ...formData, unit: e.target.value });
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                    placeholder="followers, clients, posts, €..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Ex: "followers", "connexions", "clients", "posts", "€", "%"
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Goals by Category */}
        {Object.keys(goalsByCategory).length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 md:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                Aucun objectif actif
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Commencez à définir vos objectifs pour suivre vos progrès !
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Créer mon premier objectif
              </button>
            </div>
          </div>
        ) : (
          Object.entries(goalsByCategory).map(([category, categoryGoals]) => (
            <div key={category}>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-orange-500" />
                {categoryEmojis[category]} {category}
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {categoryGoals.map((goal) => {
                  const progress = calculateProgress(goal.currentValue, goal.targetValue);
                  const isNearCompletion = progress >= 75;

                  return (
                    <div
                      key={goal.id}
                      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border-2 border-orange-200 dark:border-orange-800 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
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
                            className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-110"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Progression
                          </span>
                          <span className={`text-sm font-bold ${isNearCompletion ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                            {progress}%
                          </span>
                        </div>
                        <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                              isNearCompletion
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-orange-500 to-yellow-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Current / Target Values */}
                      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-4 mb-4 border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                              Valeur actuelle
                            </label>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => incrementValue(goal.id, -1)}
                                className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110"
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
                                className="w-full px-3 py-2.5 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-bold focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                              />
                              <button
                                onClick={() => incrementValue(goal.id, 1)}
                                className="p-1.5 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all hover:scale-110"
                                title="+ 1"
                              >
                                <PlusCircle className="w-5 h-5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-center px-3">
                            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">/</span>
                          </div>

                          <div className="flex-1">
                            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                              Objectif
                            </label>
                            <div className="px-3 py-2.5 rounded-xl border-2 border-orange-300 dark:border-orange-700 bg-orange-100 dark:bg-orange-900/30 text-gray-900 dark:text-white text-center font-bold">
                              {goal.targetValue}
                            </div>
                          </div>
                        </div>

                        <div className="text-center mt-3">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-full">
                            {goal.unit}
                          </span>
                        </div>

                        {/* Quick increment buttons */}
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => incrementValue(goal.id, 10)}
                            className="flex-1 px-3 py-2.5 text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all hover:scale-105"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => incrementValue(goal.id, 100)}
                            className="flex-1 px-3 py-2.5 text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all hover:scale-105"
                          >
                            +100
                          </button>
                          <button
                            onClick={() => incrementValue(goal.id, 1000)}
                            className="flex-1 px-3 py-2.5 text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-xl hover:bg-green-200 dark:hover:bg-green-900/50 transition-all hover:scale-105"
                          >
                            +1000
                          </button>
                        </div>
                      </div>

                      {/* Target Date */}
                      <div className="flex items-center justify-between text-sm bg-gray-100 dark:bg-gray-700/50 rounded-xl px-4 py-2.5">
                        <span className="font-medium text-gray-600 dark:text-gray-400">
                          📅 Échéance
                        </span>
                        <span className="font-bold text-gray-800 dark:text-white">
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
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-green-500" />
              Objectifs complétés ({completedGoals.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-lg rounded-3xl shadow-lg p-6 border-2 border-green-200 dark:border-green-800 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-800 dark:text-white flex-1">
                      {goal.title}
                    </h4>
                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {goal.currentValue}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      / {goal.targetValue} {goal.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl text-sm font-bold shadow-md">
                    <Trophy className="w-4 h-4" />
                    100% Complété !
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
