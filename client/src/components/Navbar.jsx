import React, { useState, useEffect, useRef } from 'react';
// 1. Rimuovi useNavigate e importa Link
import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.png';
import userIcon from '../assets/profile.jpg'; 
import { FaBars, FaTimes } from 'react-icons/fa';

function Navbar({ user, onLogout }) {
  // 2. Rimuovi la riga 'const navigate = useNavigate();'
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
     setIsMobileMenuOpen(false);
  };
  
  // 3. Rimuovi la funzione 'handleNavigate', non è più necessaria.

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

   const closeAllMenus = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }

  return (
    <nav className="navbar">
      {/* 4. Usa Link per il logo */}
      <Link to="/">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </Link>
      <h1 className="title">RECIPELY</h1>

      {/* 3. Aggiungi il contenitore per i bottoni con una classe condizionale */}
      <div className={isMobileMenuOpen ? "nav-buttons mobile-active" : "nav-buttons"}>
        <Link to="/" className="nav-link-button" onClick={closeAllMenus}>Home</Link>
        
        {user ? (
          <div className="user-menu-container" ref={dropdownRef}>
            <div className="user-menu-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img src={userIcon} alt="User Profile" className="user-profile-pic" />
              <div className="username">{user.username}</div>
            </div>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-link" onClick={closeAllMenus}>
                  Mio Profilo
                </Link>
                <Link to="/favorites" className="dropdown-link" onClick={closeAllMenus}>
                  Preferiti
                </Link>
                <Link to="/insertrecipe" className="dropdown-link" onClick={closeAllMenus}>
                  Inserisci ricetta
                </Link>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Esci
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="nav-link-button" onClick={closeAllMenus}>Login</Link>
            <Link to="/register" className="nav-link-button" onClick={closeAllMenus}>Register</Link>
          </>
        )}
      </div>

      {/* 4. Aggiungi l'icona hamburger che appare solo su mobile */}
      <div className="mobile-menu-icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
}

export default Navbar;