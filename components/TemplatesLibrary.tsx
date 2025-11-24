'use client';

import { useEffect, useState } from 'react';
import { Copy, Search, Filter, BookOpen, Check } from 'lucide-react';
import { postTemplates } from '@/lib/post-templates';

export default function TemplatesLibrary() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = Array.from(
    new Set(postTemplates.map((t) => t.category))
  ).sort();

  const filteredTemplates = postTemplates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-blue-500" />
              Bibliotheque de Templates
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {postTemplates.length} templates prets a l'emploi
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="all">Toutes les categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Aucun template trouve. Essayez une autre recherche.
            </p>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 card-hover flex flex-col"
            >
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white flex-1">
                    {template.title}
                  </h3>
                  <button
                    onClick={() => handleCopy(template.content, template.id)}
                    className={`p-2 rounded-lg transition-all ${
                      copiedId === template.id
                        ? 'bg-green-500 text-white'
                        : 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    }`}
                    title="Copier le template"
                  >
                    {copiedId === template.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 text-xs font-medium">
                  {template.category}
                </span>
              </div>

              {/* Content Preview */}
              <div className="flex-1 mb-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                    {template.content.length > 200
                      ? template.content.substring(0, 200) + '...'
                      : template.content}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="space-y-3">
                {/* Platforms */}
                <div className="flex flex-wrap gap-2">
                  {template.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-medium"
                    >
                      {platform}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Conseils d'utilisation</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-200">•</span>
            <span>
              Personnalisez chaque template avec vos propres exemples et donnees
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-200">•</span>
            <span>
              Adaptez le ton et le style selon votre audience et plateforme
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-200">•</span>
            <span>
              Ajoutez des emojis et formatage specifiques a chaque reseau social
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-200">•</span>
            <span>
              Testez differentes versions pour optimiser l'engagement
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
