const URL_API : string = "http://localhost:9876/";
//CAMBIAR POR SU URL_BASE...
const URL_BASE : string = "http://localhost/lab_3/api_nodejs_front-end_jwt/";

const manejadorFetch = async (url : string, options : RequestInit):Promise<Response> => 
{
    // return await fetch(url, options).then(manejadorError);
    return await fetch(url, options);
};

// const manejadorError = (res:Response):Response => 
// {
//     if(!res.ok)
//     {
//         throw new Error(res.statusText);
//     } 

//     return res;
// };
    
function ArmarAlert(mensaje:string, tipo:string = "success"):string
{
    let alerta:string = '<div id="alert_' + tipo + '" class="alert alert-' + tipo + ' alert-dismissable">';
    alerta += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
    alerta += '<span class="d-inline-block text-truncate" style="max-width: 450px;">' + mensaje + ' </span></div>';

    return alerta;
}

function Fail(retorno:any):void 
{
    // ---- Recibo el error como parámetro y lo paso a string para luego incluirlo en el alert. 
    console.error(retorno.toString());
    let alerta:string = ArmarAlert(retorno.toString(), "danger");

    if((<HTMLDivElement>document.getElementById("div_mensaje")) !== null)
    {
        (<HTMLDivElement>document.getElementById("div_mensaje")).innerHTML = alerta;
    }
    else
    {
        (<HTMLDivElement>document.getElementById("divResultado")).innerHTML = alerta;
    }
}