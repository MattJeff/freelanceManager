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
  return newTodo;
};

export const updateTodo = (id: string, updates: Partial<Todo>): Todo | null => {
  const todos = getTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return null;

  todos[index] = {
    ...todos[index],
    ...updates,
    updatedAt: new Date(),
  };
  saveTodos(todos);
  return todos[index];
};

export const deleteTodo = (id: string): boolean => {
  const todos = getTodos();
  const filtered = todos.filter(t => t.id !== id);
  if (filtered.length === todos.length) return false;
  saveTodos(filtered);
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
  const newContact: Contact = {
    ...contact,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const contacts = getContacts();
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
};

export const updateContact = (id: string, updates: Partial<Contact>): Contact | null => {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);
  if (index === -1) return null;

  contacts[index] = {
    ...contacts[index],
    ...updates,
    updatedAt: new Date(),
  };
  saveContacts(contacts);
  return contacts[index];
};

export const deleteContact = (id: string): boolean => {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== id);
  if (filtered.length === contacts.length) return false;
  saveContacts(filtered);
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
  const newGoal: Goal = {
    ...goal,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const goals = getGoals();
  goals.push(newGoal);
  saveGoals(goals);
  return newGoal;
};

export const updateGoal = (id: string, updates: Partial<Goal>): Goal | null => {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index === -1) return null;

  goals[index] = {
    ...goals[index],
    ...updates,
    updatedAt: new Date(),
  };
  saveGoals(goals);
  return goals[index];
};

export const deleteGoal = (id: string): boolean => {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  if (filtered.length === goals.length) return false;
  saveGoals(filtered);
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
  const newPost: Post = {
    ...post,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const posts = getPosts();
  posts.push(newPost);
  savePosts(posts);
  return newPost;
};

export const updatePost = (id: string, updates: Partial<Post>): Post | null => {
  const posts = getPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    ...updates,
    updatedAt: new Date(),
  };
  savePosts(posts);
  return posts[index];
};

export const deletePost = (id: string): boolean => {
  const posts = getPosts();
  const filtered = posts.filter(p => p.id !== id);
  if (filtered.length === posts.length) return false;
  savePosts(filtered);
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
