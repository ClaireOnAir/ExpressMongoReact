const CustomError = require('../error');
const Clientes = require('../models/Clientes');
const { emailValidator } = require('./emailValidator');

// Agrega un nuevo cliente
exports.nuevoCliente = async (req, res, next) => {
    const Cliente = new Clientes(req.body);

    const email = Cliente.email;
    try {
        emailValidator(email)
    } catch (error) {
        next(error)
    }

    try {
        // Almacenar registro
        const savedClient = await Cliente.save();
        res.status(200);
        res.json({ id: savedClient._id })
    } catch (error) {
        // Si hay un error, console.log y next
        console.log(error);
        if (error.code == 11000) {
            next(new CustomError("email ya está en uso", 400))
        }
        next(new CustomError("error interno del servidor", 500))
    }
}


// Muestra todos los clientes
exports.mostrarClientes = async (req, res, next) => {

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