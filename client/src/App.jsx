import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import FavoritesPage from './pages/FavoritesPage';
import ProfilePage from './pages/ProfilePage';
import InsertRecipePage from './pages/InsertRecipePage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <Router>
      <Navbar user={currentUser} onLogout={handleLogout} />
      
      <Routes>
        <Route path="/insertrecipe" element={<InsertRecipePage/>}/>
        <Route path="/profile" element={<ProfilePage user={currentUser} />} />
        <Route path="/favorites" element={<FavoritesPage user={currentUser} />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<HomePage user={currentUser} />} />
        <Route path="/login" element={<LoginPage setCurrentUser={setCurrentUser} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
