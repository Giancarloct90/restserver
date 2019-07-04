const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuario = require('../models/usuario');

const app = express();


// con este midleware lo que estamos haciendo es verificar si existe el usuario en nuestra base de datos
// lo que hacemos es recibir el email y el password del usuario los guarmos en una variable body
// con la funcion de mongoose llamada findOne buscamos al usuario por su email, y usamos un callback para manejar el error
// luego comprobamos que el usuario no viene vacio que encontro uno si encontro el usuario lo que hacemos despues es verificar el password
// con el bcryp los  que hace es que lo vuelve a encriptar y lo compara con lo que tenemos en la base de datos y si coinciden no hay porblema todo esta bien
app.post('/login', (req, res) => {
    let body = req.body
    Usuario.findOne({
        email: body.email
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contrasenia incorrecto"
                }
            });
        }
        // en esta parte estamos comparando la clave, usamos el bcrypt,
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contrasenia) incorrecto"
                }
            });
        }
        // de esta manera generamos un token, ejecutamos la funcion sign, que recibe 3 parametros
        // 1 parametro: es la informacion que necesitamos guardar en forma de objeto de js
        // 2 parametro: es la firma del token para poder saber si el token es valido
        // 3 parametro: es una varible que tenemos nosotros en nuestro archivo de config, la cual la definimos con 48h
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });

        res.json({
            ok: true,
            usuarioDB,
            token
        });
    });
    // res.json({
    //     ok: true,
    // });
});



// Configuraciones de Google
// con esta funcion verificamos el token y si el token es correcto nos devuelve el payload, 
// el payload en este caso contiene la informacion de del usuario del google y de su cuenta
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // console.log(payload.name);
    // console.log(payload.email);
    // console.log(payload.picture);
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

// en esta parte creamos la patecion post, la cual llamamos desde el frontend, la cual trae el token que necesitamos para poder verificarlos
app.post('/google', async (req, res) => {

    // obtenemos el token de req.body y se lo enviamos al funcion verify previamnete creada por los chicos de google, la cual recibe como parametro
    // el token que recibimos del frontend 
    let token = req.body.idtoken;
    // aqui estamos recibiendo lo que devuelve la promesa verify, lo que devuelve la promesa verify es un objeto con el payload, con la informacion del usuario
    let googleUser = await verify(token).catch((e) => {
        return res.status(403).json({
            ok: false,
            err: e
        });
    });

    // con el comando findone y con la condicion que mandamos en el comando, le estamos preguntando que busque al usuario que se intento logiar
    // 
    Usuario.findOne({
        email: googleUser.email
    }, (err, usuarioDB) => {
        // este if si es true es para verificar un error interno en el servidor
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // aqui estamos validando si el usuario existe o si no existe, si el usuario existe hay que validar si el usuario esta autentificado con google
        if (usuarioDB) {
            // aqui estamos validando si el usuario esta autentificado con goole, 
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autentificacion'
                    }
                });
                // en este caso el usuario esta autentificado con google y simplemente se esta logiando de nuevo
            } else {
                // se le crea el token y se le deja pasar a la siguiente pagina
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                });
            }
        } else {
            // si el usuario no existe en nuestra base de datos
            // instanciamos un objeto de tipo usuario que al principio hicimos la importacion, 
            //dicho objeto tendra todas la funciones y propiedades del modelo de usuario 
            let usuario = new Usuario();
            // luego asignamos los valores del usuario de google a las propiedades del objeto de usuario
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)'

            // usuamos la funcion save para insertar en la base de datos la informacion que contiene el objeto,
            // la funcion save recibe como parametro una funcion anonima que a su vez recibe dos parametros 
            // uno es para manejar el error y el otro paramtro es la informacion que se inserto en la base de datos
            // luego lo guarda en la db y si no hay ningun error generar un token valido, 
            // tambien se dispara un msj para el frontend de que todo se hizo bien y el usuario se inserto y logio perfectamente
            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(50).json({
                        ok: false,
                        err
                    });
                }
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });
                res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            })

        }
    });

});


// de esta manera podremos usar todas las cofniguraciones que le hagamos app que es un funcion de expresss en otras paginas
module.exports = app;