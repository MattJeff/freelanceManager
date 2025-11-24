'use client';

import { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { Platform } from '@/types';

export default function AnalyticsDashboard() {
  const [mounted, setMounted] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | 'ALL'>(
    'ALL'
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock analytics data
  const stats = {
    totalFollowers: 15234,
    totalEngagement: 8542,
    totalViews: 125890,
    growthRate: 12.5,
  };

  const platformStats = [
    {
      platform: 'LINKEDIN' as Platform,
      followers: 5420,
      engagement: 2340,
      posts: 45,
      growth: 15.2,
    },
    {
      platform: 'INSTAGRAM' as Platform,
      followers: 3890,
      engagement: 3120,
      posts: 67,
      growth: 8.7,
    },
    {
      platform: 'TWITTER' as Platform,
      followers: 2145,
      engagement: 1234,
      posts: 89,
      growth: 5.3,
    },
    {
      platform: 'TIKTOK' as Platform,
      followers: 1890,
      engagement: 980,
      posts: 23,
      growth: 22.1,
    },
    {
      platform: 'YOUTUBE' as Platform,
      followers: 1234,
      engagement: 567,
      posts: 12,
      growth: 10.5,
    },
    {
      platform: 'FACEBOOK' as Platform,
      followers: 655,
      engagement: 301,
      posts: 34,
      growth: 3.2,
    },
  ];

  if (!mounted) return null;

  const filteredStats =
    selectedPlatform === 'ALL'
      ? platformStats
      : platformStats.filter((s) => s.platform === selectedPlatform);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Tableau de Bord Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vue d'ensemble de vos performances
            </p>
          </div>

          <select
            value={selectedPlatform}
            onChange={(e) =>
              setSelectedPlatform(e.target.value as Platform | 'ALL')
            }
            className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="ALL">Toutes les plateformes</option>
            <option value="LINKEDIN">LinkedIn</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="TWITTER">Twitter</option>
            <option value="TIKTOK">TikTok</option>
            <option value="YOUTUBE">YouTube</option>
            <option value="FACEBOOK">Facebook</option>
          </select>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">
            {stats.totalFollowers.toLocaleString()}
          </p>
          <p className="text-blue-100 text-sm">Followers</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">
            {stats.totalEngagement.toLocaleString()}
          </p>
          <p className="text-orange-100 text-sm">Engagement</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              Total
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">
            {stats.totalViews.toLocaleString()}
          </p>
          <p className="text-green-100 text-sm">Vues</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">
              Croissance
            </span>
          </div>
          <p className="text-3xl font-bold mb-1">+{stats.growthRate}%</p>
          <p className="text-orange-100 text-sm">Ce mois</p>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Performance par plateforme
        </h3>

        <div className="space-y-4">
          {filteredStats.map((stat) => (
            <div
              key={stat.platform}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-800 dark:text-white">
                  {stat.platform}
                </h4>
                <span
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                    stat.growth > 10
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : stat.growth > 5
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  +{stat.growth}%
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Followers
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {stat.followers.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Engagement
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {stat.engagement.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Posts
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {stat.posts}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Taux eng.
                  </p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">
                    {((stat.engagement / stat.followers) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Progress bar for engagement rate */}
              <div className="mt-4">
                <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        (stat.engagement / stat.followers) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best performing content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-orange-500" />
          Meilleurs contenus
        </h3>

        <div className="space-y-3">
          {[
            {
              title: 'Post LinkedIn sur freelancing tips',
              platform: 'LINKEDIN',
              engagement: 1245,
              views: 8934,
            },
            {
              title: 'Reel Instagram behind-the-scenes',
              platform: 'INSTAGRAM',
              engagement: 2341,
              views: 15234,
            },
            {
              title: 'Thread Twitter sur productivite',
              platform: 'TWITTER',
              engagement: 890,
              views: 5678,
            },
          ].map((post, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-800 dark:text-white mb-1">
                  {post.title}
                </h4>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                  {post.platform}
                </span>
              </div>

              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {post.engagement}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Engage.</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {post.views}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Vues</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
