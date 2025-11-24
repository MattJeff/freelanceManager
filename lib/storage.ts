import { Todo, Contact, Goal, Post, Analytics, Subtask } from '@/types';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Storage keys
const STORAGE_KEYS = {
  TODOS: 'freelance_todos',
  CONTACTS: 'freelance_contacts',
  GOALS: 'freelance_goals',
  POSTS: 'freelance_posts',
  ANALYTICS: 'freelance_analytics',
  PLATFORMS: 'freelance_platforms',
};

// Generic storage functions
const getFromStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item, (key, value) => {
      // Convert date strings back to Date objects
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    }) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const saveToStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// ===== TODO FUNCTIONS =====
export const getTodos = (): Todo[] => {
  return getFromStorage(STORAGE_KEYS.TODOS, []);
};

export const saveTodos = (todos: Todo[]): void => {
  saveToStorage(STORAGE_KEYS.TODOS, todos);
};

export const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'subtasks'>): Todo => {
  console.log('📝 [STORAGE] addTodo called with:', todo);
  const newTodo: Todo = {
    ...todo,
    id: generateId(),
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const todos = getTodos();
  todos.push(newTodo);
  saveTodos(todos);
  console.log('✅ [STORAGE] Todo added successfully:', newTodo);
  console.log('📊 [STORAGE] Total todos now:', todos.length);
  return newTodo;
};

export const updateTodo = (id: string, updates: Partial<Todo>): Todo | null => {
  console.log('✏️ [STORAGE] updateTodo called - id:', id, 'updates:', updates);
  const todos = getTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    console.error('❌ [STORAGE] Todo not found with id:', id);
    return null;
  }

  todos[index] = {
    ...todos[index],
    ...updates,
    updatedAt: new Date(),
  };
  saveTodos(todos);
  console.log('✅ [STORAGE] Todo updated successfully:', todos[index]);
  return todos[index];
};

export const deleteTodo = (id: string): boolean => {
  console.log('🗑️ [STORAGE] deleteTodo called - id:', id);
  const todos = getTodos();
  const filtered = todos.filter(t => t.id !== id);
  if (filtered.length === todos.length) {
    console.error('❌ [STORAGE] Todo not found for deletion - id:', id);
    return false;
  }
  saveTodos(filtered);
  console.log('✅ [STORAGE] Todo deleted successfully - Remaining:', filtered.length);
  return true;
};

export const toggleTodo = (id: string): Todo | null => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  if (!todo) return null;
  return updateTodo(id, { completed: !todo.completed });
};

// ===== SUBTASK FUNCTIONS =====
export const addSubtaskToTodo = (todoId: string, subtaskTitle: string): Todo | null => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === todoId);
  if (!todo) return null;

  const newSubtask: Subtask = {
    id: generateId(),
    title: subtaskTitle,
    completed: false,
    createdAt: new Date(),
  };

  const updatedSubtasks = [...todo.subtasks, newSubtask];
  return updateTodo(todoId, { subtasks: updatedSubtasks });
};

export const updateSubtask = (
  todoId: string,
  subtaskId: string,
  updates: Partial<Subtask>
): Todo | null => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === todoId);
  if (!todo) return null;

  const updatedSubtasks = todo.subtasks.map(st =>
    st.id === subtaskId ? { ...st, ...updates } : st
  );

  return updateTodo(todoId, { subtasks: updatedSubtasks });
};

export const deleteSubtask = (todoId: string, subtaskId: string): Todo | null => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === todoId);
  if (!todo) return null;

  const updatedSubtasks = todo.subtasks.filter(st => st.id !== subtaskId);
  return updateTodo(todoId, { subtasks: updatedSubtasks });
};

export const toggleSubtask = (todoId: string, subtaskId: string): Todo | null => {
  const todos = getTodos();
  const todo = todos.find(t => t.id === todoId);
  if (!todo) return null;

  const subtask = todo.subtasks.find(st => st.id === subtaskId);
  if (!subtask) return null;

  return updateSubtask(todoId, subtaskId, { completed: !subtask.completed });
};

// ===== CONTACT FUNCTIONS =====
export const getContacts = (): Contact[] => {
  return getFromStorage(STORAGE_KEYS.CONTACTS, []);
};

export const saveContacts = (contacts: Contact[]): void => {
  saveToStorage(STORAGE_KEYS.CONTACTS, contacts);
};

export const addContact = (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Contact => {
  console.log('👤 [STORAGE] addContact called with:', contact);
  const newContact: Contact = {
    ...contact,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const contacts = getContacts();
  contacts.push(newContact);
  saveContacts(contacts);
  console.log('✅ [STORAGE] Contact added successfully:', newContact);
  console.log('📊 [STORAGE] Total contacts now:', contacts.length);
  return newContact;
};

export const updateContact = (id: string, updates: Partial<Contact>): Contact | null => {
  console.log('✏️ [STORAGE] updateContact called - id:', id, 'updates:', updates);
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index === -1) {
    console.error('❌ [STORAGE] Contact not found with id:', id);
    return null;
  }

  contacts[index] = {
    ...contacts[index],
    ...updates,
    updatedAt: new Date(),
  };
  saveContacts(contacts);
  console.log('✅ [STORAGE] Contact updated successfully:', contacts[index]);
  return contacts[index];
};

export const deleteContact = (id: string): boolean => {
  console.log('🗑️ [STORAGE] deleteContact called - id:', id);
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== id);
  if (filtered.length === contacts.length) {
    console.error('❌ [STORAGE] Contact not found for deletion - id:', id);
    return false;
  }
  saveContacts(filtered);
  console.log('✅ [STORAGE] Contact deleted successfully - Remaining:', filtered.length);
  return true;
};

