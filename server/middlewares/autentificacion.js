const jwt = require('jsonwebtoken');

//====================
// let verifica token
//====================

// este es un middleware, que basicamente lo que hace es verificar la firma de nuestro token
// verificarToken es una funcion que recibe 3 parametros req y res, son parametros que vienen de la funccion get

let verificarToken = (req, res, next) => {
    // con este codigo estamos obteniendo el token que viene en los headers
    let token = req.get('token');
    // la funcion verify, recibe el parametros
    // 1 parametro: es el token que obtenemos que nos envia la peticion
    // 2 parametro: es la firma que nosotros creamos o usamos,
    // 3 parametro: es la funcion anonima con la que con la que manejamos el error y el resultado de la veriifiacion de firma
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }
        // en este punto no existe ningun error y aqui proseguimos, en el req.usuario le asignamos el usuario o el payload del token
        // con la funcion next hacemos que el el metodo get siga con el control en la pagina de usuario
        req.usuario = decoded.usuario
        next();
    });
    // res.json({
    //     token
    // });
};


//====================
// verifica adminrole
//====================

// el onjetivo de esta funcion es verificar de que tipo de role tiene la persona que se loguio para ver si tiene permisos de insertar usuarios
// obtenemos la informacion del usuario en la funcion verificarToken, luego le ponemos una condicion para ver si es admin o user normal
// solo los admin podran insertar en la bd
let verificaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'USER_ROLE') {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es Admin'
            }
        });
    }
    //   res.json({
    //       ok:true,
    //       msj: {
    //          message: 'este chavalo si puede insertar usuario en la db'
    //       }
    //  })
    next();
};



//==========================
// Verifica Token para imagen
//==========================
// con esta funcion lo que estamos haciendo es verificando el token que viene a travez de url
let verificaTokenImg = (req, res, next) => {

    // obtenemos el valor del token que viene en una variable en el url, y lo almacenamos en la variable token
    let token = req.query.token;
    // aqui estamos usando la libreria jwt.
    // para poder verificarlo usamos la variable verify, que viene en el paquete de jwt, recibe 3 parmetros
    // 1 parametro, el token que obtuvimos del url, el cual contiene toda la informacion
    // 2 parametro, es el seed o firma con el cual fue creado el token, en este caso se necesita para poder compararlo con el que trae el token que obtuvimos  en el url
    // 3 parametro es un callback con el cual manejamos el resultado que nos arroja esta funcion. ya sea un error o un decoed que contiene el payload del token,
    // en este caso el payload contiene informacion de usuario
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Token no es valido'
                }
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

module.exports = {
    verificaTokenImg,
    verificarToken,
    verificaAdmin_Role
}