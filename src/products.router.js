import { Router } from "express";
import fs from 'fs'

const productsRouter = Router();

const path = './src/public/storage/products.json'

productsRouter.get('/', async (req, res) => {
    try {
        if (fs.existsSync(path)) {
            const data = await fs.promises.readFile(path, "utf-8");
            const products = JSON.parse(data);

            const limit = parseInt(req.query.limit);
            if (Number.isInteger(limit)) {
                res.send({ status: "success", payload: products.slice(0, limit) });
            } else {
                res.send({ status: "success", payload: products });
            }
        } else {
            res.status(400).send({ status: "Error", error: "Ocurrio un error" });
        }
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Failed to retrieve products" });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const data = await fs.promises.readFile(path, 'utf-8');
        const productsCopy = JSON.parse(data);
        const product = productsCopy.find((p) => p.id === pid);
        console.log('product:', product)

        if (!product) {
            res.status(404).send('Product not found');
        } else {
            res.send(product);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

productsRouter.post('/', (req, res) => {
    // Lógica para agregar un nuevo producto
});

productsRouter.put('/:pid', (req, res) => {
    // Lógica para actualizar un producto existente por su id
});

productsRouter.delete('/:pid', (req, res) => {
    // Lógica para eliminar un producto por su id
});


export default productsRouter;