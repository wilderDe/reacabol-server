const { Router } = require("express");
const { crearNotaDeOrden, recepcionarNotaOrden, obtenerTodasLasNotas, entregarNotaOrden } = require("../controllers/nota_orden");


const router = Router();

router.get('/', obtenerTodasLasNotas)
router.post('/new', crearNotaDeOrden)
router.post('/recepcionar', recepcionarNotaOrden)
router.put('/', entregarNotaOrden)

module.exports = router