//este archivo es el q mueve los hilos.Este archivo esta en la raiz del proyecto siempre. recibe peticiones de clientes
//back end puro
const express = require("express")  // para poder simualr servidor. esto smp, gracias a q lo hemos instalada antes
const app = express(); // una app  a instancia el objeto express q es utilizado como servidor
const path = require("path"); // para manejar las rutas
const PORT = 3000;

//para servir archivos estaticos q esta dentro de (public/)
app.use(express.static(path.join(__dirname, "public"))) //express es el servidor, el q renderiza el html.  aqui componemnos ruta del fichero. dirname ruta absoluta. con esto le decimos q se sirva como archivo statico el index.

app.set("view engine", "ejs"); //configuramos los ejs

app.use(express.urlencoded({ extended : true }));// para poder recibir variables en la url tenemos q activar express, es decir elservidor, el urlencoded,  asi q se puedan codificar en la url el envio de variables.

app.use(express.json()); //middleware para procesar peticiones con json.

// para agoptar el tiempo de espera y //esto es como montar un contador. aSI EL CLIENTE NO ESPERA D FORMA INFINITA SI NO CARGA.
app.use ((req, res, next)=> { 

    const ms = 10000; // milisegundos. 10 segundos.

    const timer = setTimeout(() =>{
        if(!res.headersSent){
            console.warn("Tiempo de espera agotado");
            res.status(408).send("Tiempo de espera agotado")  // tipo de error 408.
        }
    }, ms); 

    res.once("finish",() => clearTimeout(timer));  // ante el evento q se paso como pirmer parametro ejecuta lo q le pasamos como segundo parametro.
    res.once("clase",() => clearTimeout(timer));  // controlamos q el cliente cierra antes de los 10 segundos, ya no esta activo no habria que enviar nada.

    next(); 
}); 



app.get("/form", (req, res)=> {


        res.render("form", {
            nombre: "",  //lo pasamos vacio para q no salga el mensaje de warning y si no pone valor pues sale vacio.
            edad:"",
            ciudad:"",
            intereses:[]
        });
});
app.post("/form",(req, res) => {
    const nombre = req.body.nombre; // estoy scando el cuerpo de la peticion ,el nombre
    const edad = req.body.edad;
    const ciudad = req.body.ciudad;

    let intereses = req.body.intereses || []; //la forma de capturarlo es igual. si intereses no tiene valor, no es null, es igual a ve tor sin elementos dentro.
    if (!Array.isArray(intereses)) {
        intereses = [intereses]};  // COMPRUEBO SI LO Q VIENE EN INTERESES EN UN ARRAY.SI ESTO SE CUMPLE ES Q S HA ENVIADO UNA VARIABLE INDEPENDIENTE

    let errores = [];// porq puede haber mas de un error, aqui se guardan. valido q haya nombre y no haya espacios.
    if(!nombre || nombre.trim().length < 2){   // trim se usa para quitar los espacios del final y al principio.
        errores.push("El nombre tiene que tener mínimo de 2 caracteres");
    }
    if(!ciudad ) { 
        errores.push("La ciudad no puede estar vacia.");
    }
    //vamos a plantear 2 escenarios : //
    //1.Ha habido errores de validacion. Esto son comprobacion de validaciones del lado del cliente. En el html del formulario montamos unos mensajes de color rojo q diga"nombre debe de tener mas de 2 caracteres" "la ciudad no puede qudar vacia"
    if(errores.length){
        return res
        .status(400) // es como decir eh aqui ha ocurrido algo. Bad Request: los datos enviados para procesar post , no son adecuados, no cumolken con validaciones...
        .render("form", {nombre, edad, ciudad, intereses, errores });
    }

    // si no ha habido errores ,vamos a una pagina nueva.
    res.render("resultado",{    
        nombre,
        edad : edad || null,
        ciudad,
        intereses
    });
    //como ejercicio: 
    //montar una pagina resultado , RESULTADO E.que componga un mensaje que diga:
    //tu nombre es tal, tu edad es tal(IF CON LA EDAD PARA DECIR eres mayor o menos de edad)  vives en.. tus interes son... 
    //programo el resultadoe.js y lo hago utilizando lo mismo que hemos hecho hasta ahora. es completar el resultado.ejs
    // el objetivo no es hacerlo de cero, es con este codigo que ya tengo, lo pueda moficicar para tener estos mensajes incluso con las mismas variables.
    //: tu nombre es :--- y si no existe: sin nombre. Edad: si no viene: no has indicado la edad. Tienex x añis. eres mayor de edad o eres menor de edad
    // eres de tal ciudad, si no hau¡y, noindicada.intereses.. y link para volver a inicio.
});

    
app.listen(PORT, () => {
    console.log(`Servidor escuchando en: ${PORT}`);
}) //arrancar el servidor.