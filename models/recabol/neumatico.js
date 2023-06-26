const { Schema, model } = require("mongoose");


const NeumaticoSchema = Schema({

    //TODO: entregado - no entregado
    entregado: {
        type: Boolean,
        default: false
    },
    //! va venir concatenado, helpers "2001-A, 2001-B"
    alfa: {
        type: String,
        required: true
    },
    marca: {  
        type: String,
        required: true,
    },
    medida:{
        type: String
    },
    serie: {
        type: String,
    },
    accesorios:{
        type: String
    },
    ref_cliente:{
        type: Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    tipo_trabajo:{
        type: Schema.Types.ObjectId,
        ref: 'TipoTrabajo',
        require: true
    },
    //* cuando toman el trabajo
    ref_operario: {
        type: Schema.Types.ObjectId,
        ref: 'Empleado'
    },

    //* true-trabajando, false-disponible "Lista de trabajos del operario"
    estado_trabajo: {
        type: Boolean,
        default: false
    }, 
    //* true-finalizado, false-pendiente "administrador"
    finalizado:{
        type: Boolean,
        default: false
    },
    //! EVALUAR rechazado, false - no esta rechazado, true - rechazado
    rechazo: {
        type: Boolean,
        default: false
    },

    //TODO: estado para saber si se entrego el neumatico
    

    fecha_entrega_aprox:{
        type: Date,
        required: true
    },

    //* OPERARIO cuando toma el trabajo
    fecha_inicio_trabajo:{
        type: Date,

    },
    fecha_final_trabajo:{
        type: Date
    }
})

NeumaticoSchema.method('toJSON', function(){
    const { __v, _id, ...object  } = this.toObject();
    object.nid = _id
    return object;
})

module.exports = model('Neumatico', NeumaticoSchema)