import jwt from "jsonwebtoken";
import config from "../config/jwt";
import { NextFunction } from "express";
import { IRequest } from "../interfaces/IRequest";
import { IResponse } from "../interfaces/IResponse";

//--- Verifica la estructura, expiracion y validez de un token - (Es una funcion Middleware [next]) ---//
export const verificarToken = (req:IRequest, res:IResponse, next:NextFunction) : void | IResponse => 
{
    //--- Se obtiene el token ---//
    const auth = req.headers.authorization;
    
    if (!auth) 
    {
        return res.status(401).json({error:"Error es requerido el ingreso de un JWT."});
    }
    else
    {
        try 
        {
            //--- Se verifica el token y se sigue el recorrido de la consulta ---//
            const token = auth.split(" ")[1];
            const decoded : string | jwt.JwtPayload = jwt.verify(token, config.FIRMAJWT);
            req.payload = decoded;
            // console.log(req.payload);
            next();
        } 
        catch (error) 
        {
            return res.status(401).json({error:"El JWT NO es válido."});
        }
    }
};

export const SoloAdmin = (req:IRequest, res:IResponse, next:NextFunction) : void | IResponse => 
{
    if(req.payload)
    {
        let payload : jwt.JwtPayload = req.payload; //Se recupera el payload del JWT del objeto de la respuesta.
        if(payload.perfil == "administrador")
        {
            next(); // Se invoca al próximo callable.
        }
        else
        {
            return res.status(403).json({mensaje:"No tiene permisos."});
        }
    }
    else
    {
        return res.status(401).json({error:"Antes de verificar los permisos debe verificarse el token(MW)."});
    }
};