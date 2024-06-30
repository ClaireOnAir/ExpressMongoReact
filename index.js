const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

//Crear el servidor
const app = express();

//Conectar MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/restapis');


// Habilitar boduparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Rutas de la app
app.use('/', routes());

// error handler
app.use(function (err, req, res, next) { // 5XX -> errores internos del servidor, conexión con la base de datos, o errores inesperados
    // 4XX -> errores del cliente, una request mal formada (i.e: le faltan campos, tiene campos de mas), usuario no autorizadom, token expirado, etc...  

    res.status(err.statusCode).json({
        error: err.message,
    });
});


//Puerto donde va a funcionar
app.listen(4000);



