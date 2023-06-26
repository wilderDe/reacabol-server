const { generarJWT } = require("../helpers/jwt");
const { Empleado }  = require("../models/recabol")
const bcrypt        = require('bcryptjs');



//TODO: El usuario ADMIN no tiene fecha de contrato para la autenticaion
//TODO: editar el empleado 
//TODO: verificar usuario y contraseña

const loginAuth = async(req, res) => {

    try {
        const  { usuario, password } = req.body;

        const existeUsuario = await Empleado.findOne({usuario})
            .populate('ref_rol')
            .populate({
                path: 'pendiente',
                populate: {
                    path: 'tipo_trabajo'
                }
            }) 

        if(!existeUsuario){
            return res.json({
                ok: false,
                msg: 'Usuario no encontrado'
            })
        }

        const validarPassword = bcrypt.compareSync(password, existeUsuario.password)
        if(!validarPassword){
            return res.json({
                ok: false,
                msg: 'El password no es correcto'
            })
        }

        const token = await generarJWT(existeUsuario._id);
        
        res.json({
            ok: true,
            usuario: existeUsuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.json({
            ok: false,
            msg: 'Error al logearse comuniquese con el administrador'
        })
    }

}

const renewToken = async(req, res) => {
    try {

        const uid = req.uid;
        const token = await generarJWT(uid);
        const usuario = await Empleado.findById(uid)
            .populate('ref_rol')
            .populate({
                path: 'pendiente',
                populate: {
                    path: 'tipo_trabajo'
                }
            }) 

        res.json({
            ok: true,
            usuario, 
            token
        })

    } catch (error) {
        console.log(error)
        return res.json({
            ok: false,
            msg: 'Error al renovar token'
        })
    }
}


const crearEmpleado = async( req, res ) => {

    try {
        const { ci, password, fecha_start, fecha_end } = req.body
        const fecha_contratacion = {
            fecha_start,
            fecha_end
        }
        //*No puede haber empleados con el mismo CI
        const existeCi = await Empleado.findOne( { ci } );
        if(existeCi){
            return res.status(400).json({
                ok: false,
                msg: 'El CI del empleado ya existe en la base de datos'
            })
        }

        const empleado = new Empleado(req.body)
        //*Encriptar password
        const salt = bcrypt.genSaltSync();
        empleado.password = bcrypt.hashSync(password, salt);
        //!EL rol debe ser veridico, controlar desde el frontend desplegable
        //!La sucursal debe ser veridica, controlar desde el frontend desplegable
        //* Agregamos la fecha de contratacion del empleado
        empleado.fecha_contratacion = [ ...empleado.fecha_contratacion, fecha_contratacion]
        //* Guardar en BD
        await empleado.save();
        //!una ves creado el empleado no generamos token
        res.json({
            ok: true,
            msg: 'Empleado creado',
            empleado,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepión al crear un empleado'
        })
    }
}

const nuevoContratoEmpleado = async(req, res) => {
    try {
        const { eid, fecha_start, fecha_end} = req.body;
        const fecha_contratacion = {
            fecha_start,
            fecha_end
        }

        const existeEmpleado = await Empleado.findById(  eid  );
        if(!existeEmpleado){
            return res.json({
                ok: false,
                msg: 'No existe el empleado con el eid ingresado'
            })
        }

        //!Controlar contratación la fecha end no puede ser menor que la fecha start
        existeEmpleado.fecha_contratacion = [ ...existeEmpleado.fecha_contratacion, fecha_contratacion];
        //* Guardar en la BD
        existeEmpleado.save();

        res.json({
            ok: true,
            msg: 'Contrato renovado',
            existeEmpleado
        })

    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al generar nuevo contrato con el empleado'
        })
    }
   
}

const obtenerTodosLosEmpleados = async(req, res) => {
    try {   
        const empleados = await Empleado.find()
            .populate('ref_rol')
            .populate('ref_sucursal')

        res.json({
            ok: true,
            empleados
        })
    } catch (error) {  
        console.log(error),
        res.json({
            ok: false,
            msg: 'Comuniquese con el administrador, excepción al obtener los usuarios'
        })
    }
}





module.exports = {
    obtenerTodosLosEmpleados,
    crearEmpleado,
    nuevoContratoEmpleado,
    loginAuth,
    renewToken
}