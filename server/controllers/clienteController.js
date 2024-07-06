const Clientes = require('../models/Clientes');

// Agrega un nuevo cliente
exports.nuevoCliente = async (req, res, next) => {
    const cliente = new Clientes(req.body);

    try {
        // Almacenar registro
        await cliente.save();
        res.status(201).json({ mensaje: 'Se agregó un nuevo cliente' });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ mensaje: 'Error al agregar el cliente'});
        next(error);
    }
}

// Muestra todos los clientes
exports.mostrarClientes = async (req, res, next) => {
    try {
        // Buscamos y mostramos todos los clientes
        const clientes = await Clientes.find({});
        res.json(clientes);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ mensaje: 'Error al mostrar los clientes'});
        next(error);
    }
}

// Muestra un cliente por su ID
exports.mostrarCliente = async (req, res, next) => {
    try {
        const cliente = await Clientes.findById(req.params.idCliente);

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Ese cliente no existe' });
        }
        // Mostrar cliente
        res.json(cliente);
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ mensaje: 'Error al buscar el cliente' });
        next(error);
    }
}

// Actualiza un cliente por su ID
exports.actualizarCliente = async (req,res,next) =>{
    try {
        const cliente = await Clientes.findOneAndUpdate({ _id : req.params.idCliente}, 
            req.body, {
                new : true
        });

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Ese cliente no existe, no se puede actualizar' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar el cliente'});
        next(error);
    }
}

// Eliminar cliente por ID
exports.eliminarCliente = async ( req, res, next) => {
    try {
        await Clientes.findOneAndDelete({ _id : req.params.idCliente});
        res.json({mensaje : 'El cliente se ha eliminado'});
    } catch (error) {
        console.log(error);
        next();
    }
}




 