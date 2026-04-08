catch (err) {
  console.error("ERRO REAL:", err.response?.data || err.message);

  res.send(`
    <h1>Erro no login 😭</h1>
    <pre>${JSON.stringify(err.response?.data || err.message, null, 2)}</pre>
  `);
}
