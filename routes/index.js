const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const productosController = require('../controllers/productosController');



module.exports = function(){
    //Agrega nuevos clientes via POST
    router.post('/clientes', clienteController.nuevoCliente);

    // Obtener todos los clientes
    router.get('/clientes', clienteController.mostrarClientes);

    // Muestra un cliente en específico por ID
    router.get('/clientes/:idCliente', clienteController.mostrarCliente);

    // Actualizar cliente
    router.put('/clientes/:idCliente',clienteController.actualizarCliente);

    // Eliminar cliente
    router.delete('/clientes/:idCliente', clienteController.eliminarCliente);



    /** PRODUCTOS */

    // Nuevos productos
    router.post('/productos', 
        productosController.subirArchivo,
        productosController.nuevoProducto);


    // Mostrar todos los los productos
    router.get('/productos', productosController.mostrarProductos);

    // Muestra un producto en específico por ID
    router.get('/productos/:idProducto', productosController.mostrarProducto);

    // Actualizar productos
    router.put('/productos/:idProducto', 
        productosController.subirArchivo,
        productosController.actualizarProducto
    )


    return router;
}


