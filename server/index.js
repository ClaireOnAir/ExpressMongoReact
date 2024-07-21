const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Crear el servidor
const app = express();

// Conectar MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/restapis');

// Habilitar bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Habilitar CORS
app.use(cors({
    origin: 'http://localhost:3000' // Cambia esto a la URL de tu frontend
}));

// Rutas de la app
app.use('/', routes());

// Carpeta pública para las imágenes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Puerto donde va a funcionar
app.listen(5000, () => {
    console.log('Servidor funcionando en el puerto 5000');
});



