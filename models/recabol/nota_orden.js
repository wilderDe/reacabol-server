const { Schema, model } = require("mongoose");

const NotaOrdenSchema = Schema({
    //TODO falta el empleado
    numero_orden: { //dinamica
        type: Number,
        require: true
    },
    observaciones: { //typean
        type: String,
        default: null
    },
    anticipo: { //typean
        type: Number,
        default: 0
    },  
    fecha_creacion: { //typean
        type: Date,
        required: true,
    },
    fecha_entrega: {
        type: Date,
        default: null
    },
    ref_sucursal:{
        type: Schema.Types.ObjectId,
        ref: 'Sucursal'
    },
    ref_neumatico: { //typean
        type: [ Schema.Types.ObjectId ],
        ref: 'Neumatico',
        //required: true,
        default: []
    },
    coordenadas: { //typean
        long: Number,
        lat: Number
    },
    //!la suma de los tipo_trabajos de los neumaticos
    cotizacion: { //llega con el neumatico
        type: Number
    },
    final_total:{
        type: Boolean,
        default: false
    },
    //! Cuando se entrega la nota
    entregado:{
        type: Boolean,
        default: false
    },
    text_extras:{
        type:String,
        default: null
    },
    costo_extras:{
        type: Number,
        default: 0
    },
    costo_final:{
        type: Number,
        default: 0
    }

})

NotaOrdenSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.noid = _id
    return object;
})

module.exports = model('NotaOrden', NotaOrdenSchema)