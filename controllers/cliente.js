const { Cliente } = require("../models/recabol")


const obtnerTodosLosClientes = async(req, res) => {
    try {
        const clientes = await Cliente.find();
        res.json({
            ok: true,
            clientes
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al obtener todos los clientes'
        })
    }

}

const crearCliente = async( req, res ) => {
    try {
        const { ci } = req.body
        //* Si existe el cliente con el ci "esta volviendo"
        const existeCliente = await Cliente.findOne( { ci } );
        if(existeCliente){
            existeCliente.cliente_frecuente = existeCliente.cliente_frecuente + 1;
            await existeCliente.save();
            return res.json({
                ok: true,
                msg: 'Cliente que retorno por el servicio',
                cliente: existeCliente
            })
        }   
        const cliente = new Cliente( req.body );
        await cliente.save();
        res.json({
            ok: true,
            msg: 'Cliente creado',
            cliente
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepciòn al crear el cliente'
        })        
    }
}

module.exports = {
    obtnerTodosLosClientes,
    crearCliente

}