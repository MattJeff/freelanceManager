'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash2, Edit2, X, Save, Send, Calendar } from 'lucide-react';
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
    setPosts(getPosts());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      platform: formData.platform,
      content: formData.content,
      scheduledFor: formData.scheduledDate
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime || '12:00'}`)
        : undefined,
      published: false,
    };

    if (editingId) {
      updatePost(editingId, postData);
      setEditingId(null);
    } else {
      addPost(postData);
    }

    resetForm();
    loadPosts();
  };

  const handleEdit = (post: Post) => {
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
    if (confirm('Etes-vous sur de vouloir supprimer ce post?')) {
      deletePost(id);
      loadPosts();
    }
  };

  const handlePublish = (id: string) => {
    updatePost(id, { published: true });
    loadPosts();
  };

  const resetForm = () => {
    setFormData({
      platform: 'LINKEDIN',
      content: '',
      scheduledDate: '',
      scheduledTime: '',
    });
    setShowForm(false);
  };

  if (!mounted) return null;

  const scheduledPosts = posts.filter((p) => !p.published && p.scheduledFor);
  const draftPosts = posts.filter((p) => !p.published && !p.scheduledFor);
  const publishedPosts = posts.filter((p) => p.published);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Gestion du Contenu
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {scheduledPosts.length} planifie(s), {draftPosts.length} brouillon(s),{' '}
              {publishedPosts.length} publie(s)
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
            {showForm ? 'Annuler' : 'Nouveau Post'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingId ? 'Modifier le post' : 'Nouveau post'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plateforme *
              </label>
              <select
                value={formData.platform}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    platform: e.target.value as Platform,
                  })
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
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={8}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                placeholder="Ecrivez votre contenu ici..."
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {formData.content.length} caracteres
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date de publication
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledDate: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Heure
                </label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) =>
                    setFormData({ ...formData, scheduledTime: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Mettre a jour' : 'Enregistrer'}
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

      {/* Scheduled Posts */}
      {scheduledPosts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Posts planifies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scheduledPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-sm font-medium">
                    {post.platform}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePublish(post.id)}
                      className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                  {post.content.substring(0, 150)}
                  {post.content.length > 150 ? '...' : ''}
                </p>

                {post.scheduledFor && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Planifie pour:{' '}
                    {format(
                      new Date(post.scheduledFor),
                      'dd MMM yyyy, HH:mm',
                      { locale: fr }
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Draft Posts */}
      {draftPosts.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Brouillons
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {draftPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-2 border-dashed border-gray-300 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 text-sm font-medium">
                    {post.platform}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
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
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Posts publies
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedPosts.slice(0, 6).map((post) => (
              <div
                key={post.id}
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium">
                    {post.platform}
                  </span>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                  {post.content.substring(0, 100)}
                  {post.content.length > 100 ? '...' : ''}
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Publie le:{' '}
                  {format(new Date(post.createdAt), 'dd MMM yyyy', {
                    locale: fr,
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Aucun post. Cliquez sur "Nouveau Post" pour commencer!
          </p>
        </div>
      )}
    </div>
  );
}
