const { Tipo_Trabajo } = require("../models/recabol")


const obtenerTodosLosTiposDeTrabajos = async(req, res) => {
    //! TIPO de trabajo por tmaño del numatico considerar
    try {
        const listaDeTrabajos = await Tipo_Trabajo.find();
        res.json({
            ok: true,
            listaDeTrabajos
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al momento de obtner las Lista de Trabajos'
        })
    }

}

module.exports = {

    obtenerTodosLosTiposDeTrabajos

}