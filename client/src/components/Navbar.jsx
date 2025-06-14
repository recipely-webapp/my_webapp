import React, { useState, useEffect, useRef } from 'react';
// 1. Rimuovi useNavigate e importa Link
import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.png';
import userIcon from '../assets/profile.jpg'; 

function Navbar({ user, onLogout }) {
  // 2. Rimuovi la riga 'const navigate = useNavigate();'

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    onLogout();
    setIsDropdownOpen(false);
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

  return (
    <nav className="navbar">
      {/* 4. Usa Link per il logo */}
      <Link to="/">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </Link>
      <h1 className="title">RECIPELY</h1>

      <div className="nav-buttons">
        {/* 5. Usa Link per il bottone Home */}
        <Link to="/" className="nav-link-button">Home</Link>
        
        {user ? (
          <div className="user-menu-container" ref={dropdownRef}>
            <div className="user-menu-trigger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img src={userIcon} alt="User Profile" className="user-profile-pic" />
              <div className="username">{user.username}</div>
            </div>
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                {/* 6. Usa Link per le opzioni del menu, aggiungendo un onClick per chiudere la tendina */}
                <Link to="/profile" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                  Mio Profilo
                </Link>
                <Link to="/favorites" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
                  Preferiti
                </Link>
                <Link to="/insertrecipe" className="dropdown-link" onClick={() => setIsDropdownOpen(false)}>
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
            {/* 7. Usa Link per i bottoni Login e Register */}
            <Link to="/login" className="nav-link-button">Login</Link>
            <Link to="/register" className="nav-link-button">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;