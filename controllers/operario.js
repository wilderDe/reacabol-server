
const { request, response } = require("express");
const { generarNewSerieIdEmpleadoMaterial } = require("../helpers/operario-material");
const { Neumatico, Empleado, Material, Material_Empleado, Material_Neumatico, Nota_Orden, Rechazo, Deposito } = require("../models/recabol");


const operarioTomaTrabajo  = async( req, res ) => {

    try {
    
        const { id_neumatico, id_operario } = req.body;

        const existeNeumatico = await Neumatico.findById(id_neumatico);
        if(!existeNeumatico){
            return res.json({
                ok: false,
                msg: 'El neumatico  con el id no existe'
            })
        } 

        const existeOperario = await Empleado.findById(id_operario)
            .populate('ref_rol')
       
        if(!existeOperario){
            return res.json({
                ok: false,
                msg: 'El operario  con el id no existe'
            })
        }
    
        if(existeOperario.ref_rol.nombre_rol !== 'OPERARIO'){
            return res.json({
                ok: false,
                msg: `Usted no tiene privilegios para hacer esta operacion ${existeOperario.ref_rol.nombre_rol} ` 
            })
        }

        existeNeumatico.estado_trabajo = true;
        existeNeumatico.ref_operario = id_operario;
        existeOperario.pendiente = id_neumatico
        await existeNeumatico.save();
        await existeOperario.save();

        const operario = await Empleado.findById(id_operario)
            .populate('ref_rol')
            .populate('pendiente')

            

        //TODO: emitir soktes  la nueva lista de los operario 

        //TODO: ok
        res.json({
            ok: true,
            existeNeumatico,
            operario
        })

    } catch (error) {
        console.log(error),
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al tomar un trabajo OPERARIO'
        })
    }

}



//TODO: CREAR MATERIALES - ID EMPLEADO
const operarioRegistraMaterial = async(req, res) => {
    
    try { 

        const { ref_material} = req.body;
        /*const existeEmpleado = await Empleado.findById(ref_empleado)
        if(!existeEmpleado){
            return res.json({
                ok :false,
                msg: 'Error en ele empelado'
            })
        }*/
        const existeAlmacenMaterial = await Material.findById(ref_material);
        if(!existeAlmacenMaterial){
            return res.json({
                ok :false,
                msg: 'Error en el alamcen'
            })
        }
        //* serie_id para el seguimiento 
        const newSerieId = await generarNewSerieIdEmpleadoMaterial();
        const newRegistroMarterialOper = new Material_Empleado(req.body);
        newRegistroMarterialOper.serie_id = newSerieId;
        await newRegistroMarterialOper.save();

        //TODO: agregar al material neumatico

        res.json({
            ok: true,
            newRegistroMarterialOper
        })

    } catch (error) {
        console.log(error);
        return res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, Excepciòn al agregar material empleado'
        })
    }
}

//* mostrar todos los material excepto los que tienen cantidad 0
const obtenerMaterialesRegistradoOperario = async(req, res) => {

    try {
        const { id_empleado } = req.body
        console.log(req.body)
        const materialesRegistrados = await Material_Empleado.find( { cantidad: { $ne: 0 }, ref_empleado: id_empleado  } )
            .populate("ref_empleado")
            .populate("ref_material")


        res.json({
            ok: true,
            materialesRegistrados
        })

    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            msg: 'Comniquese con el administrador, error al obtener los materiales registrados'
        })
    }
}

//TODO: material utilizado descontar -1
const descuentoMaterialOperario = async(req=request, res=response) => {


    try { 
        //!! verificar si el id_empleado es necesario
        const { id_neumatico, id_material_empleado, id_material_neumatico} = req.body;
    
        const existeNeumatico = await Neumatico.findById(id_neumatico);
        if(!existeNeumatico){
            return res.json({
                ok: false,
                msg: 'El neumnatico con el id ingresado no existe en la base de datos'
            })
        }
    
        const existeMaterialEmpleado = await Material_Empleado.findById(id_material_empleado);
        if(!existeMaterialEmpleado){
            return res.json({
                ok: false,
                msg: 'El material empleado id, no existe en la base de datos'
            })
        }
        //* verificar que ya sea 0, si es cero terminar la funcion
        if(existeMaterialEmpleado.cantidad === 0){
            return res.json({
                ok: false,
                msg: 'El Stock del material se a terminado, registre otro nuevo material'
            })
        }
        existeMaterialEmpleado.cantidad -= 1;
        existeMaterialEmpleado.save();

        //* Verificar si el material neumatico existe
        if(!id_material_neumatico){
            const materialNeumatico = new Material_Neumatico();
            materialNeumatico.ref_neumatico = existeNeumatico._id;
            materialNeumatico.ref_material_empleado = [ ...materialNeumatico.ref_material_empleado, existeMaterialEmpleado._id ]            
            await materialNeumatico.save();
            return res.json({
                ok: true,
                existeMaterialEmpleado,
                materialNeumatico
            })
        }
        
        //SI ya existe  
        const existeMN = await Material_Neumatico.findById(id_material_neumatico);
        existeMN.ref_neumatico = existeMN._id;
        existeMN.ref_material_empleado = [ ...existeMN.ref_material_empleado, existeMaterialEmpleado._id ]            
        await existeMN.save();
    
        return res.json({
            ok: true,
            existeMaterialEmpleado,
            existeMN
        })

        
    } catch (error) {
        console.log(error)
        res.json({
            ok:false,
            msg: 'Comuniquese con el administrador, Error al descontar el material cantidad -1'
        })
    }
}

