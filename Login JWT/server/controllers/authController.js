const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findByUsernameOrEmail(username, email);
            if (existingUser) {
                return res.status(400).json({
                    message: 'El usuario o email ya está en uso'
                });
            }

            // Crear nuevo usuario
            const newUser = await User.create(username, email, password);

            res.status(201).json({
                message: 'Usuario registrado exitosamente'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al registrar el usuario'
            });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Buscar usuario
            const user = await User.findByUsername(username);
            if (!user) {
                return res.status(401).json({
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar contraseña
            const isMatch = await User.comparePasswords(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    message: 'Credenciales inválidas'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                process.env.JWT_SECRET || 'secretkey',
                { expiresIn: '1h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    username: user.username
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error al iniciar sesión'
            });
        }
    },

    verifyToken: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    message: 'Token no proporcionado'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

            res.json({
                user: {
                    username: decoded.username
                }
            });
        } catch (error) {
            console.error(error);
            res.status(401).json({
                message: 'Token inválido o expirado'
            });
        }
    }
};

module.exports = authController;