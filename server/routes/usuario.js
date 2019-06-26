const express = require('express');
const app = express();

//aqui lo que estamos haciendo es mandar a llamar el paquete para poderlo usar
const bcrypt = require('bcrypt');

const _ = require('underscore')

// de esta manera podremos usar la funciones que existan en el middleware que aqui los requerimos
const {
    verificarToken,
    verificaAdmin_Role
} = require('../middlewares/autentificacion');

// aqui estamos haciendo el require del modelo usuario para poder usar el usario que esportamos en este archivo que aqui indicamos
// por convencion de sintaxis ponemos la primera letra en mayuscula para indicar que instanciaremos objetos a partir de esta variable
const Usuario = require('../models/usuario');

// estos son los midleware que estamos usando para que maneje nuestra apliacion
// las peticiones que manjean nuestra app
// el segundo parametro es un middleware que creamos,
// lo que hace este middleware es que desencadena un serie de acciones cuando hacen un peticion, despues de que se ejecuta todo lo que tiene el middleware
// el control del programa vuelve aqui
app.get('/usuario', verificarToken, (req, res) => {

    // en el siguiente codigo estamos obteniendo todos los datos del modelo usuario
    // aqui estamos obteniendo lo valores que el usaurio manda a travez de link para poder establecer un limite y un desde, ejemplo localhos:3000/usuario/?nombre=jack&&limite=44
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    // con el comando find obtenemos los datos de toda los usuarios, find recibe un condicion {} que significa todos los campos
    // la funcion skip recibe un paramtro entero y quiero decir desde el registro x trae informacion
    // la funcion limit tambien recibe un entero como parametro, y es el limite hasta donde deberia de llegar
    // exec es para que se ejecute y recibe un callback, con un erro o un objeto lleno de objetos que ese encuantran en lad db
    Usuario.find({
        estado: true
    }, 'nombre email role estado google img').skip(desde).limit(limite).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // ejecutando la funcion countDocuments recibimos cuantas registros hay en nuestra coleccion
        Usuario.countDocuments({
            estado: true
        }, (err, conteo) => {
            res.json({
                ok: true,
                usuarios,
                cuantos: conteo
            });
        });
    });
})
// ,[verificarToken, verificaAdmin_Role]
app.post('/usuario',[verificarToken, verificaAdmin_Role], (req, res) => {
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
app.put('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    // de esta manera obtenemos el id que viene en el link 
    let id = req.params.id;
    // con este comando obtenemos todo el form que nos envian

    // underscore es un alibreria que expande las funciones de js, con esta funcion devuelve el objeto solo con los objeto que queremos ver, solo con los objetos que necesitamos
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    // usamos un metodo de nuestro modelo previamnete creado, que se llama findOneAndUpdate, que recibe 4 parametros en este caso
    // el primer parametro es el id, que lo va a buscar en la base de datos y si existe vaa seguir con la modificacion,
    // el segundo parametro es el body es los nuevos datos que recibimos del frontend, el tercer parametro son unas opciones de la funcion findOneAndUpdate, 
    // en el tercer parametro nosotros les estamos enviando un objeto con la propiedad new igual a true, esto nos sirve para que nos regrese el nuesvo objeto que modifico
    // en el tercer parametro donde recibimos opciones para ejecurtar la funcion, podemos poner la opcion runValidator y eso va hacer que las validaciones se corran en este momento las validaciones que pusimo en nuestro modelo
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

// // con el siguiente middleware para poder borrar un registro de nuestra coleccion
// // para esto utilizamos la funcion findByIdAndRemove
// app.delete('/usuario/:id', function (req, res) {
//     //res.json('delete usuario')
//     //con este comando estamos obteniendo el id que viene el url
//     let id = req.params.id;
//     // la funcion findByIdAndRemove recibe en este caso dos parametros el id y un callback
//     // donde manejamos el error o el objeto borrado
//     Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
//         if(err){
//             return res.status(400).json({
//                ok: false,
//                err 
//             });
//         }
//         if(usuarioBorrado === null){
//             return res.status(400).json({
//                 ok: true,
//                 err: {
//                     message: "el usuario no existe"
//                 }
//             });
//         }
//         res.json({
//             ok:true,
//             usuarioBorrado
//         });
//     });
// })

app.delete('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, {
        estado: false
    }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuarioBorrado
        });
    });
});


module.exports = app;