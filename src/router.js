const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("./middleware/auth");
const RosApi = require("node-routeros").RouterOSAPI;

// Mostrar formulario de login
router.get("/login", (req, res) => {
  const message = req.session.message; 
  delete req.session.message;
  res.render("login", {message});
});

// Procesar el login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const conn = new RosApi({
    host: '172.16.32.1',
    user: username,
    password: password,
  });

  try {
    await conn.connect();
    req.session.user = username;
    conn.close();
    res.redirect("/dashboard");
  } catch (err) {
    req.session.message = 'Clave o usuario incorrecto'
    res.redirect('login')
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Página principal
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("dashboard");
});

router.get('/dashboard', (req, res) => {
  res.render('dashboard')
})

module.exports = router;
