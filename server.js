const express = require("express");
const axios = require("axios");

const app = express();

// 🔑 COLOCA SEUS DADOS AQUI
const CLIENT_ID = "SEU_CLIENT_ID_AQUI";
const CLIENT_SECRET = "SEU_CLIENT_SECRET_AQUI";

const REDIRECT_URI = "https://careers-backend-dhpk.onrender.com/auth/linkedin/callback";

// 👉 LOGIN
app.get("/auth/linkedin", (req, res) => {
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=r_liteprofile%20r_emailaddress`;

  res.redirect(url);
});

// 👉 CALLBACK
app.get("/auth/linkedin/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("❌ Erro: código não recebido");
  }

  try {
    // 🔑 TOKEN
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = tokenResponse.data.access_token;

    // 👤 PERFIL
    const profile = await axios.get(
      "https://api.linkedin.com/v2/me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    // 📧 EMAIL
    const email = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    res.send(`
      <h1>Login OK 🚀</h1>
      <p>Nome: ${profile.data.localizedFirstName}</p>
      <p>Email: ${email.data.elements[0]["handle~"].emailAddress}</p>
    `);

  } catch (err) {
    console.error("ERRO:", err.response?.data || err.message);

    res.send(`
      <h1>Erro no login 😭</h1>
      <pre>${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>
    `);
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando 🚀");
});
