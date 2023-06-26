const { Router } = require("express");
const { obtenerSucurales } = require("../controllers/sucursal");

const router = Router();

router.get('/', obtenerSucurales);

module.exports = router;
