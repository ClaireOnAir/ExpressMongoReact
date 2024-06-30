const Clientes = require('../models/Clientes');

// Agrega un nuevo cliente
exports.nuevoCliente = async(req,res,next) =>{
    const Cliente = new Clientes(req.body);

    try {
        // Almacenar registro
        await Cliente.save();
        res.json({mensaje: 'Se agrego un nuevo cliente'})
    } catch (error) {
        // Si hay un error, console.log y next
        console.log(error);
        next();
        
    }
}


// Muestra todos los clientes
exports.mostrarClientes = async(req,res,next) =>{
    
    try {
        // Buscamos y mostramos todos los clientes
        const clientes = await Clientes.find({})
        res.json(clientes)
    } catch (error) {
        // Si hay un error, console.log y next
        console.log(error);
        next();
        
    }
}