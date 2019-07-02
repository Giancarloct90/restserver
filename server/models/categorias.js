const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'El nombre es necesario']
    },
    // type Schema.Types.ObjectId eso se usa cuando se necistamos insertar un valor que se encuetra en otro documento
    // ref: es es de que documento pertenece, 
    // basicamente es este campo de usuario lo que le estamos diciendo a mongodb es que el almacenaremos el id de usaurio pero este ya existe en la db
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});


module.exports = mongoose.model('Categoria', categoriaSchema);