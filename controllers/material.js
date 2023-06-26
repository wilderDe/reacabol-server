const { Material } = require("../models/recabol")



const obtenerTodosLosMateriales = async( req, res) => {

    try {
        const materiales = await Material.find();

        res.json({
            ok: true,
            materiales
        })

    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            msg: 'Comuniquese con el adminitrado, excepciòn en obetenr el almacen'
        })
    }
}

//TODO: agregar materiales POST




module.exports = {

    obtenerTodosLosMateriales

}