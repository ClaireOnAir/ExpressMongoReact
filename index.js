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
app.use(bodyParser.urlencoded({extended: true}));

//Rutas de la app
app.use('/', routes());

//Puerto donde va a funcionar
app.listen(5000);



