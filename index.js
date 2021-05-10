const express = require('express');
const expressEjsLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const router = require('./routes');

// Configuracion y Modelos BD
const db = require('./config/db');
db.sync()
  .then(() => console.log('DB Conectada'))
  .catch((error) => {
    console.log(error);
  });
require('./models/Usuarios');
require('./models/MascotasPerdidas');
require('./models/PeluditosPerdidos');

// Variables de desarrollo
require('dotenv').config({ path: 'variables.env' });

// Aplicacion principal
const app = express();

// Body parser, leer formularios
app.use(express.json());
app.use(express.urlencoded());

// Express validator (Validacion con bastantes funciones)
app.use(expressValidator());

// Habilitar EJS como template engine
app.use(expressEjsLayouts);
app.set('view engine', 'ejs');

// Ubicación Vistas
app.set('views', path.join(__dirname, './views'));

// Archivos estaticos
app.use(express.static('public'));

// Habilitar cookie parser
app.use(cookieParser());

// crear la sesión
app.use(
  session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());
// Agregando Flash messages
app.use(flash());

// Middleware  (usuario logueado, flash messages, fecha actual)
app.use((req, res, next) => {
  res.locals.usuario = {...req.user} || null;
  res.locals.mensajes = req.flash();
  const fecha = new Date();
  res.locals.year = fecha.getFullYear();

  next();
});

// Routing
app.use('/', router());

// Leer el host y el puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

// Agrega el Puerto
app.listen(port, host, () => {
  console.log('El servidor esta funcionando');
});
