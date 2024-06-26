const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a la base de datos');
}).catch((error) => {
    console.error('Error al conectar a la base de datos', error);
});

// Modelos
const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    category: String,
    price: Number,
    description: String,
    imageUrl: String,
}));

const User = mongoose.model('User', new mongoose.Schema({
    username: String,
    password: String,
    email: String,
}));

const Cart = mongoose.model('Cart', new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }],
}));

// Rutas


// Ruta para agregar un nuevo producto
app.post('/products', async (req, res) => {
    try {
        const { name, category, price, description, imageUrl } = req.body;
        const product = new Product({ name, category, price, description, imageUrl });
        await product.save();
        res.send('Product added');
    } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).send('Error al agregar producto');
    }
});

// Ruta para obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});


// Ruta para agregar un nuevo usuario
app.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, email });
        await user.save();
        res.send('User registered');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send('Error al registrar el usuario');
    }
});



// Ruta para obtener todos los usuarios
app.get('/register', async (req, res) => {
    try {
        const register = await Register.find();
        res.json(register);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).send('User not found');
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid password');
        const token = jwt.sign({ _id: user._id }, 'secret');
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error al iniciar sesión');
    }
});

app.listen(3000, () => console.log('Server started on port 3000'));
