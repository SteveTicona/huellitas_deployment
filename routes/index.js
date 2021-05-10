const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const mascotasController = require('../controllers/mascotasController');
const peluditosController = require('../controllers/peluditosController');

const mascotasControllerFE = require('../controllers/frontend/mascotasControllerFE');
const peluditosControllerFE = require('../controllers/frontend/peluditosControllerFE');
const publicacionesControllerFE = require('../controllers/frontend/publicacionesControllerFE');

module.exports = function () {

  /** AREA PUBLICA */
  
  router.get('/', homeController.home);

  // Muestra una publicacion mascota
  router.get('/mascota/:slug',
    mascotasControllerFE.mostrarPublicacion,
  );
  // Muestra una publicacion peludito
  router.get('/peludito/:slug',
    peluditosControllerFE.mostrarPublicacion,
  );

  // Muestra Publicaciones por categoria
  router.get('/categoria/mascotas-perdidas',
    mascotasControllerFE.mostrarCategoria,  
  );

  router.get('/categoria/peluditos-perdidos',
    peluditosControllerFE.mostrarCategoria,  
  );

  router.get('/categoria/mascotas-encontradas',
    publicacionesControllerFE.mostrarCategoria,  
  );


  /** Crar y confirmar cuentas */  
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', usuariosController.crearNuevaCuenta);
  router.get('/confirmar-cuenta/:correo',usuariosController.confirmarCuenta);

  
  // Iniciar sesión
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
  router.post('/iniciar-sesion', authController.autenticarUsuario);

  // Cerrar Sesión
  router.get('/cerrar-sesion',
    authController.usuarioAtenticado,
    authController.cerrarSesion,
  );

  /**  AREA PRIVADA */

  /** Panel de Administración */
  router.get('/administracion',authController.usuarioAtenticado ,adminController.panelAdministracion);

  /** Nuevas publicaciones */  
  // Mascotas perdidas
  router.get('/mascota-perdida',
    authController.usuarioAtenticado,
    mascotasController.formNuevaPublicacion
  );
  router.post('/mascota-perdida',
    authController.usuarioAtenticado,
    mascotasController.sanitizarPublicacion,
    mascotasController.subirImagen,
    mascotasController.crearPublicacion
  );
  // peluditos perdidos
  router.get('/peludito-perdido',
    authController.usuarioAtenticado,
    peluditosController.formNuevaPublicacion
  );
  router.post('/peludito-perdido',
    authController.usuarioAtenticado,
    peluditosController.sanitizarPublicacion,
    peluditosController.subirImagen,
    peluditosController.crearPublicacion
  );

  /** Editar Publicaciones */
  // Mascotas perdidas
  router.get('/editar-publicacion-mascota/:mascotaId',
    authController.usuarioAtenticado,
    mascotasController.formEditarPublicacion,
  );
  router.post('/editar-publicacion-mascota/:mascotaId',
    authController.usuarioAtenticado,
    mascotasController.subirImagen,
    mascotasController.editarPublicacion,
  );
  //Peluditos perdidos
  router.get('/editar-publicacion-peludito/:peluditoId',
    authController.usuarioAtenticado,
    peluditosController.formEditarPublicacion,
  );
  router.post('/editar-publicacion-peludito/:peluditoId',
    authController.usuarioAtenticado,
    peluditosController.subirImagen,
    peluditosController.editarPublicacion,
  );

  /** Editar Estado de la Publicación */
  // Mascotas perdidas
  router.get('/estado-mascota/:mascotaId',
    authController.usuarioAtenticado,
    mascotasController.formEditarEstado,
  );
  router.post('/estado-mascota/:mascotaId',
    authController.usuarioAtenticado,    
    mascotasController.editarEstado,
  );
 
  //Peluditos perdidos
  router.get('/estado-peludito/:peluditoId',
    authController.usuarioAtenticado,
    peluditosController.formEditarEstado,
  );
  router.post('/estado-peludito/:peluditoId',
    authController.usuarioAtenticado,    
    peluditosController.editarEstado,
  );

  /** Eliminar Publicaciones */
  router.get('/eliminar-mascota/:mascotaId',
    authController.usuarioAtenticado,
    mascotasController.formEliminarPublicacion,
  )
  router.post('/eliminar-mascota/:mascotaId',
    authController.usuarioAtenticado,
    mascotasController.eliminarPublicacion,
  )
  //Peluditos perdidos
  router.get('/eliminar-peludito/:peluditoId',
    authController.usuarioAtenticado,
    peluditosController.formEliminarPublicacion,
  );
  router.post('/eliminar-peludito/:peluditoId',
    authController.usuarioAtenticado,
    peluditosController.eliminarPublicacion,
  );

  /** Editar Informacion del perfil */
  router.get('/editar-perfil',
    authController.usuarioAtenticado,
    usuariosController.formEditarPerfil,
  );
  router.post('/editar-perfil',
    authController.usuarioAtenticado,
    usuariosController.editarPerfil,
  );

  /** Modifica el Password */
  router.get('/cambiar-password',
    authController.usuarioAtenticado,
    usuariosController.formCambiarPassword,
  );
  router.post('/cambiar-password',
    authController.usuarioAtenticado,
    usuariosController.cambiarPassword,
  );
  
  /** Imagen de Perfil */
  router.get('/imagen-perfil',
    authController.usuarioAtenticado,
    usuariosController.formSubirImagenPerfil,
  );

  router.post('/imagen-perfil',
    authController.usuarioAtenticado,
    usuariosController.subirImagen,
    usuariosController.guardarImagenPerfil,
  );

  return router;
};
