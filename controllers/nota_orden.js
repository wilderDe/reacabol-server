const { generarNumeroNotaDeOrden } = require("../helpers/nota");
const { Nota_Orden } = require("../models/recabol");


const obtenerTodasLasNotas = async( req, res) => {

    try {
        const lista = await Nota_Orden.find()
            .populate('ref_sucursal')
            .populate({
                path: 'ref_neumatico',
                populate: {
                    path: 'ref_cliente'
                }
            }) 
            .populate({
                path:'ref_neumatico',
                populate:{
                    path: 'tipo_trabajo'
                }
            })
        
        res.json({
            ok: true,
            lista
        })

    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            msg: 'Error al obtener las notas de orden, comuniquese con el administrador'
        })
    }

}

const crearNotaDeOrden = async( req, res) => {

    try {
        //Generar el numero de nota de orden
        const numeroNotaOrden = await generarNumeroNotaDeOrden();
        const notaOrden = new Nota_Orden(req.body);
        //console.log(req.body)
        notaOrden.numero_orden = numeroNotaOrden
    
        await notaOrden.save()
        res.json({ 
            ok: true,
            notaOrden
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al crear una nueva nota de orden'
        })
    }
}

//Recepcion de la nota de orden
const recepcionarNotaOrden = async(req, res) => {

    try {

        const { noid, sucursal, anticipo } = req.body 

        const notaOrden = await Nota_Orden.findById(noid)
    
        if(notaOrden.ref_neumatico.length === 0){
            return res.json({
                ok: false,
                msg: 'Debe agregar por lo menos un neumatico'
            })
        }
        notaOrden.ref_sucursal = sucursal;
        notaOrden.anticipo = anticipo

        await notaOrden.save();

        

        res.json({
            ok: true,
            notaOrden,
            msg: 'Nota de orden recepcionada'
        })


    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al recepcionar la nota de orden'
        })
    }

}

const entregarNotaOrden = async(req, res) => {
    try {
        const {id_nota_orden} = req.body

        const notaOrden = await Nota_Orden.findById(id_nota_orden);

        notaOrden.entregado = true;
        notaOrden.text_extras = req.body.text_extras
        notaOrden.costo_extras = parseInt(req.body.costo_extras) || 0
        notaOrden.costo_final = req.body.costo_final
        notaOrden.fecha_entrega = new Date()

        await notaOrden.save()

        res.json({
            ok: true,
            msg: 'Nota Orden finalizado',
            notaOrden
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Error en la entrega de Nota de Orden, comuniquese con el administrador'
        })
    }
}


module.exports = {

    crearNotaDeOrden,
    recepcionarNotaOrden,
    obtenerTodasLasNotas,
    entregarNotaOrden 

}



