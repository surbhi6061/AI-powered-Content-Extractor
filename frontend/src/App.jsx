// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import URLInput from './components/URLInput';
import ContentTable from './components/ContentTable';
import './App.css';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContent = async (url) => {
    setLoading(true);
    const res = await axios.post('http://localhost:5000/extract', { url });
    setData(prev => [res.data, ...prev]);
    setLoading(false);
  };

  const loadData = async () => {
    const res = await axios.get('http://localhost:5000/entries');
    setData(res.data);
  };

  useEffect(() => { loadData(); }, []);

  return (
    <div className="app-container">
      <h1>AI-powered Content Extractor</h1>
      <URLInput onSubmit={fetchContent} loading={loading} />
      <ContentTable data={data} />
    </div>
  );
}

export default App;
