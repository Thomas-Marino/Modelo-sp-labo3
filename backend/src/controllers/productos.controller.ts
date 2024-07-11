import { IRequest } from "../interfaces/IRequest";
import { IResponse } from "../interfaces/IResponse";
import { AccesoDB } from "../handlers/dbHandler";
import fs from "fs";
import * as mime from "mime-types";
import multer from "multer";
import { OkPacket, Query, queryCallback, QueryFunction, QueryOptions } from "mysql";

const pathFotos : string = "./public/fotos/";
const storage : multer.StorageEngine = multer.diskStorage({destination: pathFotos});
export const upload = multer({storage: storage});

export const ListarProductos = (req:IRequest, res:IResponse)=> 
{
    let connection = AccesoDB.CrearConexion();
    connection.query("SELECT * FROM productos", (err: any, results: string | any[])=>
    {
        if(err) {throw("Error en consulta de base de datos.")};

        res.send(JSON.stringify(results));
    });
};

export const AgregarProducto = (req: IRequest, res: IResponse) =>
{
    try
    {
        if (!req.file)
        {
            throw new Error("No se ha subido ningún archivo.");
        }

        let file = req.file;
        let extension = mime.extension(file.mimetype);
        let obj = JSON.parse(req.body.obj);
        // nuevoPath-> donde quiero guardar las fotos + codigo.extension
        let nuevoPath  =  `./public/fotos/${obj.codigo}.${extension}`; 
        // Ahora hay que mover el archivo de un path al otro.
        fs.renameSync(file.path, nuevoPath);

        obj.path = nuevoPath.split("public/")[1];

        let connection = AccesoDB.CrearConexion();
        const query : string = "INSERT INTO productos SET ?";
        connection.query(query, [obj], (err:any, results: string | any[])=>
        {
            if(err) 
            {
                console.log(err); 
                throw("Error en consulta de base de datos.");
            }

            res.status(200).json({exito: true, mensaje: "Producto agregado a la bd."});
        });
        
    }
    catch (error)
    {
        res.status(500).json({exito: false, mensaje: "Ocurrió un error."});
    }
}

export const ModificarProducto = (req: IRequest, res: IResponse) =>
{
    try
    {
        if (!req.file)
        {
            throw new Error("No se ha subido ningún archivo.");
        }

        let file = req.file;
        let extension = mime.extension(file.mimetype);
        const obj = JSON.parse(req.body.obj); // Obtengo y parseo los datos pasados por body
        // nuevoPath-> donde quiero guardar las fotos + codigo.extension
        let nuevoPath  =  `./public/fotos/${obj.codigo}.${extension}`; 
        // Ahora hay que mover el archivo de un path al otro.
        fs.renameSync(file.path, nuevoPath);

        obj.path = nuevoPath.split("public/")[1];

        let obj_modif : any = {};
        //para excluir la pk (codigo)
        obj_modif.marca = obj.marca;
        obj_modif.precio = obj.precio;
        obj_modif.path = obj.path;

        let connection = AccesoDB.CrearConexion();
        const query : string = "UPDATE productos SET ? WHERE codigo = ?";
        connection.query(query, [obj_modif, obj.codigo], (err:any, results: OkPacket)=> // OkPacket es una interfaz proporcionada por el módulo mysql para describir el resultado de una operación de modificación de la base de datos (por ejemplo, INSERT, UPDATE, DELETE).
        {
            if(err) 
            {
                console.log(err); 
                throw("Error en consulta de base de datos.");
            }

            if(results.affectedRows == 1)
            {
                res.status(200).json({exito: true, mensaje: "Una fila fue modificada en la db."});
            }
            else
            {
                borrarFoto(nuevoPath);
                res.status(500).json({exito: false, mensaje: "No se pudo modificar el producto."});
            }
        });
        
    }
    catch (error)
    {
        res.status(500).json({exito: false, mensaje: "Ocurrió un error."});
    }
}

export const EliminarProducto = (req: IRequest, res: IResponse) =>
{
    try
    {
        const obj = req.body; // Obtengo y parseo los datos pasados por body
        // ---- Realizo las querys
        let connection = AccesoDB.CrearConexion();
        const query : string = "SELECT path FROM productos WHERE codigo = ?";
        connection.query(query, [obj.codigo], (err:any, results: string | any[])=> 
        {
            if(err) 
            {
                console.log(err); 
                throw("Error en consulta de base de datos.");
            }
            // ---- Luego de verificar si el código ingresado devuelve un path, lo elimino
            if (results.length > 0)
            {
                let pathFoto = results[0].path;
                const query2 = "DELETE FROM productos WHERE codigo = ?"
                console.log("Antes de query 2")
                connection.query(query2, [obj.codigo], (err:any, results:OkPacket)=>
                {
                    console.log("En de query 2")
                    if(results.affectedRows == 1) // Si una fila fue afectada, borro la foto de /public
                    {
                        let fotoEliminada = false;

                        if(borrarFoto(`./public/${pathFoto}`))
                        {
                            fotoEliminada = true;
                        }

                        res.status(200).json({exito: true, fotoFueEliminada: fotoEliminada, mensaje: "Producto eliminado de la db."});
                    }
                    else
                    {
                        res.status(500).json({exito: false, mensaje: "No se pudo eliminar el producto de la db."});
                    }
                });
            }
            else
            {
                res.status(500).json({exito: false, mensaje: "Error. Código incorrecto!"});
            }
        });
    }
    catch (error)
    {
        res.status(500).json({exito: false, mensaje: "Ocurrió un error."});
    }
};

function borrarFoto(path_foto:string) : boolean 
{   
    let borrado : boolean = true;

    fs.unlink(path_foto, (err:any) => 
    {
        if (err)
        {
            console.log(err);
            borrado = false;
        }
        else
        {
            console.log(path_foto + ' fue borrado.');
        }
    });

    return borrado;
}