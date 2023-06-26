const { Schema, model } = require("mongoose");


const TipoTrabajoSchema = Schema({

    nombre_trabajo: {
        type: String,
    },
    costo: {  
        type: Number,
    }

})

TipoTrabajoSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.tpid = _id
    return object;
})

module.exports = model('TipoTrabajo', TipoTrabajoSchema)