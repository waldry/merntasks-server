const express = require("express");
const router = express.Router();
const proyectoController = require("../controller/proyectoController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
//Crea proyectos
// api/proyectos
router.post(
	"/",
	auth,
	[check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
	proyectoController.crearProyecto
);

//Obtener proyectos
router.get("/", auth, proyectoController.obtenerProyectos);

//Actualizar proyectos
router.put(
	"/:id",
	auth,

	[check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
	proyectoController.actualizarProyectos
);

//Eliminar proyectos
router.delete("/:id", auth, proyectoController.eliminarProyectos);
module.exports = router;
