const Sequelize = require('sequelize');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const Usuarios = require('./Usuarios');
const slug = require('slug');
const shortid = require('shortid');

const PeluditosPerdidos = db.define('peluditos',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },  
    sexo: {
        type: Sequelize.STRING(6),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Seleccione el sexo del peludito'
            },
            notNull: {
                msg : 'Seleccione el sexo del peludito'
            }         
        }        
    },
    raza: Sequelize.STRING(30),
    color: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Ingrese el color del peludito'
            },
            notNull: {
                msg : 'Ingrese el color del peludito'
            }         
        }        
    },      
    telefono: Sequelize.STRING(50),
    tamano: {
        type: Sequelize.STRING(7),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Seleccione el tamaño del peludito'
            },
            notNull: {
                msg : 'Seleccione el tamaño del peludito'
            }         
        }        
    },
    hora : {
        type : Sequelize.TIME, 
        allowNull : false,
        validate : {
            notEmpty : {
                msg : 'Agrega la hora en que se vio al peludito'
            }
        }
    }, 
    publicacion: {
        type : Sequelize.DATE, 
        allowNull : false,        
    },
    descripcion: Sequelize.TEXT,  
    direccion:{
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
            notEmpty : {
                msg : 'Agrega una direccion aproximada'
            }
        }
    }, 
    imagen: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Suba una imagen del peludito'
            }, 
            notNull: {
                msg: 'Suba una imagen del peludito'
            }                               
        }        
    },  
    ubicacion: {
        type: Sequelize.GEOMETRY('POINT'),
    },
    estado: {
        type : Sequelize.STRING(10), 
        allowNull : false,        
        defaultValue: 'perdido'
    }, 
    slug: {
        type: Sequelize.STRING,
    }    
},{
    hooks:{
        async beforeCreate(publicacion){
            const detalle = `${publicacion.raza} ${publicacion.sexo}`;
            const url = slug(detalle).toLowerCase();
            publicacion.slug = `${url}-${shortid.generate()}`
        }
    }
});

PeluditosPerdidos.belongsTo(Usuarios);

module.exports = PeluditosPerdidos;