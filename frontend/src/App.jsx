import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// Importazione dei componenti di layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// Importazione delle viste (pagine)
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import InsertRecipePage from './pages/InsertRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import './App.css';

// Gestione dello stato utente
function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Controlla se la sessione è attiva
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Gestisce logout dell'utente
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <Router>
      <Navbar user={currentUser} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/" element={<HomePage user={currentUser} />} />
        <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
        <Route path="/profile" element={<ProfilePage user={currentUser} />} />
        <Route path="/favorites" element={<FavoritesPage user={currentUser} />} />
        <Route path="/insert-recipe" element={<InsertRecipePage/>}/>
        <Route path="/edit-recipe/:recipeId" element={<EditRecipePage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
