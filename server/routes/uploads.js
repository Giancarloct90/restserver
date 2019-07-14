const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario')
const Producto = require('../models/productos');
// filesystem nos sirve para poder manipular archivos del sistema
const fs = require('fs');
// con esta libreria nos sirve para poder crear un path, para poder crear un path y poder manipular los archivos de una forma mas facil
const path = require('path');

// cuando nosotros llamamos la funcion fileUploads todos los archivos que se carguen
// caen dentro de la funcion req.files
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {

    // aqui estamos obteniendo el id, y el tipo de instruccion que queres hacer
    let tipo = req.params.tipo;
    let id = req.params.id;

    // con la funcion fileUploads estamos cargando los archivos a la variable files
    // Si no hay archivos entra al if, y manda un msj que dice no hay archivos cargados
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No viene ningun archivo'
            }
        });
    }

    // Validar tipos
    // estamos veirfianco que los tipos sean validos
    let tiposValidos = ['productos', 'usuarios'];
    // con un indexOf recorremos el arreglo en busqueda de algo parecido al parametro que le estamos pasando
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(',')
            }
        });
    }


    // Aqui estamos guardando en la var sampleFiles lo que viene del frontend
    // la propiedad archivo es como lo nombramos en al frontend
    let archivo = req.files.archivo;


    // split es una funcion para array, basicamente lo que hace es partir un string, lo parte con el signo que querramos o donde querramos
    // luego de partirlo lo almacena en forma de string 
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];
    const extensionesValidas = ['png', 'jpg', 'jpeg'];

    // con la funcion indexOf buscamos algo dentro del arreglo y le enviamos el parametro de lo que queremos encontrar dentro del arreglo
    // con un resultado que encuentre dentro del arreglo esto devolvera 1, si no encuntra nada devolvera -1
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                // con la funcion join unimos un arreglo pero con el parametro que recibe le estamos indicando a la funcion con que queremos que se una
                // ya sea una espacio o coma o punto
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(','),
                ext: extension
            }
        });
    }

    // Cambiar nombre del archivo
    // aqui le estamos poniendo el nombre al archivo, que lleva 3 componentes
    // 1 es el id que se esta recibiendo desde el frontend, 
    // 2 son los milisegundo del momento que ese esta subiendo el archivo
    let nombreArchivoFinal = `${id}-${ new Date().getMilliseconds()}.${extension}`;

    // aqui estamos guardando el archvio, recibimos dos parametros
    // 1 parametro el el path o nombre del archivo
    // 2 parametro es el callback para manejar el errors
    archivo.mv(`uploads/${tipo}/${nombreArchivoFinal}`, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // aqui la imagen ya se cargo, 
        // aqui vamos a elegir si actulizamos la coleccionde usuario o productos
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivoFinal);
        } else {
            imagenProducto(id, res, nombreArchivoFinal);
        }


    });
});

function borrarArchivo(nombreImagen, tipo) {

    // para poder crear un path valido necesitamos ejecutar la funcion resolve que se encuentra en le objeto path
    // cada parametro que recibe el resolve es para la reconstruccion de un path valido
    // creo que el __dirname nos lleva a donde esta siendo llamado el path, luego con lo siguiente nos situamos en la carpeta de las imagenes
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    // con la funcion existsSync retorna un true si existe la imagen y usamos el que lleva Sync por que este ejecuta la funcion sim callback y asi lo necesitamos en este caso    
    if (fs.existsSync(pathImagen)) {
        // si existe la iamgen la borramos con la funcion unlickSync con la que deice Sync para poderlo hacer de manera asincrona
        fs.unlinkSync(pathImagen);
    } else {
        console.log('No se borro ninguna img');
        console.log(tipo);
        console.log(nombreImagen);

    }
}

// con esta funcion lo que estamos haciendo que actulizaremos la imagen que el usuario ya tiene
// recibimos 3 paremtros
// 1 parametro es el id del usuario que queremos modificar
// 2 parametro es el res, es con el cual se esta manejando la respuesta en la parte de arriba donde es llamada esta funcion
// 3 parametro es el nombre de la imagen en este caso, en este punto del codigo la imagen ya esta guardada en el filesystem 
// nosotros no estamos guardando la imagen en la base de datos lo que estamos guardando es el nombre de la imagen para luego poder llamarla y usarla
function imagenUsuario(id, res, nombreArchivoFinal) {
    // esta funcion la estamos usando para poder saber si el usuario existe en la db, el resultado que nos arroje dicha funcion lo manejaremos con mongoose
    Usuario.findById(id, (err, usuarioDB) => {
        // si existe un error es un error en el servidor
        if (err) {
            borrarArchivo(nombreArchivoFinal, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        // con este if sabremos si el usuario no existe en la db y si no existe en la db,
        // mandamos a llamar a la funcion que borra la imagen del filesystem por que en este punto la imagen ya esta guardada en el filesystem
        if (!usuarioDB) {
            borrarArchivo(nombreArchivoFinal, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el usuario no existe'
                }
            });
        }

        // en este punto quiere decir que el usuario existe en la db y procedemos a borrar la imagen que el usuario ya tiene si es que tiene,
        // si el usuario no tiene imagen simplemente no hara nada
        // si existe una imagen del usaurio en el filesystem, se procede a borrar la imagen, con la imagen que tiene el usuario en la db,
        // luego simplemente se actuliza la coleccion con el nombre de la nueva imagen
        borrarArchivo(usuarioDB.img, 'usuarios');
        usuarioDB.img = nombreArchivoFinal;
        usuarioDB.save((err, usuarioActulizado) => {
            res.json({
                ok: true,
                usuario: usuarioActulizado,
                img: nombreArchivoFinal
            });
        });
    });
}


// con la funcion producto imagenProducto lo que hacemos es actulizar la imagen de nuestra coleccion de productos con una nueva imagen, esta funcion recibe 3 parametros
// 1 parametro es el id con el cual vamos a buscar en nuestra coleccion
// 2 parametro es el objeto de tipo res, si nostros estamos usando este objeto en esta funcion es como que si lo usaramos en donde fue llamada la funcion
// es el nombre del archivo que se acaba de guardar en el fileSystem
// primero instanciamos un objeto de tipo producto con el cual buscamos un usuario por el id que recibimos, y la respuesta de esta busqueda la manejamos con un callback
// luego revisamos si el usuario existe, si existe borramos la imagen que tiene y actulizamos la coleccion y la borramos del filesystem
function imagenProducto(id, res, nombreArchivoFinal) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivoFinal, 'productos');
            res.status(500).json({
                ok: false,
                err: {
                    message: 'Error en el servidor'
                }
            });
        }
        if (!productoDB) {
            borrarArchivo(nombreArchivoFinal, 'productos');
            res.status(400).json({
                ok: false,
                err: {
                    message: 'El id de producto no existe'
                }
            });
        }

        borrarArchivo(productoDB.img, 'productos');
        productoDB.img = nombreArchivoFinal;

        productoDB.save((err, productoDB) => {
            res.status(200).json({
                ok: true,
                producto: productoDB,
                img: nombreArchivoFinal
            });
        });
    });
}

module.exports = app;