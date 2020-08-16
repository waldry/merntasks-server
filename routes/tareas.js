const express = require("express");
const router = express.Router();
const tareaController = require("../controller/tareaController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//Crear una tarea
//api/tareas
router.post(
	"/",
	auth,
	[check("nombre", "El nombre del proyecto es obligatorio").not().isEmpty()],
	[check("proyecto", "El proyecto es obligatorio").not().isEmpty()],
	tareaController.CrearTarea
);
//Obtener las tareas por proyecto
router.get("/", auth, tareaController.ObtenerTareas);
//actualizar tarea
router.put("/:id", auth, tareaController.ActualizarTarea);
//Eliminar una tarea
router.delete("/:id", auth, tareaController.EliminarTarea);
module.exports = router;
