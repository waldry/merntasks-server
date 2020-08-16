const Proyecto = require("../models/Proyecto");
const { validationResult } = require("express-validator");
exports.crearProyecto = async (req, res) => {
	//Revisar si hay errores
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}
	try {
		//Crear un nuevo proyecto
		const proyecto = new Proyecto(req.body);

		//Guardar el creador via JWT
		proyecto.creador = req.usuario.id;
		//Guardamos el proyecto
		proyecto.save();
		res.json(proyecto);
	} catch (error) {
		console.log(error);
		res.status(500).send("Hubo un error");
	}
};

//Obtiene todos los proyectos del usuario actual
exports.obtenerProyectos = async (req, res) => {
	try {
		const proyectos = await Proyecto.find({ creador: req.usuario.id });
		res.json({ proyectos });
	} catch (error) {
		console.log(error);
		res.status(500).send("Hubo un error");
	}
};

//Actualiza un proyecto

exports.actualizarProyectos = async (req, res) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}
	const { nombre } = req.body;
	const nuevoProyecto = {};
	if (nombre) {
		nuevoProyecto.nombre = nombre;
	}

	try {
		//Revisar el ID
		let proyecto = await Proyecto.findById(req.params.id);
		//Si el proyecto existe o no
		if (!proyecto) {
			return res.status(404).json({ msg: "proyecto no encontrado" });
		}
		//Verificar el creador del proyecto
		if (proyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: "no autorizado" });
		}
		//actualizar
		proyecto = await Proyecto.findByIdAndUpdate(
			{ _id: req.params.id },
			{ $set: nuevoProyecto },
			{ new: true }
		);
		res.json({ proyecto });
	} catch (error) {
		console.log(error);
		res.status(500).send("Hubo un error En el servidor");
	}
};

//Elimina proyecto por id
exports.eliminarProyectos = async (req, res) => {
	try {
		//Revisar el ID
		let proyecto = await Proyecto.findById(req.params.id);
		//Si el proyecto existe o no
		if (!proyecto) {
			return res.status(404).json({ msg: "proyecto no encontrado" });
		}
		//Verificar el creador del proyecto
		if (proyecto.creador.toString() !== req.usuario.id) {
			return res.status(401).json({ msg: "no autorizado" });
		}
		//Eliminar el proyecto
		await Proyecto.findOneAndRemove({ _id: req.params.id });
		res.json({ msg: "Proyecto eliminado" });
	} catch (error) {
		console.log(error);
		res.status(500).send("Error en el Servidor");
	}
};
