const { Schema, model } = require("mongoose");

const SucursalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    telefono: {
        type: Number,
        required: true
    }
 
})

SucursalSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.sid = _id
    return object;
})

module.exports = model('Sucursal', SucursalSchema)