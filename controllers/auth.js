import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

export async function register(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'username et password requis' });
        await User.create({ username, password });
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ message: 'Ce nom d\'utilisateur existe déjà' });
        res.status(500).json({ message: error.message });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'username et password requis' });
        const user = await User.findOne({ username });
        if (!user) return res.status(401).json({ message: 'Identifiants invalides' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Identifiants invalides' });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
