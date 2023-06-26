const { Schema, model } = require("mongoose");

const MaterialSchema = Schema({

    nombre_material: {
        type: String,
        required: true
    },
    costo: {
        type: Number,
        required: true
    }

})

MaterialSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.aid = _id
    return object;
})

module.exports = model('Material', MaterialSchema);
