const express = require('express');
const axios = require('axios');
const app = express();

// ⚠️ COLOCA SEU CLIENT_ID AQUI
const CLIENT_ID = process.env.CLIENT_ID;

// 🔥 REDIRECT FIXO (pra garantir que funcione)
const REDIRECT_URI = "https://careers-backend-dhpk.onrender.com/auth/linkedin/callback";

// HOME
app.get('/', (req, res) => {
  res.send("API Lukintosh rodando 🚀");
});

// LOGIN LINKEDIN
app.get('/auth/linkedin', (req, res) => {
  const url =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    "&client_id=" + CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&scope=r_liteprofile%20r_emailaddress";

  res.redirect(url);
});

// CALLBACK
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
          client_secret: process.env.CLIENT_SECRET
        }
      }
    );

    const accessToken = tokenRes.data.access_token;

    const profile = await axios.get(
      'https://api.linkedin.com/v2/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.send(`
      <h1>Login OK 🚀</h1>
      <pre>${JSON.stringify(profile.data, null, 2)}</pre>
      <br>
      <a href="https://be.at.lukintosh.com">Voltar pro site</a>
    `);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.send("Erro no login 😭");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando 🚀"));
