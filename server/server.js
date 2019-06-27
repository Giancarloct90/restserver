require('./config/config');
const express = require('express')
// hacemos el require de mongoose para poder empezarlo a usar
const mongoose = require('mongoose');
const app = express()
const bodyParser = require('body-parser');
const path = require('path');


// parser application/x-www-form-urlencoded
// estos son middleware que cada vez que ejecute el codigo se ejecutara esto
// cada vez que se ejecute el una peticion va a pasar por aqui
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


// esta es la manera correcta de hacer publico los archivos html o nuestra pagina web para que los que visiten nuestro servidor, los puedan ver
app.use(express.static(path.resolve(__dirname,'../public')));

// para poder usar los middleware de usuario tenemos que importar o requerir el archivo route.js
// de esta manera podemos usar los middleware de creamos en el archivo routes.js
//app.use(require('./routes/usuario.js'));

// cuando una peticion web llegue a nuestro servidor el archivo que las recibe o maneja es este,
// con esta linea lo que hacemos es que los middleware que tenemos en el archivo login.js se usen
// o basicamente puedan usarse desde aqui
//app.use(require('./routes/login'));


// al momento de usar muchas rutas tendriamos que ponerlas aqui mandar hacer el requerimiento aqui,
// pero cargariamos mucho el archivo server.js y nuestro objetivo es que el archivo server no este muy cargado de informacion
// lo que estamos haciendo aqui es que creamos un archivo llamado index.js en la raiz de routes, donde estamos haciendo
// donde estamos haciendo el requerimiento de las rutas de esta manera se tiene un archivo aparte para todos los requerimientos de las rutas en un solo archivo
// de esta manera el server se mantine mas prolijo
app.use(require('./routes/index'));

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