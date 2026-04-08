const express = require("express");
const axios = require("axios");

const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "https://careers-backend-dhpk.onrender.com/auth/linkedin/callback";

app.get("/", (req, res) => {
  res.send("API Lukintosh rodando 🚀");
});

app.get("/auth/linkedin", (req, res) => {
  const url =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    "&client_id=" + CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&scope=openid%20profile%20email";

  res.redirect(url);
});

app.get("/auth/linkedin/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send(`
      <h1>Erro no login 😭</h1>
      <pre>Parâmetro "code" não recebido.</pre>
    `);
  }

  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const user = userInfoResponse.data;

    res.send(`
      <h1>Login OK 🚀</h1>
      <p><strong>Nome:</strong> ${user.name || "Não encontrado"}</p>
      <p><strong>Email:</strong> ${user.email || "Não encontrado"}</p>
      <p><strong>LinkedIn ID:</strong> ${user.sub || "Não encontrado"}</p>
      <br>
      <a href="https://be.at.lukintosh.com">Voltar pro site</a>
    `);
  } catch (err) {
    console.error("ERRO:", err.response?.data || err.message);

    res.status(500).send(`
      <h1>Erro no login 😭</h1>
      <pre>${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>
    `);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando 🚀");
});
