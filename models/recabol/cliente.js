const { Schema, model } = require("mongoose");


const ClienteSchema = Schema({

    ci: {
        type: Number,
        required: true
    },
    //!nombre-apellidos
    nombre_apellidos: {  
        type: String,
        required: true,
    },
    celular: {
        type: Number,
        required: true,
    },
    fecha_creacion:{
        type: Date,
        required: true
    },
    //TODO: controlar helpers
    cliente_frecuente:{
        type: Number,
        default: 1,
    } 

})

ClienteSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.cid = _id
    return object;
})

module.exports = model('Cliente', ClienteSchema)