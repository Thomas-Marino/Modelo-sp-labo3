import express from "express";
import { JWTRoutes } from "./src/routes/jwt.routes";
import { loginRoutes } from "./src/routes/login.routes";
import { productosRoutes } from "./src/routes/productos.routes";
import { urlencoded } from "express";
import { json } from "express";

const app = express();
//AGREGO CORS
const cors = require("cors");
app.set('puerto', 9876);
//AGREGO JSON
app.use(json());

app.use(urlencoded({extended:false}));
//AGREGO MW CORS A NIVEL DE APLICACIÓN
app.use(cors());
//DIRECTORIO DE ARCHIVOS ESTÁTICOS
app.use(express.static("public"));

app.use('/', JWTRoutes);

app.use('/', loginRoutes);

app.use('/', productosRoutes);

app.listen(app.get('puerto'), ()=>{
    console.log('Servidor corriendo sobre puerto:', app.get('puerto'));
});