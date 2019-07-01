const express = require('express');
const app = express();
const Categoria = require('../models/categorias.js');

const _ = require('underscore');

const {
    verificarToken,
    verificaAdmin_Role
} = require('../middlewares/autentificacion')

//==========================
// Obtener todos las Categorias
//==========================
app.get('/categoria', [verificarToken], (req, res) => {
    Categoria.find({}).exec((err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        Categoria.countDocuments({}, (err, conteo) => {
            res.json({
                ok: true,
                categorias,
                conteo
            });
        });
    });
});


//==========================
// Mostrar una categoria por id
//==========================
// app.get('/categoria:id', {
//     verificarToken
// }, (req, res) => {
//     let id = req.body.id
//     Categoria.findById(id, ).exec((err, categoria) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }
//         res.json({
//             ok: true,
//             categoria
//         });
//     });

// });

//==========================
// Insertar una categoria nueva
//==========================
app.post('/categoria',
    verificarToken, (req, res) => {
        let body = req.body;

        categoria = new Categoria();

        categoria.descripcion = body.descripcion;
        categoria.usuario = req.usuario._id;

        categoria.save((err, categoriaDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });

    });


//==========================
// Actualizar uan categoria
//==========================
app.put('/categoria/:id', [verificarToken,
    verificaAdmin_Role
], (req, res) => {
    let id = req.params.id;

    // con la funcione pick lo que estamos haciendo es que regresa, un objeto pero solo con la propiedades que nosotros le estamos espicificando
    // el primer parametro es el objeto que queremos que nos devuelva
    // el segundo parametro son las propiedades del objeto que queremos que nos devuelva
    //let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let body = req.body;

    Categoria.findOneAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });

});


//==========================
// Borrar una categoria
//==========================
app.delete('/categoria/:id', [verificarToken, verificaAdmin_Role],
    (req, res) => {
        let id = req.params.id;
        Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoriaDB
            });
        });

    });

module.exports = app;