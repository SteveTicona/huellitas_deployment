const Peluditos = require('../../models/PeluditosPerdidos');
const Usuarios = require('../../models/Usuarios');
const moment = require('moment');

exports.mostrarPublicacion = async (req, res) => {
    const peludito = await Peluditos.findOne({
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

    if(!peludito){
        res.redirect('/');
    }

    // Pasar resultado hacia la vista
    res.render('mostrar-publicaion-peludito',{
        nombrePagina: 'Peludito Perdido',
        peludito,
        moment,
    });
}

exports.mostrarCategoria = async (req ,res) => {
    const peluditos = await Peluditos.findAll({
        where: {
            estado: 'perdido'
        },
        attributes:  ['slug','publicacion','imagen','estado'],     
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
    if(!peluditos){
        res.redirect('/');
    }

    // Pasar resultado hacia la vista
    res.render('categoria-peluditos',{
        nombrePagina: 'Publicaciones Peluditos Perdidos',
        peluditos,
        moment,
    });
}