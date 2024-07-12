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
const URL_API = "http://localhost:9876/";
const URL_BASE = "http://localhost/lab_3/api_nodejs_front-end_jwt/";
const manejadorFetch = (url, options) => __awaiter(void 0, void 0, void 0, function* () {
    return yield fetch(url, options);
});
function ArmarAlert(mensaje, tipo = "success") {
    let alerta = '<div id="alert_' + tipo + '" class="alert alert-' + tipo + ' alert-dismissable">';
    alerta += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
    alerta += '<span class="d-inline-block text-truncate" style="max-width: 450px;">' + mensaje + ' </span></div>';
    return alerta;
}
function Fail(retorno) {
    console.error(retorno.toString());
    let alerta = ArmarAlert(retorno.toString(), "danger");
    if (document.getElementById("div_mensaje") !== null) {
        document.getElementById("div_mensaje").innerHTML = alerta;
    }
    else {
        document.getElementById("divResultado").innerHTML = alerta;
    }
}
//# sourceMappingURL=funciones.js.map