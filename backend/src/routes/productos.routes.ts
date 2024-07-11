import { Router } from 'express';
import { verificarToken } from '../middlewares/jwt';
import { AgregarProducto, EliminarProducto, ListarProductos, ModificarProducto, upload } from '../controllers/productos.controller';
import { VerificarRolesUsuarioAdmSup } from '../middlewares/usuarios';

export const productosRoutes = Router();

productosRoutes.get("/productos_bd", verificarToken, ListarProductos);

productosRoutes.post("/productos_bd", verificarToken, upload.single("foto"), AgregarProducto);

productosRoutes.put("/productos_bd", verificarToken, upload.single("foto"), VerificarRolesUsuarioAdmSup, ModificarProducto);

productosRoutes.delete("/productos_bd", verificarToken, VerificarRolesUsuarioAdmSup, EliminarProducto);