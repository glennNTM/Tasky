import axios from 'axios';

// Configuration de base pour axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5500';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
)

// Services d'authentification
export const authService = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  logout: () => api.post('/api/auth/logout'),
}

// Services utilisateurs
export const userService = {
  getAllUsers: () => api.get('/api/users/'),
  getUserProfile: (id) => api.get(`/api/users/${id}`),
  updateUserProfile: (id, userData) => api.put(`/api/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/api/users/${id}`),
  updatePassword: (passwordData) => api.put('/api/users/password', passwordData), // Pour changer le mot de passe de l'utilisateur connecté
}

// Services tâches
export const taskService = {
  getAllTasks: () => api.get('/api/tasks/'),
  getMyTasks: () => api.get('/api/tasks/mytasks'),
  getTaskById: (id) => api.get(`/api/tasks/${id}`),
  createTask: (taskData) => api.post('/api/tasks/', taskData),
  updateTask: (id, taskData) => api.put(`/api/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/api/tasks/${id}`),
}

export default api
