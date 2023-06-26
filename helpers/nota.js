const { Nota_Orden, Neumatico } = require("../models/recabol")


const generarNumeroNotaDeOrden = async() => {
    let numeroOrden = 2000;
    try {
        
        const ultimoRegistro = await Nota_Orden.findOne({}, {}, { sort: { $natural: -1 } }).exec();
        
        //* Solo ingresa la primera vez, por el primer registro al ser null
        if(ultimoRegistro === null){
            return numeroOrden;
        }

        numeroOrden = ultimoRegistro.numero_orden + 1;
        return numeroOrden;
    
    } catch (error) {
        console.log(error);
        return false;
    }

}

const sumaCotizacionNotaOrden = async( neumaticos = [] ) => {
    let suma = 0;

    for (const neumatico of neumaticos) {
        
        const model = await Neumatico.findById(neumatico)
            .populate('tipo_trabajo')

        suma += model.tipo_trabajo.costo;
    }
    
    return suma;

}



module.exports = {
    generarNumeroNotaDeOrden,
    sumaCotizacionNotaOrden
}
