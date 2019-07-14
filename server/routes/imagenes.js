const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const {
    verificarToken,
    verificaTokenImg
} = require('../middlewares/autentificacion');

// con esta funcion lo que estamos haciendo es que los usuario puedan ver las imagenes, solo los usuarios que tienen un token valido

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {
    // obtenemos loa prametros que viene en el url
    let tipo = req.params.tipo;
    let img = req.params.img;

    // creamos un path valido, para poder correr esto, y localizar las imagenes que nos piden
    pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

    // con un path valido ya echo, revisamos la existencia del token en nuestro sistema de archivo
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname, `../assets/no-image.jpg`);
        res.sendFile(noImagePath);
    }
})

module.exports = app;