const { Schema, model } = require("mongoose");

const RechazoSchema = Schema({
    momento_rechazo: {
        type: String,
    },
    descripcion: {
        type: String
    },
    ref_empleado:{
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        require: true
    },
    ref_neumatico:{
        type: Schema.Types.ObjectId,
        ref: 'Neumatico',
        require: true
    }
 
})

RechazoSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.rid = _id
    return object;
})

module.exports = model('Rechazo', RechazoSchema)