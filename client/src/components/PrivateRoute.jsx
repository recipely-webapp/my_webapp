import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Questo componente funge da "guardia" per le rotte private
function PrivateRoute({ user, redirectPath = '/' }) {
  
  // Controlla se l'utente è loggato.
  // In un'app più complessa, potresti anche controllare se i dati dell'utente sono stati caricati.
  if (!user) {
    // Se non è loggato, reindirizza alla pagina di login (o un'altra pagina di fallback).
    // Il parametro 'replace' evita di aggiungere la pagina protetta alla cronologia del browser.
    return <Navigate to={redirectPath} replace />;
  }

  // Se l'utente è loggato, renderizza il contenuto della rotta richiesta.
  // L' <Outlet /> è un segnaposto per il componente che questa rotta deve visualizzare
  // (es. ProfilePage, InsertRecipePage, etc.).
  return <Outlet />;
}

export default PrivateRoute;