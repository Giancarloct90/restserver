const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        // 3 parametro: es la la fecha de espiracion y esta en milisegundos, 60*60*24*30 son 30 dias 
        let token = jwt.sign({
            usuario: usuarioDB
        },process.env.SEED,{
            expiresIn: 60*60*24*30
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

// de esta manera podremos usar todas las cofniguraciones que le hagamos app que es un funcion de expresss en otras paginas
module.exports = app;