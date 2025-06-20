import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components-styles/Navbar.css';
import logo from '../assets/logo.png';
import userIcon from '../assets/profile.jpg'; 
// Importazione simbolo menù ad hamburger e X
import { FaBars, FaTimes } from 'react-icons/fa';

// Gestione dello stato dei componenti
function Navbar({ user, onLogout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Gestione logout
  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };
  
  // Gestione click esterni
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Se c'è riferimento al dropdown e click non è all'interno
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // Effetto eseguito ogni volta che dropdownRef cambia
  }, [dropdownRef]);

   const closeAllMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }

  return (
    <nav className="navbar">

      <Link to="/">
        <img src={logo} alt = "Logo" className="navbar-logo" />
      </Link>

      <h1 className="title">RECIPELY</h1>

      <div className={isMobileMenuOpen ? "nav-buttons mobile-active" : "nav-buttons"}>
        <Link to="/" className="nav-link-button" onClick={closeAllMenus}>Home</Link>

        {/* Se l'utente esiste, mostra menù utente */}
        {user ? (
          <div className="user-menu-container" ref={dropdownRef}>
            {/* Apre/chiude il dropdown */}
            <div className="user-menu-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img src={userIcon} alt="User Profile" className="user-profile-pic" />
              <div className="username">{user.username}</div>
            </div>

            {/* Se dropdown è aperto, mostra i link */}
            {isDropdownOpen && (
              <div className="dropdown-menu">

                <Link to="/profile" className="dropdown-link" onClick={closeAllMenus}>
                  Mio Profilo
                </Link>

                <Link to="/favorites" className="dropdown-link" onClick={closeAllMenus}>
                  Preferiti
                </Link>

                <Link to="/insert-recipe" className="dropdown-link" onClick={closeAllMenus}>
                  Inserisci ricetta
                </Link>

                {/* Linea di separazione tra sezione profilo e logout */}
                <div className="dropdown-divider"></div>
                
                {/* Logout utente */}
                <div className="dropdown-item" onClick={handleLogout}>
                  Esci
                </div>

              </div>
            )}
          </div>
        ) : (
          // Se utente non è loggato, vengono mostrati due pulsanti
          <>
            <Link to="/login" className="nav-link-button" onClick={closeAllMenus}>Login</Link>
            <Link to="/register" className="nav-link-button" onClick={closeAllMenus}>Register</Link>
          </>
        )}
      </div>

      {/* Gestione icona del menù hamburger */}
      <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
}

export default Navbar;