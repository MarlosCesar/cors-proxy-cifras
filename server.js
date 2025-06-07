const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.get('/', (req, res) => {
  res.send('CORS Proxy está online!');
});

// Endpoint principal do proxy
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('URL obrigatória');
  try {
    const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!response.ok) return res.status(500).send('Falha ao buscar recurso');
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    // Copia o content-type original da imagem
    res.set('Content-Type', response.headers.get('content-type'));
    response.body.pipe(res);
  } catch (e) {
    res.status(500).send('Erro no proxy');
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Proxy rodando na porta', PORT));
