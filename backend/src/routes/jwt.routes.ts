import { Router } from 'express';
import { CrearToken, DecodificarToken, TestSoloAdmin, TestVerificarToken } from '../controllers/jwt.controller';
import { SoloAdmin, verificarToken } from '../middlewares/jwt';

export const JWTRoutes = Router();

JWTRoutes.post('/crear_token', CrearToken);

JWTRoutes.get('/verificar_token', verificarToken, TestVerificarToken);

JWTRoutes.get('/admin', verificarToken, SoloAdmin, TestSoloAdmin);