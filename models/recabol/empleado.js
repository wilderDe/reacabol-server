const { Schema, model } = require("mongoose");

const EmpleadoSchema = Schema({

   //!nombre-apellidos
    nombre: {  
        type: String,
        required: true,
    },
    ci:{
        type: Number,
        required: true
    },
    usuario: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fecha_contratacion:[
        {
            fecha_start:{
                type: Date,
                required: true
            },
            fecha_end:{
                type: Date,
                required: true
            }
        }
    ],
    celular: {
        type: Number,
        required: true
    },
    ref_rol:{
        type: Schema.Types.ObjectId,
        ref: 'Rol',
        required: true
    },
    ref_sucursal: {
        type: Schema.Types.ObjectId,
        ref: 'Sucursal',
        required: true
    },
   
    //bandera de que tiene trabajo
    pendiente: {
        type: Schema.Types.ObjectId,
        ref: 'Neumatico',
        default: null
    }

})

EmpleadoSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.eid = _id
    return object;
})

module.exports = model('Empleado', EmpleadoSchema)