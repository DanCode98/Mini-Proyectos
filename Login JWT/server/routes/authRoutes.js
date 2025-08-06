const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Registro
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Verificar token
router.get('/verify', authMiddleware, authController.verifyToken);

module.exports = router;