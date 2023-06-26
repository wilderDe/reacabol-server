const { Router } = require("express");
const { validarCampos } = require("../middlewares/validar-campos");
const { check } = require("express-validator");
const { crearEmpleado, obtenerTodosLosEmpleados, nuevoContratoEmpleado, loginAuth, renewToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

//* Crear un nuevo Empleado
router.post('/new', [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('ci','El numero de carnet es obligatorio').not().isEmpty(),
    check('usuario','El usuario es obligatorio').not().isEmpty(),
    check('password','La contraseña es obligatorio').not().isEmpty(),
    check('fecha_start','La fecha de inicio del contrato es obligatorio').not().isEmpty(),
    check('fecha_end','La fecha de finalización del contrato es obligatorio').not().isEmpty(),
    check('celular','El numero de celular es obligatorio').not().isEmpty(),
    check('ref_rol','El rol del empleado es obligatorio').not().isEmpty(),
    check('ref_sucursal','La sucursal de trabajo es obligatorio').not().isEmpty(),
    validarCampos
], crearEmpleado );

//* Reanudad contrato
router.post('/renew', [
    check('eid','El id del empleado es obligatorio').not().isEmpty().isMongoId(),
    check('fecha_start','La fecha de inicio del contrato es obligatorio').not().isEmpty(),
    check('fecha_end','La fecha de finalización del contrato es obligatorio').not().isEmpty(),
    validarCampos
], nuevoContratoEmpleado)

router.get('/', obtenerTodosLosEmpleados);


router.post('/login', loginAuth);

router.get('/renew', validarJWT, renewToken )



module.exports = router;