const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.authenticarUsuario = async (req, res) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}
	//extraer email y password
	const { email, password } = req.body;
	try {
		//Revisar que sea un usuario registrar
		let usuario = await Usuario.findOne({ email });
		if (!usuario) {
			return res
				.status(400)
				.json({ msg: "el usuario no existe en nuestra base de datos" });
		}
		//Revisar el password
		const passCorrecto = await bcrypt.compare(password, usuario.password);
		if (!passCorrecto) {
			return res.status(400).json({ msg: "Password incorrecto" });
		}
		//Si todo es correcto
		const payload = {
			usuario: {
				id: usuario.id,
			},
		};
		//Firmar el JWT
		jwt.sign(
			payload,
			process.env.SECRETA,
			{
				expiresIn: 3600, //Una hora
			},
			(error, token) => {
				if (error) throw error;
				res.json({ token });
			}
		);
	} catch (error) {
		console.log(error);
	}
};

//Obtiene que usuario esta autenticado
exports.usuarioAutenticado = async (req, res) => {
	try {
		const usuario = await Usuario.findById(req.usuario.id).select("-password");
		res.json({ usuario });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: "hubo un error" });
	}
};
