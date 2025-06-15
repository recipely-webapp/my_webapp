import axios from 'axios';

const API = axios.create({
  //baseURL: 'http://localhost:5000/api',
  baseURL:'https://recipely-webapp.onrender.com',
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Intercettore di risposta per gestire il refresh del token
API.interceptors.response.use(
  // Se la risposta è OK, non fare nulla
  (response) => response,
  // Se c'è un errore nella risposta
  async (error) => {
    const originalRequest = error.config;
    // Controlla se l'errore è 403 (Forbidden, il nostro server lo usa per token scaduto)
    // e se la richiesta non è già un tentativo di retry (per evitare loop infiniti)
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true; // Marca la richiesta come "già ritentata"

      try {
        // Tenta di ottenere un nuovo access token
        const { data } = await API.post('/auth/refresh');
        
        // Salva il nuovo token
        localStorage.setItem('accessToken', data.accessToken);
        
        // Aggiorna l'header di autorizzazione per la richiesta originale
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        
        // Ritenta la richiesta originale con il nuovo token
        return axios(originalRequest);

      } catch (refreshError) {
        // Se anche il refresh fallisce (es. refresh token scaduto)
        // pulisci tutto e reindirizza al login
        console.error("Sessione scaduta. Eseguire di nuovo il login.");
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/'; // Reindirizza al login
        return Promise.reject(refreshError);
      }
    }
    // Per tutti gli altri errori, rigetta la promise
    return Promise.reject(error);
  }
);


export default {
  login: (credentials) => API.post('/auth/login', credentials),
  register: (data) => API.post('/auth/register', data),
  getAllRecipes: () => API.get('/recipes'),
  searchRecipes: (query) => API.get('/recipes/search', { params: { q: query } }),
  toggleFavorite: (recipeId) => API.post(`/users/favorites/${recipeId}`),
  getFavorites: () => API.get('/users/favorites'),
   createRecipe: (recipeData) => API.post('/recipes', recipeData),
   getRecipeById: (id) => API.get(`/recipes/${id}`), 
};
