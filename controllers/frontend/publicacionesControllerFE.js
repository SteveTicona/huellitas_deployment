const Mascotas = require('../../models/MascotasPerdidas');
const Peluditos = require('../../models/PeluditosPerdidos');
const Usuarios = require('../../models/Usuarios');
const moment = require('moment');

// Muestra las publicaciones de las mascotas perdidas
exports.mostrarCategoria = async (req ,res) => {
    const consultas = [];
    consultas.push(Mascotas.findAll({ 
        where: {
            estado: 'encontrado'
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
    }));
    consultas.push(Peluditos.findAll({
        where: {
            estado: 'encontrado'
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
    }));   
    
    const [mascotas , peluditos] = await Promise.all(consultas);

    res.render('mascotas-encontradas',{
        nombrePagina: 'Mascotas Reencontradas con sus dueños',
        mascotas,
        peluditos,       
        moment,
    })
}
