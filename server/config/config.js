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
    urlDB = 'mongodb+srv://root:4Yodvwi4CvXSTktP@cluster0-8pm3c.mongodb.net/cafe'
}

process.env.URLDB = urlDB;