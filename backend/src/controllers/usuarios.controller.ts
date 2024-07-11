import { IResponse } from '../interfaces/IResponse';
import { IRequest } from '../interfaces/IRequest';
import jwt from 'jsonwebtoken';
import config from "../config/jwt";
import { AccesoDB } from '../handlers/dbHandler';

// -> Post -> Verificar jwt -> Verificar Usuario -> IniciarSesion
export const IniciarSesion = (req:IRequest, res:IResponse)=> 
{
    //SE RECUPERA EL USUARIO DEL OBJETO DE LA RESPUESTA DEL MW VERIFICAR USUARIO
    const user = res.obj_usuario;

    //SE CREA EL PAYLOAD CON LOS ATRIBUTOS QUE SE NECESITAN
    const payload = 
    { 
        usuario: 
        {
            Id : user.id,
            Apellido : user.apellido,
            Nombre : user.nombre,
            Rol : user.rol
        }
    };

    //SE FIRMA EL TOKEN CON EL PAYLOAD Y LA CLAVE SECRETA
    const token = jwt.sign(payload, config.FIRMAJWT, {expiresIn : "5m"});

    res.status(200).json({exito : true, mensaje : "JWT creado!!!",jwt : token});
};