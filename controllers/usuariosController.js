const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/emails');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const configuracionMulter = {
    limits :{ fileSize: 10000000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/perfiles/');
        },
        filename : (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, next){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
            // El formato es valido
            next(null, true);
        }else {
            // El formato no es valido
            next(new Error('Formato no valido  de imagen'), false);
        }
    }
}
const upload = multer(configuracionMulter).single('imagen');

// Sube la imagen en el servidor
exports.subirImagen = (req,res,next) => {
    upload(req, res, function(error){
        if(error){
            // Manejar errores
            if(error instanceof multer.MulterError){
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error','El archivo de la imagen es muy grande');
                } else {
                    req.flash('error', error.message);
                }
            } else if(error.hasOwnProperty('message')){
                req.flash('error',error.message);
            }
            res.redirect('back');
            return;
        }else{
            next();
        }
    })
}


exports.formCrearCuenta = (req, res) => {
  res.render('crear-cuenta', {
    nombrePagina: 'Crea tu Cuenta',
  });
};

exports.crearNuevaCuenta = async (req, res, next) => {
  const usuario = req.body;

  req.checkBody('email', 'Agrega un correo valido').isEmail();
  req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty().trim();
  req.checkBody('password', 'El password no puede ir vacio').notEmpty().trim();
  req.checkBody('confirmar', 'El password confirmado no puede ir vacio').notEmpty().trim();
  req.checkBody('confirmar', 'Los password no coinciden').equals(req.body.password);
  // Leer los errores de express
  const erroresExpress = req.validationErrors();


  if(erroresExpress){
    const errExp = erroresExpress.map(err => err.msg);
    req.flash('error', errExp);
    res.redirect('/crear-cuenta');
    return next();
  }

  const user = await Usuarios.findOne({ where: { email: usuario.email, },});
  // console.log(user);
  if(user){
    req.flash('error', 'Usuario ya registrado');
    res.redirect('/crear-cuenta');
    return next();
  }

  try {
    await Usuarios.create(usuario);

    // generar URL de confirmacion
    const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

    // Enviar email de confirmación
  
    await enviarEmail.enviarEmail({
      usuario,
      url,
      subject: 'Confirma tu cuenta de Encontrando Huellitas',
      archivo: 'confirmar-cuenta',
    })
    //Flash Message y redireccionar
    req.flash('exito', 'Hemos enviado un E-mail, confirma tu cuenta');
    res.redirect('/iniciar-sesion');

  } catch (error) {
    // extraer el message de los errores
    // console.log(error);
    const erroresSequelize = error.errors.map(err => err.message);
    req.flash('error', erroresSequelize);
    res.redirect('/crear-cuenta');
  }
};

// Confirma la suscripcion del usuario
exports.confirmarCuenta = async (req,res,next) => {
  // verificar que el usuario existe
  const usuario = await Usuarios.findOne({ where : { email : req.params.correo }});

  // Si no existe, redireccionar
  if(!usuario){
    req.flash('error','No existe esa cuenta');
    res.redirect('/crear-cuenta');
    return next();
  }
  // si existe confirmar suscripcion y redireccionar
  usuario.activo = 1;
  await usuario.save();
  req.flash('exito','La cuenta ya se ha confirmado ya puedes iniciar sesión');
  res.redirect('/iniciar-sesion');
}

// Formulario para iniciar sesión
exports.formIniciarSesion = (req, res) => {
  res.render('iniciar-sesion', {
    nombrePagina: 'Iniciar Sesión',
  });
};

// Muestra el formulario para editar el perfil
exports.formEditarPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);

  res.render('editar-perfil',{
    nombrePagina: 'Editar Perfil',
    usuario,
  });
}

// Almacena en la BD los cambios del perfil
exports.editarPerfil = async (req, res, next) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  // Sanitizando los campos
  req.sanitizeBody('nombre');
  req.sanitizeBody('email');

  req.checkBody('email', 'Agrega un correo valido').isEmail();
  req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty().trim();

  const erroresExpress = req.validationErrors();

  if(erroresExpress){
    const errExp = erroresExpress.map(err => err.msg);
    req.flash('error', errExp);
    res.redirect('/editar-perfil');
    return next();
  }
  // leer los datos del from
  const { nombre , email} = req.body;
  usuario.nombre = nombre;
  usuario.email = email;  
  
  // GUardar en la base de datos
  await usuario.save();
  req.flash('exito','Cambios Guardados Correctamente');
  res.redirect('/administracion');
}

// Muestra el formulario para modificar el password
exports.formCambiarPassword = (req ,res) => {
  res.render('cambiar-password',{
    nombrePagina: 'Cambiar Password'    
  });
}

// Revisa si el pasword anterior es correcto y lo modifica por uno nuevo
exports.cambiarPassword = async (req, res, next) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  // verificar que el password anterior sea el correcto
  if(!usuario.validarPassword(req.body.anterior)){
    req.flash('error','El password actual es incorrecto');
    res.redirect('/administracion');
    return next();
  }
  // siel password es correcto hashear el nuevo
  const hash =  usuario.hashPassword(req.body.nuevo);
  // console.log(hash);
  // asignar el password al usuario
  usuario.password = hash;
  // guardar en la base de datos
  await usuario.save();
  // redireccionar
  req.logout();
  req.flash('exito','Password Modificado Correctamente, Vuelve a iniciar sesión');
  res.redirect('/iniciar-sesion');
}

// Muestra el formulario para subir una imagen de perfil
exports.formSubirImagenPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  res.render('imagen-perfil',{
    nombrePagina: 'Subir Imagen de Perfil',
    usuario,
  });
} 

// Guarda la nueva imagen y elimina la anteior
exports.guardarImagenPerfil = async (req, res) => {
  const usuario = await Usuarios.findByPk(req.user.id);
  
  if(req.file && usuario.imagen){
      const imagenAnteriorPath = __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;
      
      // eliminar archivo con filesystem
      fs.unlink(imagenAnteriorPath, (error) => {
          if(error){
              console.log(error);
          }
          return;
      });
  }

  // Si al una imagen nueva la guardamos
  if(req.file){
      usuario.imagen = req.file.filename;
  }

  // guardar en la BD
  await usuario.save();
  req.flash('exito', 'Cambios Almacenados Correctamente');
  res.redirect('/administracion');

}

