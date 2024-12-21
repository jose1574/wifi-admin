function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next(); // Usuario está autenticado, continuar a la ruta protegida
    } else {
      res.redirect('/login'); // Usuario no está autenticado, redirigir al login
    }
  }
  
  module.exports = ensureAuthenticated;
  