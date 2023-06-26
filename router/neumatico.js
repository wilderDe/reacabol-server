const { Router } = require("express");
const { crearNeumaticoIdOrdenIdCliente, obtenerNeumaticos, obtenerNeumaticosListaOperarios } = require("../controllers/neumatico");


const router = Router();


router.get('/', obtenerNeumaticos );
router.get('/operario', obtenerNeumaticosListaOperarios)
router.post('/new',  crearNeumaticoIdOrdenIdCliente);


module.exports = router