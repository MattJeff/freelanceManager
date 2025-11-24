'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash2, Edit2, X, Save, Mail, Phone, Building2 } from 'lucide-react';
import { Contact, ContactStatus, Platform } from '@/types';
import {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
} from '@/lib/storage';

export default function ContactsManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    platform: 'LINKEDIN' as Platform,
    status: 'ACTIVE' as ContactStatus,
    notes: '',
  });

  useEffect(() => {
    setMounted(true);
    loadContacts();
  }, []);

  const loadContacts = () => {
    setContacts(getContacts());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactData = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      company: formData.company || undefined,
      platform: formData.platform,
      status: formData.status,
      notes: formData.notes || undefined,
      lastContact: new Date(),
    };

    if (editingId) {
      updateContact(editingId, contactData);
      setEditingId(null);
    } else {
      addContact(contactData);
    }

    resetForm();
    loadContacts();
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      platform: contact.platform,
      status: contact.status,
      notes: contact.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Etes-vous sur de vouloir supprimer ce contact?')) {
      deleteContact(id);
      loadContacts();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      platform: 'LINKEDIN',
      status: 'ACTIVE',
      notes: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Gestion des Contacts
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {contacts.length} contact(s) au total
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
            {showForm ? 'Annuler' : 'Nouveau Contact'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 animate-slide-up">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            {editingId ? 'Modifier le contact' : 'Nouveau contact'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="jean@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telephone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entreprise
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tech Corp"
                />
              </div>

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
                  <option value="MALT">Malt</option>
                  <option value="UPWORK">Upwork</option>
                  <option value="FIVERR">Fiverr</option>
                  <option value="FREELANCER">Freelancer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as ContactStatus,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="ACTIVE">Actif</option>
                  <option value="PENDING">En attente</option>
                  <option value="CLOSED">Cloture</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Notes sur le contact..."
              />
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

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Aucun contact. Cliquez sur "Nouveau Contact" pour commencer!
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 card-hover"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                    {contact.name}
                  </h3>
                  {contact.company && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {contact.company}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {contact.email && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </p>
                )}
                {contact.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {contact.phone}
                  </p>
                )}
              </div>

              {contact.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic">
                  "{contact.notes}"
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                  {contact.platform}
                </span>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    contact.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : contact.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}
                >
                  {contact.status}
                </span>
              </div>

              {contact.lastContact && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  Dernier contact:{' '}
                  {format(new Date(contact.lastContact), 'dd MMM yyyy', {
                    locale: fr,
                  })}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
