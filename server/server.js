require('./config/config');
const express = require('express')
// hacemos el require de mongoose para poder empezarlo a usar
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser');



// parser application/x-www-form-urlencoded
// estos son middleware que cada vez que ejecute el codigo se ejecutara esto
// cada vez que se ejecute el una peticion va a pasar por aqui
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// para poder usar los middleware de usuario tenemos que importar o requerir el archivo route.js
// de esta manera podemos usar los middleware de creamos en el archivo routes.js
app.use(require('./routes/usuario.js'));

// con este comando estamos conectandonos a mongodb, usando la libreria o paquete previmente desarollado mongoose
// recibe dos parametro, un string con de donde se encuentra el servidor de db con su puerto y nombre de base de datos
// y un callback para saber si se ejecuto bien o no, que recibe dos parametros, uno es para manejar el error
// el otro es para manejar la respuesta
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("DataBase Online");
    }
});

// aqui estamos utilizando la var que creamos en config.js
app.listen(process.env.PORT, () => {
    console.log("Escuchando puerto 3000");
});