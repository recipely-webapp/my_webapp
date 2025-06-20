import React from 'react';
import '../styles/pages-styles/AboutPage.css'; 

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <div className="about-header">
        <h1 className="about-title">About Recipe.ly</h1>
        <p className="about-subtitle">La tua cucina digitale. Cerca, crea e condividi.</p>
      </div>

      <div className="about-section project-section">
        <div className="about-text-content">
          <h2 className="section-title">Il Progetto</h2>
          <p><strong>Recipe.ly</strong> è il tuo assistente di cucina personale, un'applicazione web moderna pensata per chi ama cucinare.</p>
          <p>All'interno di Recipe.ly, ogni utente può creare il proprio profilo personale per accedere a un mondo di possibilità. La piattaforma permette di:</p>
          <ul>
            <li><strong>Aggiungere e gestire ricette personali</strong>, complete di ingredienti e procedimenti.</li>
            <li><strong>Esplorare un vasto archivio di ricette pubbliche</strong>, cercando per nome.</li>
            <li><strong>Salvare le ricette preferite</strong> in una collezione personale.</li>
          </ul>
        </div>

        <div className="about-image-content">
          <img 
            src="https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070" 
            alt="" 
            className="about-image"
          />
        </div>
      </div>

      <div className="about-section tech-section">
        <h2 className="section-title centered-title">Tecnologie Utilizzate</h2>
        <div className="tech-columns">
          <div className="tech-column">
            <h3>Frontend</h3>
            <ul>
              <li><strong>React:</strong> Libreria per la costruzione di interfacce utente.</li>
              <li><strong>React Router:</strong> Per la navigazione lato client (SPA).</li>
              <li><strong>Axios:</strong> Per le chiamate HTTP al backend.</li>
              <li><strong>CSS3:</strong> Per lo styling personalizzato e layout responsive.</li>
            </ul>
          </div>
          <div className="tech-column">
            <h3>Backend & Database</h3>
            <ul>
              <li><strong>Node.js:</strong> Ambiente di esecuzione JavaScript lato server.</li>
              <li><strong>Express.js:</strong> Framework per la creazione di API REST.</li>
              <li><strong>MongoDB:</strong> Database NoSQL per la memorizzazione dei dati.</li>
              <li><strong>Mongoose:</strong> ODM per modellare i dati dell'applicazione.</li>
              <li><strong>JSON Web Tokens (JWT):</strong> Per l'autenticazione sicura.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="about-section context-section">
        <div className="context-box">
          <h3>Contesto Accademico</h3>
          <p>Questo progetto è stato realizzato per l'esame di <strong>Fondamenti del Web</strong> del Prof. Antonio Ferrara.
            <br />Corso di Laurea in Ingegneria Informatica e dell'Automazione.<br />Anno Accademico 2024/2025.</p>
        </div>

        <div className="context-box">
          <h3>Autore</h3>
          <p>Sviluppato da: <strong>Luca Adesso, Roberta Binetti e Nicolò Rutigliano</strong></p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;