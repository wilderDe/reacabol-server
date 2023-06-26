const { Schema, model } = require("mongoose");


const DepositoSchema = Schema({

    ref_neumatico: {
        type: Schema.Types.ObjectId,
        ref: 'Neumatico',
    },
    bandera: {
        type: Boolean,
        default: false
    }

})

DepositoSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.did = _id
    return object;
})

module.exports = model('Deposito', DepositoSchema)