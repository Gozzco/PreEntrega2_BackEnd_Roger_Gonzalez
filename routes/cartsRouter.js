const express = require('express');
const CartManager = require('../CartManager');
const exphbs = require('express-handlebars');
const cartsRouter = express.Router();
const cartManager = new CartManager('carrito.json');

const hbs = exphbs.create({ extname: '.handlebars' });
cartsRouter.engine('handlebars', hbs.engine);
cartsRouter.set('view engine', 'handlebars');

cartsRouter.post('/', (req, res) => {
    const newCart = cartManager.createCart()
    res.status(201).json(newCart)
});

cartsRouter.get('/:cid', (req, res) => {
    const cartId = req.params.cid
    const cart = cartManager.getCartById(cartId)

    if (cart) {
        res.render('cart', { cart });
    } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

cartsRouter.post('/:cid/products/:pid', (req, res) => {
    const cartId = req.params.cid
    const productId = req.params.pid
    const quantity = parseInt(req.body.quantity)

    try {
        const updatedCart = cartManager.addProductToCart(cartId, productId, quantity)
        res.json(updatedCart.products)
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = cartsRouter;



