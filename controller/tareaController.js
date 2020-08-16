const Tarea = require("../models/Tarea");
const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");

//Crea una nueva tarea
exports.CrearTarea = async (req, res) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}
	try {
		const { proyecto } = req.body;
		const existeProyecto = await Proyecto.findById(proyecto);
		if (!existeProyecto) {
			return res.status(404).json({ msg: "Proyecto no encontrado" });
		}
		//revisar si el proyecto actual pertenece al usuario autenticado
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: "no autorizado" });
		}
		//Creamos la tarea
		const tarea = new Tarea(req.body);
		await tarea.save();
		res.json({ tarea });
	} catch (error) {
		console.log(error);
		res.status(500).send("Hubo un error");
	}
};

exports.ObtenerTareas = async (req, res) => {
	try {
		//extraemos el proyecto
		const { proyecto } = req.query;
		const existeProyecto = await Proyecto.findById(proyecto);
		if (!existeProyecto) {
			return res.status(404).json({ msg: "Proyecto no encontrado" });
		}
		//revisar si el proyecto actual pertenece al usuario autenticado
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: "no autorizado" });
		}
		//obtener las tareas por proyecto
		const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
		res.json({ tareas });
	} catch (error) {
		console.log(error);
		res.status(500).send("Huboo un error");
	}
};
//Actualizar tarea
exports.ActualizarTarea = async (req, res) => {
	try {
		const { proyecto, nombre, estado } = req.body;
		let tareaExiste = await Tarea.findById(req.params.id);

		//si la tarea existe
		if (!tareaExiste) {
			return res.status(404).json({ msg: "No existe esta tarea" });
		}
		//extraer proyecto
		const existeProyecto = await Proyecto.findById(proyecto);
		//revisar si el proyecto actual pertenece al usuario autenticado
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: "no autorizado" });
		}
		//Crear objeto con la nueva informacion
		const nuevaTarea = {};
		nuevaTarea.nombre = nombre;
		nuevaTarea.estado = estado;
		//guardar la tarea
		tareaExiste = await Tarea.findOneAndUpdate(
			{ _id: req.params.id },
			nuevaTarea,
			{ new: true }
		);
		res.json({ tareaExiste });
	} catch (error) {
		console.log(error);
		res.status(500).send("Hubo un error");
	}
};
//Se elimina una tarea
exports.EliminarTarea = async (req, res) => {
	try {
		const { proyecto } = req.query;
		let tareaExiste = await Tarea.findById(req.params.id);

		//si la tarea existe
		if (!tareaExiste) {
			return res.status(404).json({ msg: "No existe esta tarea" });
		}
		//extraer proyecto
		const existeProyecto = await Proyecto.findById(proyecto);
		//revisar si el proyecto actual pertenece al usuario autenticado
		if (existeProyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: "no autorizado" });
		}
		//eliminar
		await Tarea.findOneAndRemove({ _id: req.params.id });
		res.json({ msg: "Tarea Eliminada" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Hubo un error");
	}
};
