'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Plus,
  Trash2,
  Mail,
  Phone,
  Building2,
  Tag,
  X,
  Users,
} from 'lucide-react';
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
    const loadedContacts = getContacts();
    console.log('Loaded contacts:', loadedContacts);
    setContacts(loadedContacts);
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

    console.log('Submitting contact:', contactData, 'editingId:', editingId);

    if (editingId) {
      const updated = updateContact(editingId, contactData);
      console.log('Updated:', updated);
    } else {
      const created = addContact(contactData);
      console.log('Created:', created);
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
    if (confirm('Supprimer ce contact?')) {
      const success = deleteContact(id);
      console.log('Delete result:', success);
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

  const statusColors = {
    ACTIVE: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
    PENDING: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300',
    CLOSED: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-orange-900/20 dark:to-yellow-900/20 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 dark:from-orange-400 dark:to-yellow-400 bg-clip-text text-transparent mb-2">
                Mes Contacts
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Users className="w-4 h-4" />
                {contacts.length} contact{contacts.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {showForm ? (
                <>
                  <X className="w-5 h-5" />
                  Annuler
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Nouveau Contact
                </>
              )}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              {editingId ? 'Modifier le contact' : 'Nouveau contact'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                  placeholder="Jean Dupont"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                    placeholder="jean@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                {/* Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Entreprise
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                    placeholder="Tech Corp"
                  />
                </div>

                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Tag className="w-4 h-4 inline mr-1" />
                    Plateforme *
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value as Platform })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                  >
                    <option value="LINKEDIN">LinkedIn</option>
                    <option value="TWITTER">Twitter</option>
                    <option value="INSTAGRAM">Instagram</option>
                    <option value="FACEBOOK">Facebook</option>
                    <option value="MALT">Malt</option>
                    <option value="UPWORK">Upwork</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statut
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as ContactStatus })
                    }
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                  >
                    <option value="ACTIVE">✅ Actif</option>
                    <option value="PENDING">⏳ En attente</option>
                    <option value="CLOSED">🔒 Clôturé</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all resize-none"
                  placeholder="Informations supplémentaires..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {editingId ? 'Mettre à jour' : 'Créer le contact'}
              </button>
            </form>
          </div>
        )}

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.length === 0 ? (
            <div className="col-span-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                <Users className="w-10 h-10 text-orange-500 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Aucun contact
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Commencez par ajouter votre premier contact
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Créer un contact
              </button>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg border-2 ${
                  statusColors[contact.status]
                } p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                      {contact.name}
                    </h3>
                    {contact.company && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {contact.company}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="p-2 hover:bg-orange-50 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl transition-all"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {contact.email && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 truncate">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors truncate"
                      >
                        {contact.email}
                      </a>
                    </p>
                  )}
                  {contact.phone && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </p>
                  )}
                </div>

                {contact.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 italic line-clamp-2">
                    "{contact.notes}"
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-medium">
                    <Tag className="w-3 h-3" />
                    {contact.platform}
                  </span>

                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      contact.status === 'ACTIVE'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : contact.status === 'PENDING'
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {contact.status === 'ACTIVE'
                      ? '✅ Actif'
                      : contact.status === 'PENDING'
                      ? '⏳ Attente'
                      : '🔒 Clôturé'}
                  </span>
                </div>

                {contact.lastContact && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                    Dernier contact: {format(new Date(contact.lastContact), 'dd MMM yyyy', { locale: fr })}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
