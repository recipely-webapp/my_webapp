// Importazione libreria JavaScript
import axios from 'axios';

// Creazione di un'istanza di Axios con URL base
const API = axios.create({
  //baseURL: 'http://localhost:5000/api',  // da usare se vuoi utilizzare il localhost per test
  baseURL:'https://recipely-webapp.onrender.com/api',
  withCredentials: true,
});

// Intercettore di richiesta
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Intercettore di risposta
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
      // Richiesta già ritentata una volta
      originalRequest._retry = true; 
      try {
        // Richiede un nuovo access token
        const { data } = await API.post('/auth/refresh');
        localStorage.setItem('accessToken', data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;       
        return axios(originalRequest);
      } 
      catch (refreshError) {
        console.error("Sessione scaduta. Eseguire di nuovo il login.");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Reindirizza al login
        window.location.href = '/'; 
        // Inoltra errore generato dal fallimento del refresh
        return Promise.reject(refreshError);
      }
    }
    // Inoltra errore originale
    return Promise.reject(error);
  }
);

// Esportazione delle funzioni API
export default {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (data) => API.post('/auth/register', data),
  getAllRecipes: () => API.get('/recipes'),
  searchRecipes: (query) => API.get('/recipes/search', { params: { q: query } }),
  getRecipeById: (recipeId) => API.get(`/recipes/${recipeId}`), 
  getUserRecipes: () => API.get('/recipes/by-user/mine'),
  createRecipe: (recipeData) => API.post('/recipes', recipeData),
  updateRecipe: (recipeId, recipeData) => API.put(`/recipes/${recipeId}`, recipeData),
  deleteRecipe: (recipeId) => API.delete(`/recipes/${recipeId}`),
  toggleFavorite: (recipeId) => API.post(`/users/favorites/${recipeId}`),
  getFavorites: () => API.get('/users/favorites'),
};
