const { Rol } = require("../models/recabol")


const obtenerRoles = async(req, res) => {

    try {
        const roles = await Rol.find();
        res.json({
            ok: true,
            roles
        })
    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al obtener los roles'
        })
    }
}


module.exports = {
    obtenerRoles
}