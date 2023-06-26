const { Schema, model } = require("mongoose");



//!Modelo para el administraor
const MaterialNeumaticoSchema = Schema({

    ref_material_empleado: {
        type: [Schema.Types.ObjectId],
        ref: 'MaterialEmpleado',
        required: true
    },
    /*ref_empleado:  {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },*/
    ref_neumatico:  {
        type: Schema.Types.ObjectId,
        ref: 'Neumatico',
        required: true
    }
})

MaterialNeumaticoSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.mnid = _id
    return object;
})

module.exports = model('MaterialNeumatico', MaterialNeumaticoSchema)