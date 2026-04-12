require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

// Inyeccion de dependencia
const UserRepository = require('./repositories/MockUserRepository');
const userRepo = new UserRepository();

app.get('/all', async (req, res) => {
    try {
        const users = await userRepo.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/:id', async (req, res) => {
    try {
        const user = await userRepo.findById(req.params.id);
        res.json(user);
    } catch (error) {
        res.status(404).json({ error: "Usuario no encontrado" });
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await userRepo.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`MS Usuarios corriendo en puerto ${PORT}`);
});