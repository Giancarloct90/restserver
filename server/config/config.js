// nuestra app tendra dos entornos uno de desarollo y uno de produccion
// en dichos entornos hay muchas varibles que van a cambiar dependiendo del servidor o si estamos en nuestra pc
// un ejemplo el puerto en donde esta corriendo nuestro servidor web
// en este caso estamos asignando el valor del puerto en esta variable, si process tiene un valor que se lo asigne a process
// y si no que le asigne 3000 por defecto,
process.env.PORT = process.env.PORT || 3000;



//+++++++++++++++++++++++
//    ENTORNO;
// ++++++++++++++++++++++


// esto es una variable que establece heroku, si tiene algo la variable esto nos quiere decir que esta corriendo en heroku
// si esta variable no existe vamos a suponer que estamos en desarollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// aqui estamos poniendo el url que se va usar dependiendo de que entorno nos encontremos
// si la varible process.env.NODE_ENV tiene algo es que quiere decir que nos encontramos en heroku
// si tiene dev es que nos encontrmoa en desarollo y dependiendo de lo que tenga se le asigna a la varible
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    // este es el url que obtuvimos de la db creada en mongodb atlas
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;



// ==========================
// Fecha de vencimiento
//===========================
// este es el timepo de caducidad de nuestros token, en esta ocacion le pusimos 48h
process.env.CADUCIDAD_TOKEN = '48h';


// ==========================
// SEED de autentificacion
//===========================
process.env.SEED = process.env.SEED || 'este-es-el-seed-produccion';



// ==========================
// Google Client ID
//===========================
// este es el cliente id de nos proporciona google para poder usar su API de GoogleSignIn
process.env.CLIENT_ID = process.env.CLIENT_ID || '192797068814-48nal9pou1fp89ooadntp8ha6jor0qer.apps.googleusercontent.com';