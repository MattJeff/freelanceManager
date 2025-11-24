// Script de test pour vérifier tous les CRUD
// Exécuter dans la console du navigateur

console.log('🧪 === DÉBUT DES TESTS CRUD ===\n');

// Helper pour afficher les résultats
const logTest = (name, success, data) => {
  console.log(`${success ? '✅' : '❌'} ${name}`);
  if (data) console.log('   Data:', data);
};

// Test 1: TODOS
console.log('\n📝 === TEST TODOS ===');
try {
  // Créer un todo
  const testTodo = {
    title: 'Test Todo CRUD',
    description: 'Test de vérification',
    completed: false,
    priority: 'HIGH',
    dueDate: new Date(),
  };

  console.log('1. Ajout d\'un todo...');
  const addedTodo = window.addTodo ? window.addTodo(testTodo) : 'Fonction non disponible';
  logTest('addTodo', !!addedTodo, addedTodo);

  console.log('2. Récupération des todos...');
  const todos = window.getTodos ? window.getTodos() : [];
  logTest('getTodos', todos.length > 0, `${todos.length} todo(s) trouvé(s)`);

  if (addedTodo && addedTodo.id) {
    console.log('3. Ajout d\'une sous-tâche...');
    const withSubtask = window.addSubtaskToTodo ?
      window.addSubtaskToTodo(addedTodo.id, 'Sous-tâche de test') :
      'Fonction non disponible';
    logTest('addSubtaskToTodo', !!withSubtask, withSubtask);

    console.log('4. Toggle de la sous-tâche...');
    if (withSubtask && withSubtask.subtasks && withSubtask.subtasks[0]) {
      const toggled = window.toggleSubtask ?
        window.toggleSubtask(addedTodo.id, withSubtask.subtasks[0].id) :
        'Fonction non disponible';
      logTest('toggleSubtask', !!toggled, toggled);
    }

    console.log('5. Update du todo...');
    const updated = window.updateTodo ?
      window.updateTodo(addedTodo.id, { completed: true }) :
      'Fonction non disponible';
    logTest('updateTodo', !!updated, updated);

    console.log('6. Toggle du todo...');
    const toggledTodo = window.toggleTodo ?
      window.toggleTodo(addedTodo.id) :
      'Fonction non disponible';
    logTest('toggleTodo', !!toggledTodo, toggledTodo);
  }
} catch (error) {
  console.error('❌ Erreur dans les tests TODOS:', error);
}

// Test 2: CONTACTS
console.log('\n👤 === TEST CONTACTS ===');
try {
  const testContact = {
    name: 'Test Contact',
    email: 'test@example.com',
    phone: '+33612345678',
    company: 'Test Company',
    role: 'CLIENT',
    status: 'ACTIVE',
  };

  console.log('1. Ajout d\'un contact...');
  const addedContact = window.addContact ? window.addContact(testContact) : 'Fonction non disponible';
  logTest('addContact', !!addedContact, addedContact);

  console.log('2. Récupération des contacts...');
  const contacts = window.getContacts ? window.getContacts() : [];
  logTest('getContacts', contacts.length > 0, `${contacts.length} contact(s) trouvé(s)`);

  if (addedContact && addedContact.id) {
    console.log('3. Update du contact...');
    const updated = window.updateContact ?
      window.updateContact(addedContact.id, { status: 'LEAD' }) :
      'Fonction non disponible';
    logTest('updateContact', !!updated, updated);
  }
} catch (error) {
  console.error('❌ Erreur dans les tests CONTACTS:', error);
}

// Test 3: GOALS
console.log('\n🎯 === TEST GOALS ===');
try {
  const testGoal = {
    title: 'Test Goal',
    description: 'Test de vérification',
    category: 'REVENUE',
    targetValue: 1000,
    currentValue: 0,
    unit: '€',
    targetDate: new Date(),
  };

  console.log('1. Ajout d\'un objectif...');
  const addedGoal = window.addGoal ? window.addGoal(testGoal) : 'Fonction non disponible';
  logTest('addGoal', !!addedGoal, addedGoal);

  console.log('2. Récupération des objectifs...');
  const goals = window.getGoals ? window.getGoals() : [];
  logTest('getGoals', goals.length > 0, `${goals.length} objectif(s) trouvé(s)`);

  if (addedGoal && addedGoal.id) {
    console.log('3. Update de l\'objectif...');
    const updated = window.updateGoal ?
      window.updateGoal(addedGoal.id, { currentValue: 500 }) :
      'Fonction non disponible';
    logTest('updateGoal', !!updated, updated);
  }
} catch (error) {
  console.error('❌ Erreur dans les tests GOALS:', error);
}

// Test 4: POSTS
console.log('\n📝 === TEST POSTS ===');
try {
  const testPost = {
    content: 'Test Post CRUD',
    platform: 'LINKEDIN',
    status: 'DRAFT',
    scheduledFor: new Date(),
  };

  console.log('1. Ajout d\'un post...');
  const addedPost = window.addPost ? window.addPost(testPost) : 'Fonction non disponible';
  logTest('addPost', !!addedPost, addedPost);

  console.log('2. Récupération des posts...');
  const posts = window.getPosts ? window.getPosts() : [];
  logTest('getPosts', posts.length > 0, `${posts.length} post(s) trouvé(s)`);

  if (addedPost && addedPost.id) {
    console.log('3. Update du post...');
    const updated = window.updatePost ?
      window.updatePost(addedPost.id, { status: 'PUBLISHED' }) :
      'Fonction non disponible';
    logTest('updatePost', !!updated, updated);
  }
} catch (error) {
  console.error('❌ Erreur dans les tests POSTS:', error);
}

// Test 5: LOCALSTORAGE
console.log('\n💾 === TEST LOCALSTORAGE ===');
try {
  console.log('1. Vérification des clés localStorage...');
  const keys = [
    'freelance_todos',
    'freelance_contacts',
    'freelance_goals',
    'freelance_posts',
    'freelance_analytics',
    'freelance_platforms',
  ];

  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        logTest(`localStorage.${key}`, true, `${Array.isArray(parsed) ? parsed.length : 'object'} items`);
      } catch {
        logTest(`localStorage.${key}`, false, 'Erreur de parsing JSON');
      }
    } else {
      logTest(`localStorage.${key}`, false, 'Clé non trouvée');
    }
  });
} catch (error) {
  console.error('❌ Erreur dans les tests LOCALSTORAGE:', error);
}

console.log('\n🧪 === FIN DES TESTS CRUD ===');
console.log('\n📋 RÉSUMÉ:');
console.log('- Ouvrez votre application dans le navigateur');
console.log('- Ouvrez la console (F12)');
console.log('- Les fonctions CRUD doivent être disponibles globalement pour les tests');
console.log('- Vérifiez les logs avec emoji 📝 [STORAGE] dans la console');
