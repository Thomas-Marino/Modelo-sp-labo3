"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
window.addEventListener("load", () => {
    VerificarJWT();
    AdministrarVerificarJWT();
    AdministrarLogout();
    AdministrarListar();
    AdministrarAgregar();
});
function VerificarJWT() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = localStorage.getItem("jwt");
        try {
            const opciones = {
                method: "GET",
                headers: { 'Authorization': 'Bearer ' + jwt },
            };
            let res = yield manejadorFetch(URL_API + "verificar_token", opciones);
            let obj_rta = yield res.json();
            if (res.status == 200) {
                let app = obj_rta.jwt.api;
                let version = obj_rta.jwt.version;
                let usuario = obj_rta.jwt.usuario;
                let alerta = ArmarAlert("ApiRest: " + app + "<br>Versión: " + version + "<br>Usuario: " + JSON.stringify(usuario));
                document.getElementById("divResultado").innerHTML = alerta;
                document.getElementById("rol").innerHTML = usuario.Rol;
            }
            else {
                let alerta = ArmarAlert(obj_rta.error, "danger");
                document.getElementById("divResultado").innerHTML = alerta;
                setTimeout(() => { location.assign("../ingreso/ingreso.html"); }, 1500);
            }
        }
        catch (err) {
            Fail(err);
        }
    });
}
function AdministrarVerificarJWT() {
    document.getElementById("verificarJWT").onclick = () => {
        VerificarJWT();
    };
}
function AdministrarLogout() {
    document.getElementById("logout").onclick = () => {
        localStorage.removeItem("jwt");
        let alerta = ArmarAlert('Usuario deslogueado!!!');
        document.getElementById("divResultado").innerHTML = alerta;
        setTimeout(() => { location.assign("../ingreso/ingreso.html"); }, 1500);
    };
}
function AdministrarListar() {
    document.getElementById("listar_producto").onclick = () => {
        ObtenerListadoProductos();
    };
}
function AdministrarAgregar() {
    document.getElementById("alta_producto").onclick = () => {
        ArmarFormularioAlta();
    };
}
function ObtenerListadoProductos() {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = localStorage.getItem("jwt");
        try {
            const opciones = {
                method: "GET",
                headers: { 'Authorization': 'Bearer ' + jwt },
            };
            let res = yield manejadorFetch(URL_API + "productos_bd", opciones);
            let obj_rta = yield res.json();
            if (res.status == 200) {
                document.getElementById("divResultado").innerHTML = ArmarTablaProductos(obj_rta);
                document.querySelectorAll('[data-action="modificar"]').forEach((btn) => {
                    btn.onclick = function () {
                        let obj_prod_string = this.getAttribute("data-obj_prod");
                        let obj_prod = JSON.parse(obj_prod_string);
                        let formulario = MostrarForm("modificacion", obj_prod);
                        document.getElementById("cuerpo_modal_prod").innerHTML = formulario;
                        let inputFoto = document.getElementById("foto");
                        inputFoto.addEventListener("change", (event) => {
                            MostrarImgPreview();
                        });
                    };
                });
                document.querySelectorAll('[data-action="eliminar"]').forEach((btn) => {
                    btn.onclick = function () {
                        let obj_prod_string = this.getAttribute("data-obj_prod");
                        let obj_prod = JSON.parse(obj_prod_string);
                        let formulario = MostrarForm("baja", obj_prod);
                        document.getElementById("cuerpo_modal_prod").innerHTML = formulario;
                    };
                });
            }
            else {
                let alerta = ArmarAlert(obj_rta.error, "danger");
                document.getElementById("divResultado").innerHTML = alerta;
                setTimeout(() => { location.assign("../ingreso/ingreso.html"); }, 1500);
            }
        }
        catch (err) {
            Fail(err);
        }
    });
}
function ArmarTablaProductos(productos) {
    let tabla = '<table class="table table-dark table-hover">';
    tabla += '<tr><th>CÓDIGO</th><th>MARCA</th><th>PRECIO</th><th>FOTO</th><th style="width:110px">ACCIONES</th></tr>';
    if (productos.length == 0) {
        tabla += '<tr><td>---</td><td>---</td><td>---</td><td>---</td><th>---</td></tr>';
    }
    else {
        productos.forEach((prod) => {
            tabla += "<tr><td>" + prod.codigo + "</td><td>" + prod.marca + "</td><td>" + prod.precio + "</td>" +
                "<td><img src='" + URL_API + prod.path + "' width='50px' height='50px'></td><td>" +
                "<a href='#' class='btn' data-action='modificar' data-obj_prod='" + JSON.stringify(prod) + "' title='Modificar'" +
                " data-toggle='modal' data-target='#ventana_modal_prod'><span class='fas fa-edit'></span></a>" +
                "<a href='#' class='btn' data-action='eliminar' data-obj_prod='" + JSON.stringify(prod) + "' title='Eliminar'" +
                " data-toggle='modal' data-target='#ventana_modal_prod'><span class='fas fa-times'></span></a>" +
                "</td></tr>";
        });
    }
    tabla += "</table>";
    return tabla;
}
function ArmarFormularioAlta() {
    var _a;
    document.getElementById("divResultado").innerHTML = "";
    let formulario = MostrarForm("alta");
    document.getElementById("cuerpo_modal_prod").innerHTML = formulario;
    (_a = document.getElementById("btn_modal")) === null || _a === void 0 ? void 0 : _a.click();
    let inputFoto = document.getElementById("foto");
    inputFoto.addEventListener("change", (event) => {
        MostrarImgPreview();
    });
}
function MostrarForm(accion, obj_prod = null) {
    let funcion = "";
    let encabezado = "";
    let solo_lectura = "";
    let solo_lectura_pk = "readonly";
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
    let codigo = "";
    let marca = "";
    let precio = "";
    let path = "../img/producto_default.png";
    if (obj_prod !== null) {
        codigo = obj_prod.codigo;
        marca = obj_prod.marca;
        precio = obj_prod.precio;
        path = URL_API + obj_prod.path;
    }
    let form = '<h3 style="padding-top:1em;">' + encabezado + '</h3>\
                        <div class="row justify-content-center">\
                            <div class="col-md-8">\
                                <form class="was-validated">\
                                    <div class="form-group">\
                                        <label for="codigo">Código:</label>\
                                        <input type="text" class="form-control" id="codigo" placeholder="Ingresar código"\
                                            value="' + codigo + '" ' + solo_lectura_pk + ' required>\
                                    </div>\
                                    <div class="form-group">\
                                        <label for="marca">Título:</label>\
                                        <input type="text" class="form-control" id="marca" placeholder="Ingresar marca"\
                                            name="marca" value="' + marca + '" ' + solo_lectura + ' required>\
                                        <div class="valid-feedback">OK.</div>\
                                        <div class="invalid-feedback">Valor requerido.</div>\
                                    </div>\
                                    <div class="form-group">\
                                        <label for="precio">Precio:</label>\
                                        <input type="number" class="form-control" id="precio" placeholder="Ingresar precio" name="precio"\
                                            value="' + precio + '" ' + solo_lectura + ' required>\
                                        <div class="valid-feedback">OK.</div>\
                                        <div class="invalid-feedback">Valor requerido.</div>\
                                    </div>\
                                    <div class="form-group">\
                                        <label for="foto">Foto:</label>\
                                        <input type="file" class="form-control" id="foto" name="foto" ' + solo_lectura + ' required>\
                                        <div class="valid-feedback">OK.</div>\
                                        <div class="invalid-feedback">Valor requerido.</div>\
                                    </div>\
                                    <div class="row justify-content-between"><img id="img_prod" src="' + path + '" width="400px" height="200px"></div><br>\
                                    <div class="row justify-content-between">\
                                        <input type="button" class="btn btn-danger" data-dismiss="modal" value="Cerrar">\
                                        <button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="' + funcion + '" >Aceptar</button>\
                                    </div>\
                                </form>\
                            </div>\
                        </div>';
    return form;
}
function Agregar(e) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let jwt = localStorage.getItem("jwt");
            let inputCodigo = document.getElementById("codigo");
            let inputTitulo = document.getElementById("marca");
            let inputPrecio = document.getElementById("precio");
            let inputFoto = document.getElementById("foto");
            if (inputCodigo.value && inputTitulo.value && inputPrecio.value && ((_a = inputFoto.files) === null || _a === void 0 ? void 0 : _a.length) == 1) {
                let obj = { codigo: inputCodigo.value, marca: inputTitulo.value, precio: inputPrecio.value };
                let formData = new FormData();
                formData.append('obj', JSON.stringify(obj));
                formData.append('foto', inputFoto.files[0]);
                const opciones = {
                    method: "POST",
                    headers: { 'Authorization': 'Bearer ' + jwt },
                    body: formData
                };
                let res = yield manejadorFetch(URL_API + "productos_bd", opciones);
                let obj_response = yield res.json();
                if (res.status == 200) {
                    document.getElementById("divResultado").innerHTML = "";
                    let alerta = ArmarAlert(obj_response.mensaje);
                    document.getElementById("divResultado").innerHTML = alerta;
                }
                else {
                    document.getElementById("divResultado").innerHTML = "";
                    let alerta = ArmarAlert(obj_response.error, "danger");
                    document.getElementById("divResultado").innerHTML = alerta;
                }
            }
            else {
                document.getElementById("divResultado").innerHTML = "";
                let alerta = ArmarAlert("Error! No puede dejar valores sin ingresar.", "danger");
                document.getElementById("divResultado").innerHTML = alerta;
            }
        }
        catch (err) {
            Fail(err);
        }
    });
}
function Modificar(e) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        document.getElementById("divResultado").innerHTML = "";
        try {
            let jwt = localStorage.getItem("jwt");
            let inputCodigo = document.getElementById("codigo");
            let inputTitulo = document.getElementById("marca");
            let inputPrecio = document.getElementById("precio");
            let imgPreview = document.getElementById("img_prod");
            let inputFoto = document.getElementById("foto");
            if (inputTitulo.value && inputPrecio.value && ((_a = inputFoto.files) === null || _a === void 0 ? void 0 : _a.length) == 1) {
                let obj = { codigo: inputCodigo.value, marca: inputTitulo.value, precio: inputPrecio.value };
                let formData = new FormData();
                formData.append('obj', JSON.stringify(obj));
                formData.append('foto', inputFoto.files[0]);
                const opciones = {
                    method: "put",
                    headers: { 'Authorization': 'Bearer ' + jwt },
                    body: formData
                };
                let res = yield manejadorFetch(URL_API + "productos_bd", opciones);
                let obj_response = yield res.json();
                if (res.status == 200) {
                    document.getElementById("divResultado").innerHTML = "";
                    let alerta = ArmarAlert(obj_response.mensaje);
                    document.getElementById("divResultado").innerHTML = alerta;
                }
                else {
                    document.getElementById("divResultado").innerHTML = "";
                    let alerta = ArmarAlert(obj_response.error, "danger");
                    document.getElementById("divResultado").innerHTML = alerta;
                }
            }
            else {
                document.getElementById("divResultado").innerHTML = "";
                let alerta = ArmarAlert("Error! No puede dejar valores sin ingresar.", "danger");
                document.getElementById("divResultado").innerHTML = alerta;
            }
        }
        catch (err) {
            Fail(err);
        }
    });
}
function Eliminar(e) {
    var _a;
    e.preventDefault();
    let codigo = document.getElementById("codigo").value;
    document.getElementById("cuerpo_modal_confirm").innerHTML = '\<h5>¿Está seguro de eliminar el producto ' + codigo + '?</h5> \
    <input type="button" class="btn btn-danger" data-dismiss="modal" value="NO" style="float:right;margin-left:5px">\
    <button type="submit" class="btn btn-primary" data-dismiss="modal" onclick="ContinuarEliminar(' + codigo + ')" style="float:right">Sí </button>';
    (_a = document.getElementById("btn_modal_confirm")) === null || _a === void 0 ? void 0 : _a.click();
}
function ContinuarEliminar(codigo) {
    return __awaiter(this, void 0, void 0, function* () {
        document.getElementById("divResultado").innerHTML = "";
        try {
            let jwt = localStorage.getItem("jwt");
            let codigoParseado = parseInt(codigo);
            let objBody = { codigo: codigoParseado };
            console.log(objBody);
            const opciones = {
                method: "DELETE",
                headers: { 'Authorization': 'Bearer ' + jwt, "Content-Type": "application/json" },
                body: JSON.stringify(objBody)
            };
            let res = yield manejadorFetch(URL_API + "productos_bd", opciones);
            let obj_response = yield res.json();
            if (res.status == 200) {
                document.getElementById("divResultado").innerHTML = "";
                let alerta = ArmarAlert(obj_response.mensaje);
                document.getElementById("divResultado").innerHTML = alerta;
            }
            else {
                document.getElementById("divResultado").innerHTML = "";
                let alerta = ArmarAlert(obj_response.error, "danger");
                document.getElementById("divResultado").innerHTML = alerta;
            }
        }
        catch (err) {
            Fail(err);
        }
    });
}
function MostrarImgPreview() {
    let imgPreview = document.getElementById("img_prod");
    let inputFoto = document.getElementById("foto");
    if (inputFoto.files[0]) {
        imgPreview.src = URL.createObjectURL(inputFoto.files[0]);
    }
}
//# sourceMappingURL=script_bd.js.map