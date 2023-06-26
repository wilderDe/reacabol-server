const { Deposito } = require("../models/recabol")



const obtenerTodosLosNeumaticosDeposito = async(req ,res ) => {

    try {
        const depositos = await Deposito.find({bandera: true})
            .populate({
                path: 'ref_neumatico',
                populate: {
                    path: 'ref_cliente'
                }
            })
            .populate({
                path: 'ref_neumatico',
                populate: {
                    path: 'ref_operario'
                }
            }) 
            .populate({
                path: 'ref_neumatico',
                populate: {
                    path: 'tipo_trabajo'
                }
            }) 

        res.json({
            ok: true,
            depositos
        })
    } catch (error) {
        console.log(error)
        return res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, error al obtener los neumaticos del deposito' 
        })
    }
}

const entregarNeumaticoDeposito = async(req, res) => {

    try {
        const { id_deposito } = req.body;
        const deposito = await Deposito.findById(id_deposito);
        
        if(!deposito){
            return res.json({
                ok: false,
                msg: 'El id del deposito ingresao no existe en la base de datos del Deposito'
            })
        }
        
        deposito.bandera = false;
        await deposito.save();

        res.json({
            ok: true,
            msg: 'Neumatico entregado',
        })
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, Error al entregar el deposito del deposito'
        })   
    }
}


module.exports = { 
    obtenerTodosLosNeumaticosDeposito,
    entregarNeumaticoDeposito
}