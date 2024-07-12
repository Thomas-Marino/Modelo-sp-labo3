namespace Main
{
    export async function Login() 
    {
        let dato :any = {};
        dato.legajo = (<HTMLInputElement>document.getElementById("legajo")).value;
        dato.apellido = (<HTMLInputElement>document.getElementById("apellido")).value;

        let form : FormData = new FormData();
        form.append('obj', JSON.stringify(dato));

        const opciones = 
        {
            method: "POST",
            body: JSON.stringify(dato),//dato,
            headers: {"Accept": "*/*", "Content-Type": "application/json"},
        };

        try 
        {
            let res = await manejadorFetch(URL_API + "login", opciones);
            
            let obj_ret = await res.json(); 
            
            console.log(obj_ret);

            let alerta:string = "";

            if(obj_ret.exito)
            {
                //GUARDO EN EL LOCALSTORAGE
                localStorage.setItem("jwt", obj_ret.jwt);                

                alerta = ArmarAlert(`${obj_ret.mensaje} redirigiendo a principal.html...`);
    
                setTimeout(() => { location.assign("../principal/principal.html"); }, 1200);
            }
            else
            {
                alerta = ArmarAlert(obj_ret.mensaje, "danger");
            }

            (<HTMLDivElement>document.getElementById("div_mensaje")).innerHTML = alerta;

        } 
        catch (err:any) 
        {        
            Fail(err);
        }
    }

}