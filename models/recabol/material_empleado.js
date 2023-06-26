const { Schema, model } = require("mongoose");


const MaterialEmpleadoSchema = Schema({

    serie_id:{
        type: String
    },

    ref_empleado: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado',
        required: true
    },
    ref_material: {
        type: Schema.Types.ObjectId,
        ref: 'Material',
        required: true
    },
    //!cuando saca tiene que anotar
    cantidad: {
        type: Number,
        required: true
    },
    //! costo*cantidad
    costo_total: {
        type: Number,
        required: true
    }

})

MaterialEmpleadoSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.meid = _id
    return object;
})

module.exports = model('MaterialEmpleado', MaterialEmpleadoSchema)