const finalizarTrabajo = async(req, res) =>{
    //* finaliza el trabajo y verifica si manda al depositco
    try {
        //TODO: id_neumatico //TODO: id de la nota orden
        //const { id_neumatico, id_nota_orden, deposito } = req.body;
        const { id_neumatico, id_nota_orden, deposito, id_empleado } = req.body

        const existeNotaOrden = await Nota_Orden.findOne({ numero_orden: id_nota_orden })
                .populate('ref_neumatico');
        if(!existeNotaOrden){
            return res.json({
                ok: false,
                msg: 'El id de la Nota de orden no existe en la base de datos'
            })
        }
        const existeNeumatico = await Neumatico.findById(id_neumatico);

        if(!existeNeumatico){
            return res.json({
                ok: false,
                msg: 'El id del neumatico no existe en la base de datos'
            })
        }

        existeNeumatico.finalizado = true;
        await existeNeumatico.save();
        //TODO: verificar que todos los neuamticos esten en true
        const { ref_neumatico } = await Nota_Orden.findOne( {numero_orden: id_nota_orden} )
            .populate('ref_neumatico');

        //*Verifiamos si el neumatico entra al deposito
        if(deposito){
            const newDeposito = new Deposito();
            newDeposito.ref_neumatico = id_neumatico;
            newDeposito.bandera = true;
            await newDeposito.save();
        }

        //* del empleado quitamos el pendiente
        const empleado = await Empleado.findById(id_empleado)
            .populate('ref_rol')
            .populate({
                path: 'pendiente',
                populate: {
                    path: 'tipo_trabajo'
                }
            }) 
        empleado.pendiente = null;
        await empleado.save();

        for (const neumatico of ref_neumatico ) {
        
            const model = await Neumatico.findById(neumatico)        
            if(!model.finalizado){
                return res.json({
                    ok: true,
                    deposito: deposito ?"El neumatico se ingreso al deposito" :"El neumatico no ingreso al deposito",
                    msg: 'Neumatico reparado',
                    empleado 
                })
            }
        }
        
        existeNotaOrden.final_total = true;
        await existeNotaOrden.save();

        res.json({
            ok: true,
            msg: 'Todos los neumaticos fueron reparados',
            existeNeumatico,
            empleado

        })

    } catch (error) {
        console.log(error)
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, error al finalizar el trabajo'
        })
    }

}
//TODO: reporte de rechazo
const reporteRechazoNeumatico = async( req, res ) => {

    try {
        //TODO: id_neumatica, empleado, orden
        const { id_neumatico, id_empleado, id_nota_orden, ...resto} = req.body;

        const existeEmpleado = await Empleado.findById(id_empleado)
            .populate('ref_rol')
            .populate({
                path: 'pendiente',
                populate: {
                    path: 'tipo_trabajo'
                }
            }) 
        if(!existeEmpleado){
            return res.json({
                ok: false,
                msg: 'El id del empleado no existe en la base de datos'
            })
        }

        const existeNotaOrden = await Nota_Orden.findOne({numero_orden: id_nota_orden})
            .populate('ref_neumatico');
        if(!existeNotaOrden){
            return res.json({
                ok: false,
                msg: 'El id de la Nota de orden no existe en la base de datos'
            })
        }
             
        const existeNeumatico = await Neumatico.findById(id_neumatico);
        if(!existeNeumatico){
            return res.json({
                ok: false,
                msg: 'El id del neumatico no existe en la base de datos'
            })
        }

        //TODO: verificar que el neumatico existe en la nota de orden
        const existeNeuenNO = existeNotaOrden.ref_neumatico.map( neumatico => neumatico._id === existeNeumatico._id );
        if(!existeNeuenNO){
            return res.json({
                ok: false,
                msg: 'EL neumatico no pertenece a la nota de orden'
            })
        }

        //TODO: cambiar el finalizado del neumatico a true
        existeNeumatico.rechazo = true;
        existeNeumatico.finalizado = true;
        await existeNeumatico.save()

        existeEmpleado.pendiente = null;
        await existeEmpleado.save()

        //TODO: verificar si todos los neumaticos ya an sido finalizadods
        const { ref_neumatico } = await Nota_Orden.findOne({numero_orden: id_nota_orden})
            .populate('ref_neumatico');

        for (const neumatico of ref_neumatico ) {
            //! VERIFICAR ESTA FUNCION
            const model = await Neumatico.findById(neumatico) 
            console.log(model.finalizado)       
            if(!model.finalizado){
                return res.json({
                    ok: false,
                    msg: 'Neumatico rechazado, Pero aun hay mas neumaticos a reparar' ,
                    empleado: existeEmpleado
                })
            }
        }
        
        existeNotaOrden.final_total = true;
        await existeNotaOrden.save()

        const rechazo = new Rechazo(resto);
        rechazo.ref_empleado = existeEmpleado._id;
        rechazo.ref_neumatico = existeNeumatico._id
        await rechazo.save();

        res.json({
            ok: true,
            msg: 'Todos los neumaticos fueron reparados',
            existeNeumatico,
            empleado: existeEmpleado
        })
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, erro al finzalizar el trabajo'
        })
    }
}



module.exports = {

    operarioTomaTrabajo,
    operarioRegistraMaterial,
    obtenerMaterialesRegistradoOperario,
    descuentoMaterialOperario,
    finalizarTrabajo,
    reporteRechazoNeumatico


}