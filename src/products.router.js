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
            res.status(400).send({ status: "Error", error: "Ocurrio un error en la lectura" });
        }
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ status:"Error", error: "Failed to retrieve products" });
    }
});

productsRouter.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const data = await fs.promises.readFile(path, 'utf-8');
        const productsCopy = JSON.parse(data);
        const product = productsCopy.find((p) => p.id === parseInt(pid));
        if (!product) {
            res.status(404).send({status:"Error", error:`Product with id ${pid} not found, please try another.`});
        } else {
            res.status(200).send({status:"success", payload:product});
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

productsRouter.post('/', async (req, res) => {
    const products = []
    const data = await fs.promises.readFile(path, 'utf-8');

    if (data) {
        const dataJson = JSON.parse(data);
        products.push(...dataJson)
    }

    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    // Verificar que se proporcionen los campos obligatorios
    if (!title || !description || !code || !status || !price || !stock || !category) {
        return res.status(400).json({ status:"Error", error: 'Todos los campos obligatorios deben ser proporcionados.' });
    }
    // Definir los tipos requeridos para cada campo
    const fieldTypes = {
        price: 'number',
        status: 'boolean',
        title: 'string',
        description: 'string',
        code: 'string',
        stock: 'number',
        category: 'string'
    };
    // Verificar los tipos de los campos
    const codeExist = products.find((e)=> e.code === code);
    if(codeExist){
        res.status(400).json({status:"Error", error: `Este codigo ya esta siendo utilizado`})
    }
    for (const field in fieldTypes) {
        if (typeof req.body[field] !== fieldTypes[field]) {
            return res.status(400).json({status:"Error", error: `El campo "${field}" debe ser de tipo "${fieldTypes[field]}".` });
        }
    }
    //Armado del producto
    const newProduct = {
        title: title,
        description: description,
        code: code,
        price: price,
        status: status || true,
        stock: stock,
        category: category,
        thumbnails: thumbnails || []
    };
    //Generacion de ID
    if (products.length === 0) {
        newProduct.id = 1;
    }
    else {
        newProduct.id = products[products.length - 1].id + 1
    }

    products.push(newProduct);
    await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
    res.status(201).json({ status:"success", payload: newProduct });
});



productsRouter.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const data = await fs.promises.readFile(path, 'utf-8');
    const products = JSON.parse(data);
    const productIndex = products.findIndex(product => product.id === parseInt(pid));
    
    if (productIndex === -1) {
        return res.status(404).json({ error: `Producto con id ${pid} no encontrado` });
    }

    const product = products[productIndex];
    const updatedFields = req.body;

    for (const field in updatedFields) {
        if (field in product) {
            product[field] = updatedFields[field];
        }
    }

    await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));

    res.status(200).json({ status: "success", payload: product });
});


productsRouter.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    const data = await fs.promises.readFile(path, 'utf-8');
    const products = JSON.parse(data);

    const productIndex = products.findIndex(product => product.id === parseInt(pid));

    if (productIndex === -1) {
        return res.status(404).json({ error: `Producto con id ${pid} no encontrado` });
    }
    products.splice(productIndex,1)

    await fs.promises.writeFile(path, JSON.stringify(products, null, '\t'));
    console.log(products)
    res.status(200).json({ status: "success", payload: products });
});


export default productsRouter;