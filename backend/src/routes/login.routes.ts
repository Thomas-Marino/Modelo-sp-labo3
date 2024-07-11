import { Router } from 'express';
import { IniciarSesion } from '../controllers/usuarios.controller';
import { VerificarUsuario } from '../middlewares/usuarios';

export const loginRoutes = Router();

loginRoutes.post('/login', VerificarUsuario , IniciarSesion);