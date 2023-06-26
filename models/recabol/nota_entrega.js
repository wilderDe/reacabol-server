const { Schema, model } = require("mongoose");

const NotaEntregaSchema = Schema({

    ref_nota_orden: {
        type: Schema.Types.ObjectId,
        ref: 'NotaOrden',
        require: true
    },
    extras: {
        costo:{
            type: Number,
            default: 0
        },
        descripcion: {
            type: String,
            default: null
        }
    },
    //!descuento por antiguedad > 5
    descuento: {
        type: Number,
    },
    costo_total_final: {
        type: Number,
        required: true
    }
   
})

NotaEntrega.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.neid = _id
    return object;
})

module.exports = model('NotaEntrega', NotaEntregaSchema)