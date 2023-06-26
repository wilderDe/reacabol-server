const { Router } = require("express");
const { operarioTomaTrabajo, obtenerMaterialesRegistradoOperario, descuentoMaterialOperario, finalizarTrabajo, reporteRechazoNeumatico } = require("../controllers/operario");


const router = Router();


router.post('/tomatrabajo', operarioTomaTrabajo);
//* descontar cantida -1
router.put('/cantmaterial', descuentoMaterialOperario)
//* finalizar trabajo
router.put('/finalizar', finalizarTrabajo)
//* rechazar trabajo
router.put('/rechazar', reporteRechazoNeumatico)

router.post('/materialesregistrados', obtenerMaterialesRegistradoOperario)

module.exports = router;