const { Router } = require("express");
const { crearCliente, obtnerTodosLosClientes } = require("../controllers/cliente");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");


const router = Router();


router.get('/', obtnerTodosLosClientes)

router.post('/new', [
    check('ci','El numero de carnet de identidad del cliente es obligatorio').not().isEmpty(),
    check('nombre_apellidos','El campo nombre_apellidos es obligatorio').not().isEmpty(),
    check('celular','El celular del cliente es obligatorio').not().isEmpty(),
    check('fecha_creacion','La fecha de creacion del cliente es obligatorio').not().isEmpty(),
    validarCampos
], crearCliente )

module.exports = router;
