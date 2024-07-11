import { IResponse } from '../interfaces/IResponse';
import { IRequest } from '../interfaces/IRequest';
import jwt from 'jsonwebtoken';
import config from "../config/jwt";

//--- Decodifica un JWT y devuelve los datos que contiene ---//
export const DecodificarToken = (tokenRecibido:string) => {return jwt.decode(tokenRecibido);}

//#01 post
export const CrearToken = (req:IRequest, res:IResponse) => 
{
    let obj_user = req.body;

    if((obj_user.usuario == "admin" || obj_user.usuario == "user") && obj_user.clave == "123456")
    {
        //SE CREA EL PAYLOAD CON LOS ATRIBUTOS QUE SE NECESITAN
        const payload = {
            usuario: obj_user.usuario,
            perfil: obj_user.usuario == "admin" ? "administrador" : "usuario",
            fecha: new Date().getTime()
        };

        //SE FIRMA EL TOKEN CON EL PAYLOAD Y LA CLAVE SECRETA
        const token = jwt.sign(payload, config.FIRMAJWT, {expiresIn : config.EXPIRACIONJWT});

        res.status(200).json({exito: true, mensaje: "JWT creado.", jwt: token });
    }
    else
    {
        res.status(403).json({exito: false, mensaje : "Usuario no registrado.",jwt : null});
    }
};

export const TestVerificarToken = (req:IRequest, res:IResponse) => 
{
    console.log("En el verbo GET/verificar_token testeando routes");
    res.json({exito:true, jwt: req.payload}); // Directamente accedo al payload, ya que el mw lo verifica.
}

export const TestSoloAdmin = (req:IRequest, res:IResponse) => 
{
    console.log("En el verbo GET/admin");
    res.json({exito:true, jwt: req.payload});
}
