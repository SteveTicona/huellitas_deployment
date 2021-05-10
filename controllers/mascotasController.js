const MascotasPerdidas = require("../models/MascotasPerdidas");
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const configuracionMulter = {
    limits :{ fileSize: 10000000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/mascotas/');
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

exports.formNuevaPublicacion = (req, res) => {
    res.render('mascota-perdida',{
        nombrePagina: 'Crea una nueva Publicación',
    })
}

exports.sanitizarPublicacion = (req, res, next) => {
    // Sanitizar  
    req.sanitizeBody('mascota');
    req.sanitizeBody('raza');
    req.sanitizeBody('sexo');
    req.sanitizeBody('color');
    req.sanitizeBody('telefono');
    req.sanitizeBody('fecha');   
    req.sanitizeBody('imagen');  
    req.sanitizeBody('direccion');  
    req.sanitizeBody('lat');  
    req.sanitizeBody('lng');  
    req.sanitizeBody('usuarioId');  
    
    next();
}


// Almacena las publicaciones en la BD
exports.crearPublicacion = async (req, res) => {
    

    const publicacion = req.body;
    const fecha = new Date();

    publicacion.publicacion = fecha;
    publicacion.usuarioId = req.user.id;
    // Almacena la informacion con un point
    const point = { type : 'Point', coordinates: [parseFloat(req.body.lat),parseFloat(req.body.lng)]};
    publicacion.ubicacion = point;
    // leer la imagen
    if(req.file){
        publicacion.imagen = req.file.filename;
    }

    try {
        // Almacenar en la base de datos
        await MascotasPerdidas.create(publicacion);
        req.flash('exito','Se ha creado la publicación correctamente'); 
        res.redirect('/administracion');       
    } catch (error) {
        // console.log(error);      
        if(publicacion.imagen){
            const imagenAnteriorPath = __dirname + `/../public/uploads/mascotas/${publicacion.imagen}`;
            
            // eliminar archivo con filesystem
            fs.unlink(imagenAnteriorPath, (error) => {
                if(error){
                    console.log(error);
                }
                return;
            });
        }
        const erroresSequelize = error.errors.map(err => err.message);
        req.flash('error', erroresSequelize);
        res.redirect('/mascota-perdida');    
    }
}

exports.formEditarPublicacion = async (req, res) => {
    const publicacion = await MascotasPerdidas.findByPk(req.params.mascotaId);
    res.render('editar-publicacion-mascota',{
        nombrePagina: `Editar Publicación : ${publicacion.mascota }`,
        publicacion,
    })
}

// Guarda los cambios en la BD
exports.editarPublicacion = async (req, res, next) => {
    const publicacion = await MascotasPerdidas.findOne({ where : { id : req.params.mascotaId , usuarioId : req.user.id}});
    // Si no existe ese grupo o no es el dueño
    if(!publicacion){
        req.flash('error', 'Operación no Válida');
        res.redirect('/administracion');   
        return next();
    }
    
    const { mascota, raza, sexo, color, telefono, fecha, tamano, hora, descripcion,direccion, lat,lng } = req.body;
    // asignar los valores
    publicacion.mascota = mascota;
    publicacion.raza = raza;
    publicacion.sexo = sexo;
    publicacion.color = color;
    publicacion.telefono = telefono;
    publicacion.fecha = fecha;
    publicacion.descripcion = descripcion;
    publicacion.direccion = direccion;
    publicacion.tamano = tamano;
    publicacion.hora = hora;

    // console.log(publicacion.imagen);
    if(req.file && publicacion.imagen){
        const imagenAnteriorPath = __dirname + `/../public/uploads/mascotas/${publicacion.imagen}`;
        
        // eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error){
                console.log(error);
            }
            return;
        });
    }
    if(req.file){        
        publicacion.imagen = req.file.filename;
    }
    
    const point = { type : 'Point', coordinates: [parseFloat(lat),parseFloat(lng)]};
    publicacion.ubicacion = point;

    // Guardamos en la BD
    await publicacion.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');  
}

// Formulario para agregar o cambiar la imagen
exports.formEditarEstado = async(req, res) => {
    const publicacion = await MascotasPerdidas.findOne({ where : { id : req.params.mascotaId , usuarioId : req.user.id}});
    
    res.render('estado-mascota',{
        nombrePagina: `Editar Estado Mascota :  ${publicacion.mascota}`,
        publicacion,
    });
}

// Modifica la imagen en la BD y elimina la anterior
exports.editarEstado = async (req, res, next) => {
    const publicacion = await MascotasPerdidas.findOne({ where : { id : req.params.mascotaId , usuarioId : req.user.id}});

    publicacion.estado = req.body.estado;

    // guardar en la BD
    await publicacion.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');  
}

// Muestra el formulario para eliminar una publicacion
exports.formEliminarPublicacion = async (req, res, next) => {
    const publicacion = await MascotasPerdidas.findOne({ where : { id : req.params.mascotaId , usuarioId : req.user.id}});

    if(!publicacion){
        req.flash('error', 'Operacion no valida');
        res.redirect('/administracion');
        return next();
    }
    // todo bien ejecutar la vista
    res.render('eliminar-mascota',{
        nombrePagina: `Eliminar Publicación : ${publicacion.mascota}`,

    })

}

/** Elimina la publicacion e imagen */
exports.eliminarPublicacion = async (req, res, next) => {
    const publicacion = await MascotasPerdidas.findOne({ where : { id : req.params.mascotaId , usuarioId : req.user.id}});

    if(!publicacion){
        req.flash('error', 'Operacion no valida');
        res.redirect('/administracion');
        return next();
    }
    
    // Si hay una imagen eliminarla
    if(publicacion.imagen){
        const imagenPath = __dirname + `/../public/uploads/mascotas/${publicacion.imagen}`;
        
        // eliminar archivo con filesystem
        fs.unlink(imagenPath, (error) => {
            if(error){
                console.log(error);
            }
            return;
        });
    }
    // Eliminar el grupo
    await MascotasPerdidas.destroy({
        where:{
            id: req.params.mascotaId
        }
    });

    // Redireccionar al usuario
    req.flash('exito', 'Publicacion eliminada');
    res.redirect('/administracion');  
}