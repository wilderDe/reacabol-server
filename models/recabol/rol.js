const { Schema, model } = require("mongoose");

const RolSchema = Schema({

    nombre_rol: {
        type: String,
        enum: ['ADMIN', 'OPERARIO', 'RECOLECTOR', 'SECRETARIO'],
        required: true
    },
    descripcion: {
        type: String
    }
})

RolSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.rid = _id
    return object;
})

module.exports = model('Rol', RolSchema)