const mongoose = require('mongoose');
// requerimos de este paquete para poder poder usar el validador de que sea unico
const uniqueValidator = require('mongoose-unique-validator');

// en este archivo estamos creando el esquema de usuario
// aqui se crea algo asi como el esquema de la tabla que va en la base de datos
// requerimos el paquete de mongoose, creamos una variable que se la inicializamos
// con una funcion del objeto mongoose. luego inicializamos un variable con de tipo esquema
// que en su interior tiene un objeto con la propiedades de la tabla
let Schema = mongoose.Schema;

// lo que se pretende hacer con esto es crear una lista de valores unicos, que puede tener este campo en la database
// aqui se crea un objeto que una de sus propiedades es un array con los valores que deberia de tener este campo en la db,
// seguido de un msj, si por alguna razon no se inserta una de estos valores previmente definidos, arroja este error, {value}, no es un rol
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    // ejemplo el nombre que es de tipo String y obligatorio
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        // dentro de la creacion del esquema definimos que sea unique,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'El Passowrd es necesario']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// en la parte de abajo definimos que nuestro esquema use un plugin, en este caso usara el plugin, de mongoose validator,
// para poder decirle a nodej que nuestro esquema use un plugin, es corriendo esta funcion .plugin, esta funcion recibe dos parametro
// una es el plugin en este caso el uniqueValidator que es una constante que inicializamos con el require de mongooseuniquevalidator
// el otro parametro es un objeto con con una propiedad message y donde ponemos el error
usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});

// al final necesitamos exportar este modelo y el nombre que le daremos a este modelo
// en este caso caso este modelo se llama usuario y contiene todas la propiedades del usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);