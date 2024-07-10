window.addEventListener("load", ():void => {

    VerificarJWT();

    AdministrarVerificarJWT();

    AdministrarLogout();

    AdministrarListar();

    AdministrarAgregar();

});

async function VerificarJWT() : Promise<void> {
    
    //RECUPERO DEL LOCALSTORAGE
    let jwt : string | null = localStorage.getItem("jwt");

    try {

        const opciones = {
            method: "GET",
            headers : {'Authorization': 'Bearer ' + jwt},
        };

        let res = await manejadorFetch(URL_API + "verificar_token", opciones);

        let obj_rta = await res.json();

        console.log(obj_rta);

        if(obj_rta.exito){

            let app = obj_rta.jwt.api;
            let version = obj_rta.jwt.version;
            let usuario = obj_rta.jwt.usuario;

            let alerta : string = ArmarAlert("ApiRest: " + app + "<br>Versión: " + version + "<br>Usuario: " + JSON.stringify(usuario));
            
            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
           
            (<HTMLDivElement>document.getElementById("rol")).innerHTML = usuario.Rol;
        }
        else{

            let alerta : string = ArmarAlert(obj_rta.mensaje, "danger");

            (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;

            setTimeout(() => {
                location.assign(URL_BASE + "index.html");
            }, 1500);
        }

    } catch (err:any) {

        Fail(err);
    }     
}

function AdministrarVerificarJWT() : void {
    
    (<HTMLInputElement>document.getElementById("verificarJWT")).onclick = ()=>{

        VerificarJWT();
    };
}

function AdministrarLogout() : void {

    (<HTMLInputElement>document.getElementById("logout")).onclick = ()=>{

        //ELIMINO DEL LOCALSTORAGE
        localStorage.removeItem("jwt");

        let alerta : string = ArmarAlert('Usuario deslogueado!!!');
    
        (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;

        setTimeout(() => {
            location.assign(URL_BASE + "index.html");
        }, 1500);

    };
}

function AdministrarListar() : void {

    (<HTMLInputElement>document.getElementById("listar_producto")).onclick = ()=>{

        ObtenerListadoProductos();
    };
}

function AdministrarAgregar() : void {

    (<HTMLInputElement>document.getElementById("alta_producto")).onclick = ()=>{

        ArmarFormularioAlta();
    };
}

//#region IMPLEMENTAR...

async function ObtenerListadoProductos() : Promise<void> {

    
}

//#endregion

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
        productos.forEach((prod : any) => {

            tabla += "<tr><td>"+prod.codigo+"</td><td>"+prod.marca+"</td><td>"+prod.precio+"</td>"+
            "<td><img src='"+URL_API+prod.path+"' width='50px' height='50px'></td><th>"+
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

function ArmarFormularioAlta() : void
{
    (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = "";

    let formulario : string = MostrarForm("alta");

    (<HTMLDivElement>document.getElementById("cuerpo_modal_prod")).innerHTML = formulario;

    document.getElementById("btn_modal")?.click();
}

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
    let path : string = URL_BASE + "/img/producto_default.png";

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

//#region CRUD

async function Agregar(e : any) : Promise<void> 
{  
    //IMPLEMENTAR...
}

async function Modificar(e : any) : Promise<void> 
{  
    //IMPLEMENTAR...
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
    //IMPLEMENTAR...
}

//#endregion