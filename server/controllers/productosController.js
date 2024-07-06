const Productos= require('../models/Productos');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const path = require('path');

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


// Muestra todos los productos
exports.mostrarProductos = async (req, res, next) => {
    try {
        // Buscamos y mostramos todos los clientes
        const productos = await Productos.find({});
        res.json(productos);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ mensaje: 'Error al mostrar los productos'});
        next(error);
    }
}


// Muestra un producto por su ID
exports.mostrarProducto = async (req, res, next) => {
    try {
        const producto = await Productos.findById(req.params.idProducto);

        if (!producto) {
            return res.status(404).json({ mensaje: 'Ese producto no existe' });
        }
        // Mostrar cliente
        res.json(producto);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ mensaje: 'Error al buscar el producto' });
        next(error);
    }
}

// Actualiza un producto por su ID

exports.actualizarProducto = async (req, res, next) => {
    try {

        // Construir nuevo producto
        let nuevoProducto = req.body;

        // Verificar si hay imagen nueva
        if (req.file) {
            nuevoProducto.imagen = req.file.filename;
        } else {
            let productoAnterior = await Productos.findById(req.params.idProducto);
            nuevoProducto.imagen = productoAnterior.imagen;
        }

        let producto = await Productos.findOneAndUpdate({_id : req.params.idProducto}, 
            nuevoProducto, {
                new : true,
            }
        );
        res.json(producto);
        
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar el producto'});
        next(error);
    }
}

// Eliminar producto por ID
exports.eliminarProducto = async (req, res, next) => {
    try {
        // Encuentra el producto por ID
        const producto = await Productos.findById(req.params.idProducto);
        
        if (!producto) {
            return res.status(404).json({ mensaje: 'Producto no encontrado' });
        }

        // Elimina el producto de la base de datos
        await Productos.findByIdAndDelete(req.params.idProducto);

        // Obtén la ruta de la imagen y elimina el archivo
        const imagePath = path.join(__dirname, '..', 'uploads', producto.imagen); 
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.log('Error al eliminar la imagen:', err);
                return res.status(500).json({ mensaje: 'Error al eliminar la imagen del servidor' });
            }
            res.json({ mensaje: 'El producto y su imagen se han eliminado' });
        });
    } catch (error) {
        console.log(error);
        next();
    }
}