// ===== GOAL FUNCTIONS =====
export const getGoals = (): Goal[] => {
  return getFromStorage(STORAGE_KEYS.GOALS, []);
};

export const saveGoals = (goals: Goal[]): void => {
  saveToStorage(STORAGE_KEYS.GOALS, goals);
};

export const addGoal = (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal => {
  console.log('🎯 [STORAGE] addGoal called with:', goal);
  const newGoal: Goal = {
    ...goal,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const goals = getGoals();
  goals.push(newGoal);
  saveGoals(goals);
  console.log('✅ [STORAGE] Goal added successfully:', newGoal);
  console.log('📊 [STORAGE] Total goals now:', goals.length);
  return newGoal;
};

export const updateGoal = (id: string, updates: Partial<Goal>): Goal | null => {
  console.log('✏️ [STORAGE] updateGoal called - id:', id, 'updates:', updates);
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index === -1) {
    console.error('❌ [STORAGE] Goal not found with id:', id);
    return null;
  }

  goals[index] = {
    ...goals[index],
    ...updates,
    updatedAt: new Date(),
  };
  saveGoals(goals);
  console.log('✅ [STORAGE] Goal updated successfully:', goals[index]);
  return goals[index];
};

export const deleteGoal = (id: string): boolean => {
  console.log('🗑️ [STORAGE] deleteGoal called - id:', id);
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  if (filtered.length === goals.length) {
    console.error('❌ [STORAGE] Goal not found for deletion - id:', id);
    return false;
  }
  saveGoals(filtered);
  console.log('✅ [STORAGE] Goal deleted successfully - Remaining:', filtered.length);
  return true;
};

// ===== POST FUNCTIONS =====
export const getPosts = (): Post[] => {
  return getFromStorage(STORAGE_KEYS.POSTS, []);
};

export const savePosts = (posts: Post[]): void => {
  saveToStorage(STORAGE_KEYS.POSTS, posts);
};

export const addPost = (post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Post => {
  console.log('📝 [STORAGE] addPost called with:', post);
  const newPost: Post = {
    ...post,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const posts = getPosts();
  posts.push(newPost);
  savePosts(posts);
  console.log('✅ [STORAGE] Post added successfully:', newPost);
  console.log('📊 [STORAGE] Total posts now:', posts.length);
  return newPost;
};

export const updatePost = (id: string, updates: Partial<Post>): Post | null => {
  console.log('✏️ [STORAGE] updatePost called - id:', id, 'updates:', updates);
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) {
    console.error('❌ [STORAGE] Post not found with id:', id);
    return null;
  }

  posts[index] = {
    ...posts[index],
    ...updates,
    updatedAt: new Date(),
  };
  savePosts(posts);
  console.log('✅ [STORAGE] Post updated successfully:', posts[index]);
  return posts[index];
};

export const deletePost = (id: string): boolean => {
  console.log('🗑️ [STORAGE] deletePost called - id:', id);
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  if (filtered.length === posts.length) {
    console.error('❌ [STORAGE] Post not found for deletion - id:', id);
    return false;
  }
  savePosts(filtered);
  console.log('✅ [STORAGE] Post deleted successfully - Remaining:', filtered.length);
  return true;
};

// ===== ANALYTICS FUNCTIONS =====
export const getAnalytics = (): Analytics[] => {
  return getFromStorage(STORAGE_KEYS.ANALYTICS, []);
};

export const saveAnalytics = (analytics: Analytics[]): void => {
  saveToStorage(STORAGE_KEYS.ANALYTICS, analytics);
};

export const addAnalytic = (analytic: Omit<Analytics, 'id' | 'createdAt'>): Analytics => {
  const newAnalytic: Analytics = {
    ...analytic,
    id: generateId(),
    createdAt: new Date(),
  };
  const analytics = getAnalytics();
  analytics.push(newAnalytic);
  saveAnalytics(analytics);
  return newAnalytic;
};

// ===== PLATFORM ACCOUNT FUNCTIONS =====
export const getFreelancePlatformAccounts = (): Record<string, boolean> => {
  return getFromStorage(STORAGE_KEYS.PLATFORMS, {});
};

export const updatePlatformAccount = (platformId: string, hasAccount: boolean): void => {
  const platforms = getFreelancePlatformAccounts();
  platforms[platformId] = hasAccount;
  saveToStorage(STORAGE_KEYS.PLATFORMS, platforms);
};
