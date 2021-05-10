const Mascotas = require('../../models/MascotasPerdidas');
const Usuarios = require('../../models/Usuarios');
const moment = require('moment');

exports.mostrarPublicacion = async (req, res) => {
    const mascota = await Mascotas.findOne({
        where: {
            slug: req.params.slug,
        },
        include: [
            {
                model: Usuarios,
                atributes : ['id','nombre','imagen','estado']
            }
        ]
    });

    if(!mascota){
        res.redirect('/');
    }

    // Pasar resultado hacia la vista
    res.render('mostrar-publicaion-mascota',{
        nombrePagina: mascota.mascota,
        mascota,
        moment,
    });
}

// Muestra las publicaciones de las mascotas perdidas
exports.mostrarCategoria = async (req ,res) => {
    const mascotas = await Mascotas.findAll({
        where: {
          estado: 'perdido'
        },
        attributes:  ['slug','mascota','publicacion','imagen','estado'],       
        order: [
          ['publicacion','DESC']
        ],
        include : [
          {
            model : Usuarios,
            attributes : ['nombre','imagen']
          }
        ]
    });
    if(!mascotas){
        res.redirect('/');
    }

    // Pasar resultado hacia la vista
    res.render('categoria-mascotas',{
        nombrePagina: 'Publicaciones Mascotas Perdidas',
        mascotas,
        moment,
    });
}

