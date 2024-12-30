const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Configuración del motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: false }));

// Configuración de la sesión
app.use(session({
    secret: 'sldkjfñslakdfjlksaf', // Cambia esto por una clave secreta más segura
    resave: false,
    saveUninitialized: true
}));

// Middleware para servir archivos estáticos 
// app.use(express.static(path.join(__dirname, '../public')));

// Rutas
app.use('/', require('./router'));

app.listen(port, () => {
    console.log(`Servidor Iniciado  en el puerto ${port}`);
});
