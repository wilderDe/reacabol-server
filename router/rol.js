const { Router } = require("express");
const { obtenerRoles } = require("../controllers/rol");


const router = Router();

router.get('/', obtenerRoles)

module.exports = router;