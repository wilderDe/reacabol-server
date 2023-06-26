const { Material_Empleado } = require("../models/recabol")



const generarNewSerieIdEmpleadoMaterial = async(req ,res) => {
    //serie = Material-Empleado
    let serie = 'M-E'
    const ultimoRegistro = await Material_Empleado.findOne({}, {}, { sort: { $natural: -1 } }).exec();
    if(ultimoRegistro === null){
        return serie = `${serie}-1`
    }
    const separadoPartes = ultimoRegistro.serie_id.split("-");
    const numero =  parseInt(separadoPartes[separadoPartes.length-1]);
    serie = `${serie}-${numero+1}`
    
    return serie
    
}


//TODO: control de liquidos, poco: 100ml medio: 200ml mucho:300ml 

module.exports = {

    generarNewSerieIdEmpleadoMaterial

}