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
    // la coleccion categoria tiene el objectid de con el id de la coleccion usuario, es una especie de relacion uno a muchos,
    // en los datos de la coleccion categoria tenemos un is de usuario que hace una especie de referencia a un registro de la coleccion usuario
    // con la funcion populate obtenemos todos los datos de la coleccion de usuario, la funcion populate recibe varios parametros pero en este caso nosotros le estamos mandado dos parametros 
    // 1 parametro: es el nombre de la coleecion de la cual necesitamos inportar los datos
    // 2 parametro: son las propiedades, que queremos que se muestren
    // con la funcion sort, ordenamos la coleccion con la descripcion
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
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
app.get('/categoria/:id', verificarToken,
    (req, res) => {
        let id = req.params.id
        Categoria.findById(id, (err, categoria) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categoria) {
                return re
            }
            res.json({
                ok: true,
                categoria
            });
        });

    });

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
                res.status(500).json({
                    ok: false,
                    err
                });
            }
            // si no se creo la categoria, responda con este msj
            if (!categoriaDB) {
                return res.status(400).json({
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
app.put('/categoria/:id', verificarToken,
    (req, res) => {
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
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!categoriaDB) {
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