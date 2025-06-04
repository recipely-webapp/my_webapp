import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMsg(data.message));
  }, []);

  return (
    <div className="App">
      <h1>React + Express aaaaaaaaaaaaaaaaaaaa
        
      </h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;
