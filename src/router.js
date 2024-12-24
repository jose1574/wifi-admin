const express = require("express");
const router = express.Router();
const ensureAuthenticated = require("./middleware/auth");
const {
  getHotspotProfUsers,
  createMikrotikConnection,
  getServerHotspot,
  createUserHotspot,
  getOneUserById,
  getAllUsersHotspot,
  deleteOneUserById
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
router.get("/new_user", ensureAuthenticated, async (req, res) => {
  try {
    const profiles = await getHotspotProfUsers(req);
    const servers = await getServerHotspot(req);
    res.render("form_user", { profiles, servers, message: "" });
  } catch (error) {
    console.error("ocurrio un error: ", error);
  }
});
//crear nnuevo usuario
router.post("/new_user", ensureAuthenticated, async (req, res) => {
  try {    
    const { profile, name, user, password, server } = req.body;
    const findUser = await getOneUserById(req, user)
    if (findUser) {
    const profiles = await getHotspotProfUsers(req);
    const servers = await getServerHotspot(req);
    res.render("form_user", { profiles, servers, message: `El usuario ${user}, ya existe.` });      
    } else {
      const saveUser = await createUserHotspot(
        req, 
        server, 
        profile, 
        user, 
        name, 
        password
      );
      console.log(saveUser);    
      res.redirect("/");
    }    
  } catch (error) {
    console.log(error);    
    res.send('ocurrio un error: ')
  }
});

router.get('/users', ensureAuthenticated, async (req, res ) => {
  try {
    const users = await getAllUsersHotspot(req);    
    res.render("list_users", {users});
  } catch (error) {
    console.error("ocurrio un error: ", error);
  }
})

router.post('/users', ensureAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body 
    console.log('esto esta llegando a la ruta: ', req.body);
    
    const deleteUser = await deleteOneUserById(req, userId) 
    res.redirect('/users');
  } catch (error) {
    console.error('ocurrio un error al eliminar el usuario: ', error);    
    res.status(500).json('ocurrio un error');    
  }
})

router.get("/test", ensureAuthenticated, async (req, res) => {
  try {
    const { username } = req.body;
    const user = await getUserById(req, "jose15745");
    if (user === null) {
      res.json(user);
    } 
    res.redirect
  } catch (error) {
    console.error("Error para obtener el usuario:", error);
    res.status(500).send(`Error al obtener el usuario: ${error.message}`);
  }
});


module.exports = router;
