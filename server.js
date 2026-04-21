import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// ✅ HEALTH
app.get("/", (req, res) => {
  res.send("Lukintosh LinkedIn API 🚀");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});

// 🔗 LOGIN
app.get("/auth/linkedin", (req, res) => {
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid%20profile%20email%20w_member_social`;

  res.redirect(url);
});

// 🔁 CALLBACK
app.get("/auth/linkedin/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) return res.send("Missing code ❌");

  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    })
  });

  const tokenData = await tokenRes.json();

  res.redirect(`https://be.at.lukintosh.com?token=${tokenData.access_token}`);
});

// 👤 USER INFO
app.get("/me", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  const r = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await r.json();
  res.json(data);
});

// 🚀 POST
app.post("/post", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { text } = req.body;

  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0"
    },
    body: JSON.stringify({
      author: "urn:li:person:ME",
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text },
          shareMediaCategory: "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    })
  });

  const data = await response.json();
  res.json(data);
});

// 🚀 START
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🔥 Backend rodando na porta", PORT));
