window.addEventListener("load", ():void => {
 
    (<HTMLInputElement>document.getElementById("btnForm")).onclick = (e:any)=>{

        e.preventDefault();

        Main.Login();
    }

});

namespace Main{

    export async function Login() {

        let legajo = (<HTMLInputElement>document.getElementById("legajo")).value;
        let apellido = (<HTMLInputElement>document.getElementById("apellido")).value;

        let dato:any = {};
        dato.legajo = legajo;
        dato.apellido = apellido;

        let form : FormData = new FormData();
        form.append('obj', JSON.stringify(dato));

        const opciones = {
            method: "POST",
            body: JSON.stringify(dato),//dato,
            headers: {"Accept": "*/*", "Content-Type": "application/json"},
        };

        try {

            let res = await manejadorFetch(URL_API + "login", opciones);
        
            let obj_ret = await res.json(); 
            
            console.log(obj_ret);

            let alerta:string = "";

            if(obj_ret.exito){
                //GUARDO EN EL LOCALSTORAGE
                localStorage.setItem("jwt", obj_ret.jwt);                

                alerta = ArmarAlert(obj_ret.mensaje + " redirigiendo al principal.php...");
    
                setTimeout(() => {
                    location.assign(URL_BASE + "principal.html");
                }, 2000);
            }
            else
            {
                alerta = ArmarAlert(obj_ret.mensaje, "danger");
            }

            (<HTMLDivElement>document.getElementById("div_mensaje")).innerHTML = alerta;

        } catch (err:any) {
        
            Fail(err);
        }
    }

}