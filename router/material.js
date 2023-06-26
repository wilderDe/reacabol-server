const { Router } = require("express");
const { obtenerTodosLosMateriales } = require("../controllers/material");
const { operarioRegistraMaterial } = require("../controllers/operario");


const router = Router();

router.get('/', obtenerTodosLosMateriales)
router.post('/new', operarioRegistraMaterial)
//TODO: el administrador podra agregar materiales


module.exports = router
