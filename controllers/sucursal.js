const { Sucursal } = require("../models/recabol");

const obtenerSucurales = async(req, res)  => {

    try {
        const sucursales = await Sucursal.find();
        res.json({
            ok: true,
            sucursales
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepcion al obtener las sucursales'
        })
    }

}

//TODO: Editar telefono

//! Funcion fuera de servicio
const crearSucursal = async( req, res) => {
    //!La ubicacion no tiene que repetir
    try {
        //! El telefono no tiene que repetir
        const { telefono } = req.body;
        const exiteTelefono = await Sucursal.findOne({ telefono });
        
        if(exiteTelefono){
            return res.json({
                ok: false,
                msg: 'El telefono ya esta en uso en otra sucursal'
            })
        }

        const sucursal = new Sucursal(req.body);
        await sucursal.save();

        res.json({
            ok: true,
            msg: 'Nueva sucursal añadida',
            sucursal
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al crear la sucursal'
        })
    }
}

module.exports = {
    obtenerSucurales

}