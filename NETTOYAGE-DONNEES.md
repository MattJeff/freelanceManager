# 🧹 Nettoyage des Données

## Comment supprimer les données de test

### Méthode 1: Utiliser l'Interface Web (Recommandé)

1. **Ouvrir le fichier HTML** : `clear-data.html`
   - Double-cliquer sur le fichier
   - OU ouvrir dans votre navigateur

2. **Visualiser les données actuelles**
   - Le compteur affiche le nombre d'items par catégorie
   - 📝 Tâches
   - 👤 Contacts
   - 🎯 Objectifs
   - 📝 Posts
   - 📈 Analytics

3. **Supprimer toutes les données**
   - Cliquer sur "🗑️ Supprimer Toutes les Données"
   - Confirmer l'action
   - Les compteurs passent à 0

4. **Recharger l'application**
   - Aller sur http://localhost:3000
   - L'application est maintenant vide et prête à l'emploi

### Méthode 2: Via la Console du Navigateur

1. **Ouvrir l'application** : http://localhost:3000
2. **Ouvrir la console** (F12)
3. **Copier-coller ce code** :

```javascript
// Supprimer toutes les données
localStorage.removeItem('freelance_todos');
localStorage.removeItem('freelance_contacts');
localStorage.removeItem('freelance_goals');
localStorage.removeItem('freelance_posts');
localStorage.removeItem('freelance_analytics');
localStorage.removeItem('freelance_platforms');

console.log('✅ Toutes les données ont été supprimées !');

// Recharger la page
location.reload();
```

### Méthode 3: Supprimer une catégorie spécifique

Dans la console du navigateur :

```javascript
// Supprimer uniquement les todos
localStorage.removeItem('freelance_todos');

// Supprimer uniquement les contacts
localStorage.removeItem('freelance_contacts');

// Supprimer uniquement les objectifs
localStorage.removeItem('freelance_goals');

// Supprimer uniquement les posts
localStorage.removeItem('freelance_posts');

// Recharger la page
location.reload();
```

## 📊 Vérifier les Données Actuelles

Dans la console du navigateur :

```javascript
// Voir tous les todos
const todos = JSON.parse(localStorage.getItem('freelance_todos') || '[]');
console.log('📝 Todos:', todos.length, todos);

// Voir tous les contacts
const contacts = JSON.parse(localStorage.getItem('freelance_contacts') || '[]');
console.log('👤 Contacts:', contacts.length, contacts);

// Voir tous les objectifs
const goals = JSON.parse(localStorage.getItem('freelance_goals') || '[]');
console.log('🎯 Goals:', goals.length, goals);

// Voir tous les posts
const posts = JSON.parse(localStorage.getItem('freelance_posts') || '[]');
console.log('📝 Posts:', posts.length, posts);
```

## ⚠️ Important

- **Aucune confirmation supplémentaire** : Les données sont supprimées immédiatement
- **Action irréversible** : Impossible de récupérer les données après suppression
- **localStorage** : Les données sont stockées localement dans votre navigateur
- **Par navigateur** : Si vous utilisez plusieurs navigateurs, nettoyez chacun séparément

## 🎯 Analytics Supprimé

L'onglet Analytics a été complètement supprimé de l'application :
- ✅ Onglet retiré de la navigation
- ✅ Import commenté dans `app/page.tsx`
- ✅ Fonctions commentées dans `lib/storage.ts`
- ✅ Grid navigation ajusté (8 → 7 colonnes)

L'application fonctionne maintenant avec 7 onglets :
1. Planning
2. Tâches
3. Contacts
4. Objectifs
5. Contenu
6. Templates
7. Plateformes

---

**Besoin d'aide ?** Ouvrez la console (F12) et cherchez les logs avec emoji 📝 [STORAGE]
