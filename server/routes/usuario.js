const express = require('express');
const app = express();

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
        password: body.password,
        role: body.role
    });

    // para guardar la informacion, hacemos lo siguiente, ejecutamos la funcion save, que asu vez recibe un callback que recibe dos parametros,
    // err es para verificar si hay un error y usuarioDB nos sirve para poder ver el usuarioDB que se acaba de guardar. 
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
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

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    })
})

app.delete('/usuario', function (req, res) {
    res.json('delete usuario')
})

module.exports = app;