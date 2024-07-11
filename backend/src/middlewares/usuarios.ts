import { AccesoDB } from "../handlers/dbHandler";
import { IRequest } from "../interfaces/IRequest";
import { IResponse } from "../interfaces/IResponse";
import { NextFunction } from "express";

/**
 * Middleware que cumple con la función de verificar si un usuario existe en la db.
 * Si el usuario existe, pasará al próximo calleable y asignará los datos del usuario en res.obj_usuario.
 * Si el usuario no existe, lanzará status 403 y no pasará al próximo calleable.
 * 
 */
export const VerificarUsuario = (req:IRequest, res:IResponse, next:NextFunction) => 
{
    let datosBody = req.body;

    let connection = AccesoDB.CrearConexion();
    const query : string = "SELECT * FROM usuarios WHERE legajo = ? AND apellido = ? ";
    connection.query(query, [datosBody.legajo, datosBody.apellido], (err: any, results: string | any[])=>
    {
        if(err) {return res.status(500).json({exito:false, error:"Error en la query."})};
        
        if(results.length == 1)
        {
            res.obj_usuario = results[0];
            console.log("Usuario encontrado");
            connection.end((err) => 
            {
                if (err) 
                {
                    console.error("Error al cerrar la conexión: " + err.message);
                } 
                else 
                {
                    console.log("Conexión cerrada correctamente.");
                }
            });
            next();
        }
        else
        {
            console.log("Usuario no encontrado");
            res.status(403).json(
            {
                exito : false,
                mensaje : "Apellido y/o Legajo incorrectos.",
                obj_usuario : null
            });
        }
    });
};

export const VerificarRolUsuario = (req:IRequest, res:IResponse, next:NextFunction) => 
{
    //SE RECUPERA EL PAYLOAD DEL JWT DEL OBJETO DE LA RESPUESTA DE VERIFICAR JWT
    let payload = req.payload;

    if(payload.usuario.Rol == "administrador")
    {
        next();
    }
    else
    {
        return res.status(401).json({mensaje:"NO tiene el rol necesario para realizar la acción."});
    }
};

export const VerificarRolesUsuarioAdmSup = (req:IRequest, res:IResponse, next:NextFunction) => 
{
    //SE RECUPERA EL PAYLOAD DEL JWT DEL OBJETO DE LA RESPUESTA DE VERIFICAR JWT
    let payload = req.payload;

    if(payload.usuario.Rol == "administrador" || payload.usuario.Rol == "supervisor")
    {
        next();
    }
    else
    {
        return res.status(401).json({mensaje:"NO tiene el rol necesario para realizar la acción."});
    }
};