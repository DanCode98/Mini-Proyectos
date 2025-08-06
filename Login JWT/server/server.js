require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);

// Servir archivos estáticos
app.use(express.static(__dirname + '/../public'));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Bienvenido al sistema de autenticación');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use(express.static('../public'));

app.get('/dashboard.html', (req, res) => {

    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
        return res.redirect('/index.html');
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
        res.sendFile(path.join(__dirname, '../public/dashboard.html'));
    } catch (error) {
        res.redirect('/index.html');
    }
});

app.get(['/', '/index.html'], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

