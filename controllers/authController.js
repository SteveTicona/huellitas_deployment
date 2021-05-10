const passport = require("passport");

exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect : '/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage : 'Ambos campos son obligatorios'
});

exports.usuarioAtenticado = (req, res, next) => {
    // Si el usuario esta autenthicado adelante
    if(req.isAuthenticated()){ return next() }
    // si no esta autenticado
    res.redirect('/iniciar-sesion');
}

// Cerrar Sesióm
exports.cerrarSesion = (req, res, next) => {
    req.logout();
    // req.flash('exito','Se cerró la sesión correctamente');
    res.redirect('/iniciar-sesion');
    next();
}
