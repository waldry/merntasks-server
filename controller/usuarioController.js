const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.crearUsuario = async (req, res) => {
	const errores = validationResult(req);
	if (!errores.isEmpty()) {
		return res.status(400).json({ errores: errores.array() });
	}

	const { email, password } = req.body;

	try {
		//validar
		let usuario = await Usuario.findOne({ email });
		if (usuario) {
			return res.status(400).json({ msg: "El usuario ya existe" });
		}

		usuario = new Usuario(req.body);
		//Hash password
		const salt = await bcrypt.genSalt(10);
		usuario.password = await bcrypt.hash(password, salt);
		await usuario.save();

		//Crear y frmar el jwt
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
		res.status(400).json({ msg: "Hubo un error" });
	}
};
