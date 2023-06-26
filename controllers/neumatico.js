const { sumaCotizacionNotaOrden } = require("../helpers/nota");
const { Neumatico } = require("../models/recabol");
const { Nota_Orden, Cliente, Tipo_Trabajo } = require("../models/recabol");


const ABECEDARIO = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

const crearNeumaticoIdOrdenIdCliente = async(req ,res) => {

    try {
        const {id_nota_orden, id_cliente, id_tipo_trabajo } = req.body;

        //* verificar que el id de la nota de orden exista
        const existeNotaOrden = await Nota_Orden.findById(id_nota_orden);
        if(!existeNotaOrden){
            return res.json({
                ok: false,
                msg: 'El id de la nota de orden no esta registrado'
            })
        }
        //* verifiar que el id del cliente existe
        const existeCliente = await Cliente.findById(id_cliente);
        if(!existeCliente){
            return res.json({
                ok: false,
                msg: 'El id del cliente ingresado no esta registrado en la base de datos'
            })
        }
        //* verificar que el id del tipo de trabajo existe
        const existeTipoTrabajo = await Tipo_Trabajo.findById(id_tipo_trabajo);
        if(!existeTipoTrabajo){
            return res.json({
                ok: false,
                msg: 'El id del tipo de trabajo no esta registrado en la base de datos'
            })
        }

        //* creamos el alfa para el neumatico
        const numero_alfa = `${existeNotaOrden.numero_orden}-${ ABECEDARIO[existeNotaOrden.ref_neumatico.length] }`
        
        //* agregar el neumatico
        const neumatico = new Neumatico(req.body);
        neumatico.alfa = numero_alfa;
        neumatico.accesorios = req.body.accesorios;
        neumatico.ref_cliente = existeCliente._id;
        neumatico.tipo_trabajo = existeTipoTrabajo._id;
        await neumatico.save();
        
        //* agregar el neumatico a la nota de orden
        existeNotaOrden.ref_neumatico = [ ...existeNotaOrden.ref_neumatico, neumatico ];
        await existeNotaOrden.save()
        
        //* Generar el anticipo
        const sumaCotizacion = await sumaCotizacionNotaOrden(existeNotaOrden.ref_neumatico);
        existeNotaOrden.cotizacion = sumaCotizacion;
        await existeNotaOrden.save()
        //TODO: ok

        //! emitir la nota de orden a los sockts para comunicar a los operadores y el administrador
        const notaOrden = await Nota_Orden.findById(id_nota_orden)
            .populate({
                path: 'ref_neumatico',
                populate: {
                    path: 'tipo_trabajo'
                }
            }) 
        res.json({
            ok: true,
            notaOrden
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, Excepción al crear el neumatico '
        })
    }

}

//* Tanto para el secretario y el administrador
const obtenerNeumaticos = async(req, res) => { 

    try {

        const neumaticos = await Neumatico.find()
            .populate('ref_cliente')
            .populate('tipo_trabajo')
            .populate({
                path: 'ref_operario',
                populate: {
                    path: 'ref_rol'
                }
            })      


        res.json({
            ok: true,
            neumaticos
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al obtener neumaticos'
        })
    }
}

/* Obtiene los neumaticos de para trabajar */
const obtenerNeumaticosListaOperarios = async(req, res) => {

    try {
    
        const neumaticos = await Neumatico.find( { estado_trabajo: false } )
        .populate('ref_cliente')
        .populate('tipo_trabajo')

        //! buscar sort
        neumaticos.sort((a,b) => a.fecha_entrega_aprox - b.fecha_entrega_aprox );


        res.json({
            ok: true,
            neumaticos
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al obtener lista neumaticos operarios'
        })
    }

}




module.exports =  { 
   crearNeumaticoIdOrdenIdCliente,
   obtenerNeumaticos,
   obtenerNeumaticosListaOperarios
}