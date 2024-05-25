const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

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
app.get('/products', async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    res.send('User registered');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('User not found');
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');
    const token = jwt.sign({ _id: user._id }, 'secret');
    res.json({ token });
});

app.listen(3000, () => console.log('Server started on port 3000'));
