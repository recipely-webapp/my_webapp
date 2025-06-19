import React from 'react';
import { Link } from 'react-router-dom'; // Importa il componente Link per la navigazione
import '../styles/components-styles/Footer.css';

const Footer = () => {
  return (
    <footer className="page-footer">
      <p>
        © {new Date().getFullYear()} Recipe.ly • Progetto per il corso di Fondamenti del Web.
        <Link to="/about">
          Dettagli Progetto
        </Link>
      </p>

    </footer>
  );
};

export default Footer;