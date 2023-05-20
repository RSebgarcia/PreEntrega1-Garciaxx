import { Router } from "express";
import fs from 'fs'

const cartsRouter = Router();

const pathCarts = './src/public/storage/carts.json'
const pathProducts = './src/public/storage/products.json'


cartsRouter.get('/:cid', async(req, res) => {
    try {
        const { cid } = req.params;
        const data = await fs.promises.readFile(pathCarts, 'utf-8');
        const cartsJson = JSON.parse(data);
        const cart = cartsJson.find((c) => c.id === parseInt(cid));
        if (!cart) {
            res.status(404).send({status:"Error", error:`Cart with id ${cid} not found, please try another.`});
        } else {
            res.status(200).send({status:"success", detail:`Cart N°${cid} has ${cart.products.length} item or items`, payload: cart.products});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

cartsRouter.post('/', async(req, res) => {
    const carts = []
    const data = await fs.promises.readFile(pathCarts, 'utf-8');

    if (data) {
        const dataJson = JSON.parse(data);
        carts.push(...dataJson)
    }
    const newCart = {
        products:[]
    }
    if (carts.length === 0) {
        newCart.id = 1;
    }
    else {
        newCart.id = carts[carts.length - 1].id + 1
    }

    carts.push(newCart)
    await fs.promises.writeFile(pathCarts, JSON.stringify(carts, null, '\t'));
    res.status(201).json({ status:"success", payload: carts });
});

cartsRouter.post('/:cid/products/:pid', async(req,res)=>{
    const {cid,pid} = req.params
    const carts = []
    const products= []
    const cartsData = await fs.promises.readFile(pathCarts, 'utf-8');
    const productsData = await fs.promises.readFile(pathProducts, 'utf-8');

    if (cartsData) {
        const dataJson = JSON.parse(cartsData);
        carts.push(...dataJson)
    }
    if (productsData) {
        const dataJson = JSON.parse(productsData);
        products.push(...dataJson)
    }

    try {
        const cart = carts.find((c) => c.id === parseInt(cid));
        const product = products.find((p) => p.id === parseInt(pid));
        const isInCart = cart.products.find((p) => p.id === parseInt(pid));
            
        if (!cart) {
            throw new Error("Cart not found");
        }
    
        if (!product) {
            throw new Error(`Product with id ${pid} not found`);
        }
        if(!isInCart){
            const addProduct = {
                id: product.id,
                quantity: 1
            } 
            cart.products.push(addProduct)
        }else{
            const findProductIndex = cart.products.findIndex((p)=> p.id === parseInt(pid))
            cart.products[findProductIndex].quantity = cart.products[findProductIndex].quantity +1 
        }
    
        await fs.promises.writeFile(pathCarts, JSON.stringify(carts, null, '\t'));
        res.status(201).json({ status:"success", payload: cart });
    } catch (error) {
        if(error.message === "Cannot read properties of undefined (reading 'products')")[
            error.message = `Cart with id ${cid} not found`
        ]
        res.status(400).json({ status: "error", error: error.message });
    }
});


export default cartsRouter;