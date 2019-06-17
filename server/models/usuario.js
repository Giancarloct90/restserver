const mongoose = require('mongoose');
// en este archivo estamos creando el esquema de usuario
// aqui se crea algo asi como el esquema de la tabla que va en la base de datos
// requerimos el paquete de mongoose, creamos una variable que se la inicializamos
// con una funcion del objeto mongoose. luego inicializamos un variable con de tipo esquema
// que en su interior tiene un objeto con la propiedades de la tabla
let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    // ejemplo el nombre que es de tipo String y obligatorio
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
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
        default: 'USER_ROLE'
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

// al final necesitamos exportar este modelo y el nombre que le daremos a este modelo
// en este caso caso este modelo se llama usuario y contiene todas la propiedades del usuarioSchema
module.exports = mongoose.model('Usuario', usuarioSchema);