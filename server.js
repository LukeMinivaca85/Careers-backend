const express = require('express');
const axios = require('axios');
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// login
app.get('/auth/linkedin', (req, res) => {
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=r_liteprofile r_emailaddress`;
  res.redirect(url);
});

// callback
app.get('/auth/linkedin/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET
        }
      }
    );

    const accessToken = tokenRes.data.access_token;

    const profile = await axios.get(
      'https://api.linkedin.com/v2/me',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.send(`<h1>Logado 🚀</h1><pre>${JSON.stringify(profile.data, null, 2)}</pre>`);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("Erro no login 😭");
  }
});

app.get('/', (req, res) => {
  res.send("API Lukintosh rodando 🚀");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando"));
