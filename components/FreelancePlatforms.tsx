'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Share2,
} from 'lucide-react';
import { freelancePlatforms } from '@/lib/data/freelance-platforms';
import {
  getFreelancePlatformAccounts,
  updatePlatformAccount,
} from '@/lib/storage';

export default function FreelancePlatforms() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'freelance' | 'social'
  >('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [platformAccounts, setPlatformAccounts] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setMounted(true);
    setPlatformAccounts(getFreelancePlatformAccounts());
  }, []);

  const handleToggleAccount = (platformId: string) => {
    const newValue = !platformAccounts[platformId];
    updatePlatformAccount(platformId, newValue);
    setPlatformAccounts({ ...platformAccounts, [platformId]: newValue });
  };

  const filteredPlatforms = freelancePlatforms.filter((platform) => {
    const matchesSearch =
      platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      platform.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || platform.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Séparer les plateformes en "Fait" et "Pas Fait"
  const notConfiguredPlatforms = filteredPlatforms.filter(
    (platform) => !platformAccounts[platform.id]
  );
  const configuredPlatforms = filteredPlatforms.filter(
    (platform) => platformAccounts[platform.id]
  );

  const completedCount = Object.values(platformAccounts).filter(Boolean).length;

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Briefcase className="w-7 h-7 text-orange-500" />
              Plateformes Freelance
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {completedCount} / {freelancePlatforms.length} comptes configures
            </p>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round((completedCount / freelancePlatforms.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progression
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full transition-all duration-500"
            style={{
              width: `${(completedCount / freelancePlatforms.length) * 100}%`,
            }}
          />
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une plateforme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value as 'all' | 'freelance' | 'social')
              }
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="all">Toutes les categories</option>
              <option value="freelance">Plateformes Freelance</option>
              <option value="social">Reseaux Sociaux</option>
            </select>
          </div>
        </div>
      </div>

      {/* Platforms List */}
      {filteredPlatforms.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Aucune plateforme trouvee. Essayez une autre recherche.
          </p>
        </div>
      ) : (
        <>
          {/* Section: À configurer */}
          {notConfiguredPlatforms.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Circle className="w-6 h-6 text-orange-500" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  À configurer
                </h3>
                <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm font-bold">
                  {notConfiguredPlatforms.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {notConfiguredPlatforms.map((platform) => {
            const isExpanded = expandedId === platform.id;
            const hasAccount = platformAccounts[platform.id] || false;

            return (
              <div
                key={platform.id}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                  hasAccount
                    ? 'border-2 border-green-500 dark:border-green-600'
                    : 'hover:shadow-xl'
                }`}
              >
                {/* Platform Header */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="text-5xl">{platform.logo}</div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                            {platform.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {platform.description}
                          </p>
                        </div>

                        <button
                          onClick={() => handleToggleAccount(platform.id)}
                          className="flex-shrink-0 ml-4"
                        >
                          {hasAccount ? (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                          ) : (
                            <Circle className="w-8 h-8 text-gray-400 hover:text-blue-500 transition-colors" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            platform.category === 'freelance'
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                          }`}
                        >
                          {platform.category === 'freelance'
                            ? 'Freelance'
                            : 'Social'}
                        </span>

                        <a
                          href={platform.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visiter
                        </a>
                      </div>

                      {/* Expand Button */}
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : platform.id)
                        }
                        className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            Masquer le guide
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            Voir le guide de configuration
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Setup Steps */}
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-blue-500" />
                          Etapes de configuration
                        </h4>
                        <ol className="space-y-2">
                          {platform.setupGuide.steps.map((step, index) => (
                            <li
                              key={index}
                              className="flex gap-3 text-sm text-gray-700 dark:text-gray-300"
                            >
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <Share2 className="w-5 h-5 text-orange-500" />
                          Conseils & Astuces
                        </h4>
                        <ul className="space-y-2">
                          {platform.setupGuide.tips.map((tip, index) => (
                            <li
                              key={index}
                              className="flex gap-3 text-sm text-gray-700 dark:text-gray-300"
                            >
                              <span className="text-orange-500 flex-shrink-0">
                                •
                              </span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 flex gap-3">
                      {!hasAccount && (
                        <button
                          onClick={() => handleToggleAccount(platform.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          Marquer comme configure
                        </button>
                      )}

                      <a
                        href={platform.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                      >
                        <ExternalLink className="w-5 h-5" />
                        Ouvrir {platform.name}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
              </div>
            </div>
          )}

          {/* Section: Configurées */}
          {configuredPlatforms.length > 0 && (
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Configurées
                </h3>
                <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold">
                  {configuredPlatforms.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {configuredPlatforms.map((platform) => {
                  const isExpanded = expandedId === platform.id;
                  const hasAccount = platformAccounts[platform.id] || false;

                  return (
                    <div
                      key={platform.id}
                      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                        hasAccount
                          ? 'border-2 border-green-500 dark:border-green-600'
                          : 'hover:shadow-xl'
                      }`}
                    >
                      {/* Platform Header */}
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Logo */}
                          <div className="text-5xl">{platform.logo}</div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                                  {platform.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {platform.description}
                                </p>
                              </div>

                              <button
                                onClick={() => handleToggleAccount(platform.id)}
                                className="flex-shrink-0 ml-4"
                              >
                                {hasAccount ? (
                                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                                ) : (
                                  <Circle className="w-8 h-8 text-gray-400 hover:text-blue-500 transition-colors" />
                                )}
                              </button>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  platform.category === 'freelance'
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                }`}
                              >
                                {platform.category === 'freelance'
                                  ? 'Freelance'
                                  : 'Social'}
                              </span>

                              <a
                                href={platform.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Visiter
                              </a>
                            </div>

                            {/* Expand Button */}
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : platform.id)
                              }
                              className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4" />
                                  Masquer le guide
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4" />
                                  Voir le guide de configuration
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-6 animate-slide-up">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Setup Steps */}
                            <div>
                              <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-orange-500" />
                                Etapes de configuration
                              </h4>
                              <ol className="space-y-2">
                                {platform.setupGuide.steps.map((step, index) => (
                                  <li
                                    key={index}
                                    className="flex gap-3 text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">
                                      {index + 1}
                                    </span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Tips */}
                            <div>
                              <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                                <Share2 className="w-5 h-5 text-orange-500" />
                                Conseils & Astuces
                              </h4>
                              <ul className="space-y-2">
                                {platform.setupGuide.tips.map((tip, index) => (
                                  <li
                                    key={index}
                                    className="flex gap-3 text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    <span className="text-orange-500 flex-shrink-0">
                                      •
                                    </span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="mt-6 flex gap-3">
                            {!hasAccount && (
                              <button
                                onClick={() => handleToggleAccount(platform.id)}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                                Marquer comme configure
                              </button>
                            )}

                            <a
                              href={platform.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                            >
                              <ExternalLink className="w-5 h-5" />
                              Ouvrir {platform.name}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Strategie Multi-Plateformes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-bold mb-2">Plateformes Freelance</h4>
            <p className="text-blue-100">
              Diversifiez vos sources de clients en etant present sur 3-5
              plateformes majeures. Priorisez Malt et Upwork pour debuter.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-2">Reseaux Sociaux</h4>
            <p className="text-blue-100">
              Choisissez 2-3 plateformes alignees avec votre audience. LinkedIn
              + Instagram sont essentiels pour le freelance marketing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
