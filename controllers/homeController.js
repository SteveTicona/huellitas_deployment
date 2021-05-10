const Usuarios = require('../models/Usuarios');
const Mascotas = require('../models/MascotasPerdidas');
const Peluditos = require('../models/PeluditosPerdidos');
const moment = require('moment');

exports.home = async (req, res) => {
  const consultas = [];

  consultas.push(Mascotas.findAll({
      where: {
        estado: 'perdido'
      },
      attributes:  ['slug','mascota','publicacion','imagen'],
      limit: 3,
      order: [
        ['publicacion','DESC']
      ],
      include : [
        {
          model : Usuarios,
          attributes : ['nombre','imagen']
        }
      ]
  }));

  consultas.push(Peluditos.findAll({
      where: {
        estado: 'perdido'
      },
      attributes:  ['slug','publicacion','imagen'],
      limit: 3,
      order: [
        ['publicacion','DESC']
      ],
      include : [
        {
          model : Usuarios,
          attributes : ['nombre','imagen']
        }
      ]
  }));

  const [mascotas , peluditos] = await Promise.all(consultas);

  // console.log(mascotas);
  // console.log(mascotas.length);
  res.render('home', {
    nombrePagina: 'Inicio',
    mascotas,
    peluditos,
    moment,
  });
};
