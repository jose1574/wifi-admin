const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("./middleware/auth");

const {
  getHotspotProfUsers,
  createMikrotikConnection,
} = require("../services-mikrotik/services.mikrotik");

// Mostrar formulario de login
router.get("/login", (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  res.render("login", { message });
});

// Procesar el login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  req.session.mikrotikCreds = { username, password };
  try {
    const conn = await createMikrotikConnection(req);
    await conn.connect();
    req.session.user = username;
    conn.close();
    res.redirect("/");
  } catch (err) {
    req.session.message = "Clave o usuario incorrecto";
    res.redirect("login");
  }
});

// Logout
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Página principal
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("dashboard");
});

//crear un nuevo usuario
router.get("new_user", ensureAuthenticated, async (req, res) => {

});

//crear nnuevo usuario
router.post("new_user", ensureAuthenticated, async (req, res) => {
  try {
    const profilesUser = await getHotspotProfUsers(req);
  } catch (error) {
    
  }
});



router.get("/test", ensureAuthenticated, async (req, res) => {
  try {
    const profilesUser = await getHotspotProfUsers(req);
    console.log('estos son los datos desde el router : ', profilesUser);    
    res.send("ruta de prueba");        
  } catch (error) {
    res.send('error para obtener los perfiles: ', error)    
  }
   
});

module.exports = router;
