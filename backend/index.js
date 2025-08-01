// index.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import Entry from './models/Entry.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(' MongoDB connection error:', err));

// Extract + summarize route
app.post('/extract', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL in request body.' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const text = convert(html, { wordwrap: 130 }).slice(0, 4000);

    const prompt = `Summarize the following article and extract key bullet points:\n\n${text}`;

    // Call Ollama local API
    const ollamaResponse = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama responded with status ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();

    // Check for valid Ollama response
    if (!data || typeof data.response !== 'string') {
      console.error(' Invalid Ollama response:', JSON.stringify(data));
      return res.status(500).json({
        error: 'Unexpected response from Ollama',
        raw: data,
      });
    }

    const summary = data.response;

    const key_points = summary
      .split('\n')
      .filter((line) => line.trim().startsWith('-'))
      .map((line) => line.replace(/^[-\s]+/, ''));

    const entry = new Entry({ url, summary, key_points });
    await entry.save();

    res.status(200).json(entry);
  } catch (err) {
    console.error(' Error during /extract:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});


// Get all entries
app.get('/entries', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ created_at: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

app.listen(PORT, () => {
  console.log(` Server listening at http://localhost:${PORT}`);
});
