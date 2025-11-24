'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash2, Edit2, X, Save, Send, Calendar, FileText, Sparkles } from 'lucide-react';
import { Post, Platform } from '@/types';
import { getPosts, addPost, updatePost, deletePost } from '@/lib/storage';

export default function ContentManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    platform: 'LINKEDIN' as Platform,
    content: '',
    scheduledDate: '',
    scheduledTime: '',
  });

  useEffect(() => {
    setMounted(true);
    loadPosts();
  }, []);

  const loadPosts = () => {
    const loadedPosts = getPosts();
    console.log('📝 Loaded posts:', loadedPosts);
    setPosts(loadedPosts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📝 Submitting post:', formData, 'editingId:', editingId);

    const postData = {
      platform: formData.platform,
      content: formData.content,
      scheduledFor: formData.scheduledDate
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime || '12:00'}`)
        : undefined,
      published: false,
    };

    console.log('📝 Post data:', postData);

    if (editingId) {
      const updated = updatePost(editingId, postData);
      console.log('✏️ Updated post:', updated);
      setEditingId(null);
    } else {
      const created = addPost(postData);
      console.log('➕ Created post:', created);
    }

    resetForm();
    loadPosts();
  };

  const handleEdit = (post: Post) => {
    console.log('✏️ Editing post:', post);
    setEditingId(post.id);
    setFormData({
      platform: post.platform,
      content: post.content,
      scheduledDate: post.scheduledFor
        ? format(new Date(post.scheduledFor), 'yyyy-MM-dd')
        : '',
      scheduledTime: post.scheduledFor
        ? format(new Date(post.scheduledFor), 'HH:mm')
        : '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      console.log('🗑️ Deleting post:', id);
      deletePost(id);
      loadPosts();
    }
  };

  const handlePublish = (id: string) => {
    console.log('📤 Publishing post:', id);
    updatePost(id, { published: true });
    loadPosts();
  };

  const resetForm = () => {
    console.log('🔄 Resetting form');
    setFormData({
      platform: 'LINKEDIN',
      content: '',
      scheduledDate: '',
      scheduledTime: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  if (!mounted) return null;

  const scheduledPosts = posts.filter((p) => !p.published && p.scheduledFor);
  const draftPosts = posts.filter((p) => !p.published && !p.scheduledFor);
  const publishedPosts = posts.filter((p) => p.published);

  const platformEmojis: Record<Platform, string> = {
    LINKEDIN: '💼',
    TWITTER: '🐦',
    INSTAGRAM: '📸',
    FACEBOOK: '👥',
    TIKTOK: '🎵',
    YOUTUBE: '🎥',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-green-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-green-900/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent mb-2">
                Gestion du Contenu
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{scheduledPosts.length}</span> planifié{scheduledPosts.length > 1 ? 's' : ''}
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-600 dark:text-gray-400">{draftPosts.length}</span> brouillon{draftPosts.length > 1 ? 's' : ''}
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-green-600 dark:text-green-400">{publishedPosts.length}</span> publié{publishedPosts.length > 1 ? 's' : ''}
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
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium whitespace-nowrap"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? 'Annuler' : 'Nouveau Post'}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 animate-slide-up">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent mb-6">
              {editingId ? '✏️ Modifier le post' : '✨ Nouveau post'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Plateforme *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => {
                    console.log('🔄 Platform changed:', e.target.value);
                    setFormData({
                      ...formData,
                      platform: e.target.value as Platform,
                    });
                  }}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base"
                >
                  <option value="LINKEDIN">{platformEmojis.LINKEDIN} LinkedIn</option>
                  <option value="TWITTER">{platformEmojis.TWITTER} Twitter</option>
                  <option value="INSTAGRAM">{platformEmojis.INSTAGRAM} Instagram</option>
                  <option value="FACEBOOK">{platformEmojis.FACEBOOK} Facebook</option>
                  <option value="TIKTOK">{platformEmojis.TIKTOK} TikTok</option>
                  <option value="YOUTUBE">{platformEmojis.YOUTUBE} YouTube</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Contenu *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => {
                    console.log('🔄 Content changed, length:', e.target.value.length);
                    setFormData({ ...formData, content: e.target.value });
                  }}
                  rows={8}
                  className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
                  placeholder="Écrivez votre contenu ici..."
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {formData.content.length} caractère{formData.content.length > 1 ? 's' : ''}
                  </p>
                  {formData.content.length > 0 && (
                    <p className="text-xs text-gray-400">
                      {formData.platform === 'TWITTER' && formData.content.length > 280 && (
                        <span className="text-red-500 font-semibold">⚠️ Twitter limite: 280 caractères</span>
                      )}
                      {formData.platform === 'LINKEDIN' && formData.content.length > 3000 && (
                        <span className="text-orange-500 font-semibold">⚠️ LinkedIn optimal: 3000 caractères</span>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    📅 Date de publication
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => {
                      console.log('🔄 Date changed:', e.target.value);
                      setFormData({ ...formData, scheduledDate: e.target.value });
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    ⏰ Heure
                  </label>
                  <input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => {
                      console.log('🔄 Time changed:', e.target.value);
                      setFormData({ ...formData, scheduledTime: e.target.value });
                    }}
                    className="w-full px-4 py-3.5 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'Mettre à jour' : 'Enregistrer'}
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

        {/* Scheduled Posts */}
        {scheduledPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-500" />
              Posts planifiés
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border-2 border-blue-200 dark:border-blue-800 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold shadow-md">
                      {platformEmojis[post.platform]} {post.platform}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-110"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePublish(post.id)}
                        className="p-2.5 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-xl transition-all hover:scale-110"
                        title="Publier maintenant"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap text-sm leading-relaxed">
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 ? '...' : ''}
                  </p>

                  {post.scheduledFor && (
                    <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-xl font-medium">
                      <Calendar className="w-4 h-4" />
                      {format(
                        new Date(post.scheduledFor),
                        "dd MMM yyyy 'à' HH:mm",
                        { locale: fr }
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Draft Posts */}
        {draftPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-gray-500" />
              Brouillons
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {draftPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-3 border-dashed border-gray-400 dark:border-gray-600"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-4 py-2 rounded-2xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-semibold">
                      {platformEmojis[post.platform]} {post.platform}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all hover:scale-110"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {post.content.substring(0, 150)}
                    {post.content.length > 150 ? '...' : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Published Posts */}
        {publishedPosts.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-green-500" />
              Posts publiés
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedPosts.slice(0, 9).map((post) => (
                <div
                  key={post.id}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-lg rounded-3xl shadow-lg border-2 border-green-200 dark:border-green-800 p-6 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-4 py-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow-md">
                      {platformEmojis[post.platform]} {post.platform}
                    </span>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all hover:scale-110"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap text-sm leading-relaxed">
                    {post.content.substring(0, 100)}
                    {post.content.length > 100 ? '...' : ''}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-2 rounded-xl font-medium">
                    <Sparkles className="w-4 h-4" />
                    Publié le {format(new Date(post.createdAt), 'dd MMM yyyy', {
                      locale: fr,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-12 md:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                Aucun post pour le moment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Commencez à créer du contenu pour vos réseaux sociaux !
              </p>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                <Plus className="w-5 h-5" />
                Créer mon premier post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
