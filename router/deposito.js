const { Router } = require("express");
const { obtenerTodosLosNeumaticosDeposito, entregarNeumaticoDeposito } = require("../controllers/deposito");

const router = Router();

router.get('/', obtenerTodosLosNeumaticosDeposito);
router.put('/entregar', entregarNeumaticoDeposito)

module.exports = router
