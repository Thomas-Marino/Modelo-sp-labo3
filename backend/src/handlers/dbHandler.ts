import mysql from "mysql";

export class AccesoDB
{
    // private static connection : mysql.Connection;
    public static CrearConexion() : mysql.Connection
    {
        return mysql.createConnection({host: 'localhost', port: 3306, user: 'root', password: '', database: 'productos_usuarios_node'});
    }
};