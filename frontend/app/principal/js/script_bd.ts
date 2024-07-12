window.addEventListener("load", ():void => 
{
    // Cuando la página cargue, se ejecutaran las siguientes funciones
    VerificarJWT();

    AdministrarVerificarJWT();

    AdministrarLogout();

    AdministrarListar();

    AdministrarAgregar();
});
//#region VerificarJWT
async function VerificarJWT() : Promise<void> 
{    
    // ---- RECUPERO DEL LOCALSTORAGE
    let jwt : string | null = localStorage.getItem("jwt");

    try 
    {   
        // Establezco los parametros de la petición
        const opciones = {
            method: "GET",
            headers : {'Authorization': 'Bearer ' + jwt},
        };
        // Realizo la petición
        let res = await manejadorFetch(URL_API + "verificar_token", opciones);
        // Obtengo la respuesta.
        let obj_rta = await res.json();


        if(res.status == 200)
        {
            // En el caso de que exito = true, armo un alert con los datos de la respuesta.
            let app = obj_rta.jwt.api;
            let version = obj_rta.jwt.version;
            let usuario = obj_rta.jwt.usuario;

            let alerta : string = ArmarAlert("ApiRest: " + app + "<br>Versión: " + version + "<br>Usuario: " + JSON.stringify(usuario));
            
            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
           
            (<HTMLDivElement>document.getElementById("rol")).innerHTML = usuario.Rol;
        }
        else
        {
            // En el caso de que status != 200, armo un alert con el mensaje de la response de la api.
            let alerta : string = ArmarAlert(obj_rta.error, "danger");

            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;

            setTimeout(() => {location.assign("../ingreso/ingreso.html");}, 1500);
        }
    } 
    catch (err:any) 
    {
        Fail(err);
    }     
}
//#endregion
// --- Función encargada de asignar un onclick al botón verificarJWT. 
function AdministrarVerificarJWT() : void 
{    
    (<HTMLInputElement>document.getElementById("verificarJWT")).onclick = ()=>
    {
        VerificarJWT();
    };
}
// --- Función encargada de asignar un onclick al botón logout. 
function AdministrarLogout() : void 
{
    (<HTMLInputElement>document.getElementById("logout")).onclick = ()=>
    {
        //ELIMINO DEL LOCALSTORAGE
        localStorage.removeItem("jwt");

        let alerta : string = ArmarAlert('Usuario deslogueado!!!');
    
        (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;

        setTimeout(() => {location.assign("../ingreso/ingreso.html");}, 1500);
    };
}
// --- Función encargada de asignar un onclick al botón listar_producto. 
function AdministrarListar() : void 
{
    (<HTMLInputElement>document.getElementById("listar_producto")).onclick = () =>
    {
        ObtenerListadoProductos();
    };
}
// --- Función encargada de asignar un onclick al botón alta_producto. 
function AdministrarAgregar() : void 
{
    (<HTMLInputElement>document.getElementById("alta_producto")).onclick = () =>
    {
        ArmarFormularioAlta();
    };
}

//#region IMPLEMENTAR
async function ObtenerListadoProductos() : Promise<void> 
{
    // ---- RECUPERO DEL LOCALSTORAGE
    let jwt : string | null = localStorage.getItem("jwt");

    try 
    {   
        // Establezco los parametros de la petición
        const opciones = {
            method: "GET",
            headers : {'Authorization': 'Bearer ' + jwt},
        };
        // Realizo la petición
        let res = await manejadorFetch(URL_API + "productos_bd", opciones);
        // Obtengo la respuesta.
        let obj_rta = await res.json();

        if(res.status == 200)
        {
            // En el caso de que exito = true, armo un alert con los datos de la respuesta.
            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = ArmarTablaProductos(obj_rta);
            document.querySelectorAll('[data-action="modificar"]').forEach((btn:any)=>
            {
                btn.onclick = function()
                {
                    let obj_prod_string:any =this.getAttribute("data-obj_prod");
                    let obj_prod = JSON.parse(obj_prod_string);

                    let formulario = MostrarForm("modificacion",obj_prod);

                    (<HTMLDivElement>document.getElementById("cuerpo_modal_prod")).innerHTML = formulario;

                    // Agregar event listener al input file
                    let inputFoto : HTMLInputElement = <HTMLInputElement>document.getElementById("foto");
                    inputFoto.addEventListener("change", (event) => 
                    {
                        MostrarImgPreview();
                    });
                }
            });

            document.querySelectorAll('[data-action="eliminar"]').forEach((btn:any)=>
            {
                btn.onclick = function()
                {
                    let obj_prod_string:any =this.getAttribute("data-obj_prod");
                    let obj_prod = JSON.parse(obj_prod_string);

                    let formulario = MostrarForm("baja",obj_prod);

                    (<HTMLDivElement>document.getElementById("cuerpo_modal_prod")).innerHTML = formulario;
                }
            });
        }
        else
        {
            // En el caso de que status != 200, armo un alert con el mensaje de la response de la api.
            let alerta : string = ArmarAlert(obj_rta.error, "danger");

            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;

            setTimeout(() => {location.assign("../ingreso/ingreso.html");}, 1500);
        }
    }
    catch (err:any)
    {
        Fail(err);
    }
}
//#endregion

//#region ARMAR TABLA
function ArmarTablaProductos(productos : []) : string 
{   
    let tabla : string = '<table class="table table-dark table-hover">';
    tabla += '<tr><th>CÓDIGO</th><th>MARCA</th><th>PRECIO</th><th>FOTO</th><th style="width:110px">ACCIONES</th></tr>';

    if(productos.length == 0)
    {
        tabla += '<tr><td>---</td><td>---</td><td>---</td><td>---</td><th>---</td></tr>';
    }
    else
    {
        productos.forEach((prod : any) => 
        {
            tabla += "<tr><td>"+prod.codigo+"</td><td>"+prod.marca+"</td><td>"+prod.precio+"</td>"+
            "<td><img src='"+URL_API+prod.path+"' width='50px' height='50px'></td><td>"+
            "<a href='#' class='btn' data-action='modificar' data-obj_prod='"+JSON.stringify(prod)+"' title='Modificar'"+
            " data-toggle='modal' data-target='#ventana_modal_prod'><span class='fas fa-edit'></span></a>"+
            "<a href='#' class='btn' data-action='eliminar' data-obj_prod='"+JSON.stringify(prod)+"' title='Eliminar'"+
            " data-toggle='modal' data-target='#ventana_modal_prod'><span class='fas fa-times'></span></a>"+
            "</td></tr>";
        });
    }

    tabla += "</table>";

    return tabla;
}
//#endregion
//#region ARMAR ALTA
function ArmarFormularioAlta() : void
{
    (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";
    // Muestro el formulario de alta
    let formulario : string = MostrarForm("alta");

    (<HTMLDivElement>document.getElementById("cuerpo_modal_prod")).innerHTML = formulario;

    document.getElementById("btn_modal")?.click();

    // Agregar event listener al input file
    let inputFoto : HTMLInputElement = <HTMLInputElement>document.getElementById("foto");
    inputFoto.addEventListener("change", (event) => 
    {
        MostrarImgPreview();
    });
}
//#endregion
//#region MOSTRAR FORM
function MostrarForm(accion : string, obj_prod : any = null) : string 
{
    let funcion : string = "";
    let encabezado : string = "";
    let solo_lectura : string = "";
    let solo_lectura_pk : string = "readonly";

    switch (accion) {
        case "alta":
            funcion = 'Agregar(event)';
            encabezado = 'AGREGAR PRODUCTO';
            solo_lectura_pk = "";
            break;

         case "baja":
            funcion = 'Eliminar(event)';
            encabezado = 'ELIMINAR PRODUCTO';
            solo_lectura = "readonly";
            break;
    
        case "modificacion":
            funcion = 'Modificar(event)';
            encabezado = 'MODIFICAR PRODUCTO';
            break;
    }

    let codigo : string = "";
    let marca : string = "";
    let precio : string = "";
    let path : string = "../img/producto_default.png";

    if (obj_prod !== null) 
    {
        codigo = obj_prod.codigo;
        marca = obj_prod.marca;
        precio = obj_prod.precio;
        path = URL_API + obj_prod.path;       
    }

    let form:string = '<h3 style="padding-top:1em;">'+encabezado+'</h3>\
                        <div class="row justify-content-center">\
                            <div class="col-md-8">\
                                <form class="was-validated">\
                                    <div class="form-group">\
                                        <label for="codigo">Código:</label>\
                                        <input type="text" class="form-control" id="codigo" placeholder="Ingresar código"\
                                            value="'+codigo+'" '+solo_lectura_pk+' required>\
                                    </div>\
                                    <div class="form-group">\
                                        <label for="marca">Título:</label>\
                                        <input type="text" class="form-control" id="marca" placeholder="Ingresar marca"\
                                            name="marca" value="'+marca+'" '+solo_lectura+' required>\
                                        <div class="valid-feedback">OK.</div>\
                                        <div class="invalid-feedback">Valor requerido.</div>\
                                    </div>\
                                    <div class="form-group">\
                                        <label for="precio">Precio:</label>\
                                        <input type="number" class="form-control" id="precio" placeholder="Ingresar precio" name="precio"\
                                            value="'+precio+'" '+solo_lectura+' required>\
                                        <div class="valid-feedback">OK.</div>\
                                        <div class="invalid-feedback">Valor requerido.</div>\
                                    </div>\
                                    <div class="form-group">\
                                        <label for="foto">Foto:</label>\
                                        <input type="file" class="form-control" id="foto" name="foto" '+solo_lectura+' required>\
                                        <div class="valid-feedback">OK.</div>\
                                        <div class="invalid-feedback">Valor requerido.</div>\
                                    </div>\
                                    <div class="row justify-content-between"><img id="img_prod" src="'+path+'" width="400px" height="200px"></div><br>\
                                    <div class="row justify-content-between">\
                                        <input type="button" class="btn btn-danger" data-dismiss="modal" value="Cerrar">\
                                        <button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="'+funcion+'" >Aceptar</button>\
                                    </div>\
                                </form>\
                            </div>\
                        </div>';
    return form;
}
//#endregion
//#region CRUD

async function Agregar(e : any) : Promise<void> 
{  
    try
    {
        // ---- RECUPERO DEL LOCALSTORAGE
        let jwt : string | null = localStorage.getItem("jwt");
        // ---- Obtengo las los inputs
        let inputCodigo : HTMLInputElement = (<HTMLInputElement> document.getElementById("codigo"));
        let inputTitulo : HTMLInputElement = (<HTMLInputElement> document.getElementById("marca"));
        let inputPrecio : HTMLInputElement = (<HTMLInputElement> document.getElementById("precio"));
        let inputFoto : any = document.getElementById("foto");

        if(inputCodigo.value && inputTitulo.value && inputPrecio.value && inputFoto.files?.length == 1)
        {   
            let obj = {codigo: inputCodigo.value, marca: inputTitulo.value, precio: inputPrecio.value};
            
            let formData = new FormData();
            formData.append('obj', JSON.stringify(obj));
            formData.append('foto', inputFoto.files[0]);

            const opciones : object = 
            {
                method: "POST",
                headers : {'Authorization': 'Bearer ' + jwt},
                body: formData
            }
            
            let res = await manejadorFetch(URL_API + "productos_bd", opciones)
            
            let obj_response = await res.json();

            if(res.status == 200)
            {
                (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";
                
                let alerta : string = ArmarAlert(obj_response.mensaje);
                
                (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
            }
            else
            {
                // En el caso de que status != 200, armo un alert con el mensaje de la response de la api.
                (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";
                
                let alerta : string = ArmarAlert(obj_response.error, "danger");

                (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
            }
        }
        else
        {
            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";
                
            let alerta : string = ArmarAlert("Error! No puede dejar valores sin ingresar.", "danger");

            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
        }
    }
    catch (err:any) 
    {
        Fail(err);
    }  
}

async function Modificar(e : any) : Promise<void> 
{  
    // e.preventDefault();
    (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";

    try
    {

        // ---- RECUPERO DEL LOCALSTORAGE
        let jwt : string | null = localStorage.getItem("jwt");
        // ---- Obtengo las los inputs
        let inputCodigo : HTMLInputElement = (<HTMLInputElement> document.getElementById("codigo"));
        let inputTitulo : HTMLInputElement = (<HTMLInputElement> document.getElementById("marca"));
        let inputPrecio : HTMLInputElement = (<HTMLInputElement> document.getElementById("precio"));
        let imgPreview : HTMLImageElement = <HTMLImageElement> document.getElementById("img_prod");
        let inputFoto : any = document.getElementById("foto");

        if(inputTitulo.value && inputPrecio.value && inputFoto.files?.length == 1)
        {   
            let obj = {codigo: inputCodigo.value, marca: inputTitulo.value, precio: inputPrecio.value};
            
            let formData = new FormData();
            formData.append('obj', JSON.stringify(obj));
            formData.append('foto', inputFoto.files[0]);

            const opciones : object = 
            {
                method: "put",
                headers : {'Authorization': 'Bearer ' + jwt},
                body: formData
            }
            
            let res = await manejadorFetch(URL_API + "productos_bd", opciones)
            
            let obj_response = await res.json();

            if(res.status == 200)
            {
                (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";
                
                let alerta : string = ArmarAlert(obj_response.mensaje);
                
                (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
            }
            else
            {
                // En el caso de que status != 200, armo un alert con el mensaje de la response de la api.
                (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";

                let alerta : string = ArmarAlert(obj_response.error, "danger");

                (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
            }
        }
        else
        {
            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";
                
            let alerta : string = ArmarAlert("Error! No puede dejar valores sin ingresar.", "danger");

            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
        }
    }
    catch (err:any) 
    {
        Fail(err);
    }
}

function Eliminar(e : any) : void 
{
    e.preventDefault();
    
    let codigo = (<HTMLInputElement>document.getElementById("codigo")).value;
    
    (<HTMLDivElement>document.getElementById("cuerpo_modal_confirm")).innerHTML = '\<h5>¿Está seguro de eliminar el producto '+codigo+'?</h5> \
    <input type="button" class="btn btn-danger" data-dismiss="modal" value="NO" style="float:right;margin-left:5px">\
    <button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="ContinuarEliminar('+codigo+')" style="float:right">Sí </button>';

    document.getElementById("btn_modal_confirm")?.click();

}

async function ContinuarEliminar(codigo : any) : Promise<void>
{
    // e.preventDefault();
    (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";

    try
    {
        // ---- RECUPERO DEL LOCALSTORAGE
        let jwt : string | null = localStorage.getItem("jwt");

        let codigoParseado = parseInt(codigo);
        let objBody = {codigo: codigoParseado};
        console.log(objBody);

        const opciones : object = 
        {
            method: "DELETE",
            headers : {'Authorization': 'Bearer ' + jwt, "Content-Type": "application/json"},
            body: JSON.stringify(objBody)
        }
            
        let res = await manejadorFetch(URL_API + "productos_bd", opciones)
            
        let obj_response = await res.json();

        if(res.status == 200)
        {
            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";
            
            let alerta : string = ArmarAlert(obj_response.mensaje);
            
            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
        }
        else
        {
            // En el caso de que status != 200, armo un alert con el mensaje de la response de la api.
            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";

            let alerta : string = ArmarAlert(obj_response.error, "danger");

            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
        }
    }
    catch (err:any) 
    {
        Fail(err);
    }
}
//#region MstrarPreview
// Se aplica en la linea 182 para alta
function MostrarImgPreview(): void 
{
    let imgPreview : HTMLImageElement = <HTMLImageElement> document.getElementById("img_prod")
    let inputFoto : any = document.getElementById("foto"); 

    if (inputFoto.files[0])
    {
        imgPreview.src = URL.createObjectURL(inputFoto.files[0]);
    }
}
//#endregion
//#endregion