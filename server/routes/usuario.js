const express = require('express');
const app = express();

//aqui lo que estamos haciendo es mandar a llamar el paquete para poderlo usar
const bcrypt = require('bcrypt');

const _ = require('underscore')

// aqui estamos haciendo el require del modelo usuario para poder usar el usario que esportamos en este archivo que aqui indicamos
// por convencion de sintaxis ponemos la primera letra en mayuscula para indicar que instanciaremos objetos a partir de esta variable
const Usuario = require('../models/usuario');

// estos son los midleware que estamos usando para que maneje nuestra apliacion
// las peticiones que manjean nuestra app
app.get('/usuario', function (req, res) {
    res.json('get usuario')
})

app.post('/usuario', function (req, res) {
    //esta es la variable body que es resultado del bodyparser
    // con este bodyparser lo que obtenemos son los valores del form de donde nos esten mandando la peticion
    //  ejemplo mandan una peticion con un form lleno de datos con el body parser estamo obteniendo esos datos de ese form
    // y lo estamos almacenando en la varible body en forma de json y asi obtenemos la datos que vienen del form de esa pagina
    let body = req.body;

    // instancimos un objeto de tipo Usuario(), luego en un objeto le mandamos lo valores que vienen de form que ya previmente sabemos como obtenerlos
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        // hashsync sirve para que haga un de una manera sincrona, que no use un callbackk o promesa o nada de eso
        // que lo haga directamente, el segundo parametro es el numero de vueltas que se le aplicara al has, con un 10 bastara
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // para guardar la informacion, hacemos lo siguiente, ejecutamos la funcion save, que asu vez recibe un callback que recibe dos parametros,
    // err es para verificar si hay un error y usuarioDB nos sirve para poder ver el usuarioDB que se acaba de guardar. 
    usuario.save((err, usuarioDB) => {
        if (err) {

            //con este return lo que estamos haciendo es que le estamos enviando uns respuesta luego de que ingreso una peticion
            // dicha respuesta, consta de la ejecucion de la funcion status, esta funcion recibe un parametro entero, es un codigo
            // ya existe una lista de codigo, el numero varia dependiendo de lo que querramos decir, ejemplo el numero 200, quiere decir que todo salio bien
            // el 400 que hubo un problema, la numeracion es un standard que se usa
            return res.status(400).json({
                ok: false,
                err
            });

        }
        //usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensaje: `el nombre es necesario`
    //     });
    // } else {
    //     res.json({
    //         body
    //     });
    // }
})

// es una actulizacion de registro, obtendremo el id de un registro y si existe lo actualizamos
app.put('/usuario/:id', function (req, res) {
    // de esta manera obtenemos el id que viene en el link 
    let id = req.params.id;
    // con este comando obtenemos todo el form que nos envian
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // usamos un metodo de nuestro modelo previamnete creado, que se llama findOneAndUpdate, que recibe 4 parametros en este caso
    // el primer parametro es el id, que lo va a buscar en la base de datos y si existe vaa seguir con la modificacion,
    // el segundo parametro es el body es los nuevos datos que recibimos del frontend, el tercer parametro son unas opciones de la funcion findOneAndUpdate, 
    // en el tercer parametro nosotros les estamos enviando un objeto con la propiedad new igual a true, esto nos sirve para que nos regrese el nuesvo objeto que modifico
    //el 4to parametro es un callback que recibe dos parametros, el error en caso de ue suceda un error y el objeto modificado si lo modifico.
    Usuario.findOneAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,

            });
        }
        res.json({
            ok: true,
            usuarioDB
        });
    })
})

app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
})

module.exports = app;