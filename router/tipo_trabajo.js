const { Router } = require("express");
const { obtenerTodosLosTiposDeTrabajos } = require("../controllers/tipo_trabajo");


const router = Router();


router.get('/', obtenerTodosLosTiposDeTrabajos);

module.exports = router;