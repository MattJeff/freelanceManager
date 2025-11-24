'use client';

import { useState } from 'react';
import {
  Calendar,
  CheckSquare,
  Users,
  Target,
  // BarChart3, // Analytics supprimé
  FileText,
  BookOpen,
  Briefcase,
} from 'lucide-react';
import DailyPlanner from '@/components/DailyPlanner';
import TodoManager from '@/components/TodoManager';
import ContactsManager from '@/components/ContactsManager';
import GoalsTracker from '@/components/GoalsTracker';
// import AnalyticsDashboard from '@/components/AnalyticsDashboard'; // Analytics supprimé
import ContentManager from '@/components/ContentManager';
import TemplatesLibrary from '@/components/TemplatesLibrary';
import FreelancePlatforms from '@/components/FreelancePlatforms';

type Tab =
  | 'planner'
  | 'todos'
  | 'contacts'
  | 'goals'
  // | 'analytics' // Analytics supprimé
  | 'content'
  | 'templates'
  | 'platforms';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('planner');

  const tabs = [
    { id: 'planner' as Tab, name: 'Planning', icon: Calendar },
    { id: 'todos' as Tab, name: 'Taches', icon: CheckSquare },
    { id: 'contacts' as Tab, name: 'Contacts', icon: Users },
    { id: 'goals' as Tab, name: 'Objectifs', icon: Target },
    // { id: 'analytics' as Tab, name: 'Analytics', icon: BarChart3 }, // Analytics supprimé
    { id: 'content' as Tab, name: 'Contenu', icon: FileText },
    { id: 'templates' as Tab, name: 'Templates', icon: BookOpen },
    { id: 'platforms' as Tab, name: 'Plateformes', icon: Briefcase },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'planner':
        return <DailyPlanner />;
      case 'todos':
        return <TodoManager />;
      case 'contacts':
        return <ContactsManager />;
      case 'goals':
        return <GoalsTracker />;
      // case 'analytics': // Analytics supprimé
      //   return <AnalyticsDashboard />;
      case 'content':
        return <ContentManager />;
      case 'templates':
        return <TemplatesLibrary />;
      case 'platforms':
        return <FreelancePlatforms />;
      default:
        return <DailyPlanner />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-600 to-orange-600 bg-clip-text text-transparent">
              Freelance Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Gerez votre marketing freelance sur les reseaux sociaux
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-br from-orange-500 to-yellow-500 text-white shadow-lg scale-105'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="animate-fade-in">{renderContent()}</main>
      </div>
    </div>
  );
}
