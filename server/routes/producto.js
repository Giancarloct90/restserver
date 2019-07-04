const express = require('express');
const app = express();
const {
    verificarToken
} = require('../middlewares/autentificacion');
const Producto = require('../models/productos');


//==========================
// Buscar Productos
//==========================
app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino;
    // usaremos una expresion regular, creamos una expresion regular con la funcion
    // RegExp que en este caso recibe 2 parametros, 
    //1 parametros: es la string con la cual queremos hacer la expresion regular
    //2 parametros: con la i le estamos diciendo que sea insensible a las mayusculas o minusculas
    let regex = new RegExp(termino, 'i');
    Producto.find({
            nombre: regex
        }).populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status().json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoDB
            });
        });
});


//==========================
// Obtener productos
//==========================
app.get('/producto', verificarToken, (req, res) => {
    Producto.find({
            disponible: true
        })
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoDB
            });
        });
});

//==========================
// Obtener productos con id
//==========================

app.get('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoDB
            });
        });
});

//==========================
// Crear un nuevo producto
//==========================
app.post('/producto', verificarToken, (req, res) => {
    let body = req.body;
    producto = new Producto();

    producto.nombre = body.nombre;
    producto.precioUn = body.precioun;
    producto.descripcion = body.descripcion;
    producto.disponible = true;
    producto.categoria = body.categoria;
    producto.usuario = req.usuario._id;

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: true,
                err,
            });
        }
        res.status(201).json({
            ok: true,
            productoDB
        });
    });
});

//==========================
// Actulizar producto
//==========================
app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: true,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });
});


//==========================
// Borrar producto
//==========================
// disponible pase a falso
app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndUpdate(id, {
        disponible: false
    }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    });
});


module.exports = app;