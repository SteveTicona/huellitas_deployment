const MascotasPerdidas = require('../models/MascotasPerdidas');
const PeluditosPerdidos = require('../models/PeluditosPerdidos');
const Usuarios = require('../models/Usuarios');
const moment = require('moment');

exports.panelAdministracion = async (req, res) => {

    const consultas = [];
    consultas.push(MascotasPerdidas.findAll({ 
        where : { usuarioId : req.user.id 
        },        
        order: [
            ['publicacion','DESC']
        ]
    }));
    consultas.push(PeluditosPerdidos.findAll({
         where : {
              usuarioId : req.user.id
         },
         order: [
             ['publicacion','DESC']
         ]
    }));
    consultas.push(Usuarios.findByPk(req.user.id));
    
    const [mascotas , peluditos, usuario] = await Promise.all(consultas);

    res.render('administracion',{
        nombrePagina: 'Panel de Administración',
        mascotas,
        peluditos,
        usuario,
        moment,
    })
}