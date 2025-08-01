import React, { useState, useEffect } from 'react';
import URLInput from './components/URLInput';
import ContentTable from './components/ContentTable';
import './App.css';
import axios from 'axios';

 const API_BASE = import.meta.env.VITE_API_BASE;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchContent = async (url) => {
    setLoading(true);
    const res = await axios.post(`${API_BASE}/extract`, { url });
    setData(prev => [res.data, ...prev]);
    setLoading(false);
  };

  const loadData = async () => {
    const res = await axios.get(`${API_BASE}/entries`);
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
