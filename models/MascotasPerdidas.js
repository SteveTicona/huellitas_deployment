const Sequelize = require('sequelize');
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const Usuarios = require('./Usuarios');
const slug = require('slug');
const shortid = require('shortid');

const MascotasPerdidas = db.define('mascotas',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    mascota: {
        type: Sequelize.STRING(30),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'El nombre de la mascota no puede ir vacio'
            }
        }
    },
    sexo: {
        type: Sequelize.STRING(6),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Seleccione el sexo de su mascota'
            },
            notNull: {
                msg : 'Seleccione el sexo de su mascota'
            }         
        }        
    },
    raza: Sequelize.STRING(30),     
    color: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Ingrese el color de su mascota'
            },
            notNull: {
                msg : 'Ingrese el color de su mascota'
            }         
        }        
    },
    telefono: {
        type: Sequelize.STRING(50),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Ingrese un número de contacto'
            },
            notNull: {
                msg : 'Ingrese un número de contacto'
            }         
        }        
    },   
    tamano: {
        type: Sequelize.STRING(7),
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Seleccione el tamaño de su mascota'
            },
            notNull: {
                msg : 'Seleccione el tamaño de su mascota'
            }         
        }        
    },

    fecha : {
        type : Sequelize.DATEONLY, 
        allowNull : false,
        validate : {
            notEmpty : {
                msg : 'Agrega la fecha en que se perdió la mascota'
            }
        }
    },
    hora : {
        type : Sequelize.TIME, 
        allowNull : false,
        validate : {
            notEmpty : {
                msg : 'Agrega la hora en que se perdió la mascota'
            }
        }
    },    
    publicacion: {
        type : Sequelize.DATE, 
        allowNull : false,        
    },
    descripcion: Sequelize.TEXT, 
    imagen: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty:{
                msg: 'Suba una imagen de la mascota'
            },
            notNull: {
                msg: 'Suba una imagen de la mascota'
            }                     
        }        
    },
    direccion:{
        type: Sequelize.STRING,
        allowNull: false, 
        validate: {
            notEmpty : {
                msg : 'Agrega una direccion aproximada'
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
            const url = slug(publicacion.mascota).toLowerCase();
            publicacion.slug = `${url}-${shortid.generate()}`
        }
    }
}); 

MascotasPerdidas.belongsTo(Usuarios);
module.exports = MascotasPerdidas;
