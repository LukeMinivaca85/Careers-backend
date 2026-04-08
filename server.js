app.get('/auth/linkedin', (req, res) => {
  const redirectUri = "https://careers-backend-dhpk.onrender.com/auth/linkedin/callback";

  const url =
    "https://www.linkedin.com/oauth/v2/authorization" +
    "?response_type=code" +
    "&client_id=" + process.env.CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&scope=r_liteprofile%20r_emailaddress";

  res.redirect(url);
});
