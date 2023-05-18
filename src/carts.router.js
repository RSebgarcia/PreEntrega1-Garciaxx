import { Router } from "express";

const cartsRouter = Router();

cartsRouter.get('/', (req, res) => {
    // Lógica para listar todos los productos de la base
    const test  =[]
    res.send(test)
});

cartsRouter.get('/:cid', (req, res) => {
    // Lógica para traer un producto por su id
});

cartsRouter.post('/', (req, res) => {
    // Lógica para agregar un nuevo producto
});

cartsRouter.put('/:cid', (req, res) => {
    // Lógica para actualizar un producto existente por su id
});

cartsRouter.delete('/:cid', (req, res) => {
    // Lógica para eliminar un producto por su id
});


export default cartsRouter;