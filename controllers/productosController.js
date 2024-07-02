const Productos= require('../models/Productos');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, __dirname + '../../uploads/');
        },
        filename: (req, file, cb) => {
            const extension = file.mimetype.split('/')[1];
            cb(null, `${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req, file, cb) {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            cb(null, true);
        } else {
            cb(new Error('Formato no válido'))
        }
    }
}

// Pasar la configiguración y el campo
const upload = multer(configuracionMulter).single('imagen');

// Sube un archivo
exports.subirArchivo = (req, res, next) => {
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error })
        }
        return next();
    })
}


// agrega nuevo producto

exports.nuevoProducto = async (req, res, next)  => {
    const producto = new Productos(req.body);
    try {
        if(req.file.filename){
            producto.imagen = req.file.filename
        }
        // Almacenar registro
        await producto.save();
        res.status(201).json({ mensaje: 'Se agregó un nuevo producto' });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ mensaje: 'Error al agregar el producto'});
        next(error);
    }
}
