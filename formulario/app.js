//este archivo es el q mueve los hilos.Este archivo esta en la raiz del proyecto siempre. recibe peticiones de clientes
//back end puro

const express = require("express")  // para poder simualr servidor. esto smp, gracias a q lo hemos instalada antes
const app = express(); // una app  a instancia el objeto express q es utilizado como servidor
const path = require("path"); // para manejar las rutas
const PORT = 3000;

//LIBRERIA FECHAS
const dayjs = require("dayjs"); // activamos libreria js. importamos parquete dayjs y pq trabajremos con fechas
require("dayjs/locale/es");  //le damos la region  en la q trabajmos, con la configuracion fechas española.
dayjs.locale("es");  //damos etiqueta de idioma.Por si hago pagina multiidoma quizas interesa q formato d fechs sea corrspondiente al pais.

//LIBRERIA COOKIES
const cookieParser = require('cookie-parser'); //creamos objeto cookier parser
//LIBRERIA PARA SESIONES
const session = require("express-session");


//para servir archivos estaticos q esta dentro de (public/)

app.use(express.static(path.join(__dirname, "public"))) //express es el servidor, el q renderiza el html.  aqui componemnos ruta del fichero. dirname ruta absoluta. con esto le decimos q se sirva como archivo statico el index.

app.set("view engine", "ejs"); //configuramos los ejs

app.use(express.urlencoded({ extended : true }));// para poder recibir variables en la url tenemos q activar express, es decir elservidor, el urlencoded,  asi q se puedan codificar en la url el envio de variables.

//vamos a llamar cookieParser,arriba creamos el obejeto, aqui  lo vamos a utilizar, es la forma de decírselo.
app.use(cookieParser());



app.use(express.json()); //middleware para procesar peticiones con json.

//cuando creemos el objeto sesion hay opciones q tenemos q configurar. Por ejempl: configurar una clave para firma informacion q se guarde en la sesion en el navegador.
app.use(session({

    secret: "clave para sesiones", 
    resave: false, // si pones true, se va a estar autoguardando haya o no haya cambios. si es false, solo se guarda cuando hay cambio.
    saveUninitialized:  false,//lo recomendable es ponerlo false. El concepto "sesionvacia": existe pero no tiene dato de usuario.No deberia de persistir. si este parametro esta en false: evitamos q se guarden las sesiones y si cierra. ejemplo entras al banco, cierras navegador, vuelves a la misma url : el banco ha cerrado por seguridad.En thepower, si vuelves si vuelve a enseñarte la ultima pagina q tenias.
    cookie: {
      httpOnly:true,
      maxAge: 1000 * 60 * 30// con esto decimos q las cookeis asociadas a esta sesion duran como maximo 30minutos. 1000 ,un segundo, por un minuto, por 30 minutos como max.
    }

}));

// para agotar el tiempo de espera y //esto es como montar un contador. aSI EL CLIENTE NO ESPERA D FORMA INFINITA SI NO CARGA.
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

function requiereAuth(req, res, next){ //*next* dice: si esto se cumple, sigue hacia delante, si no, no.
    if(req.session.user) return next();
    res.redirect("/login");
}



app.get("/login", (req, res) => {
    res.render("login", {error:null} )    //render es para renderizar pagina, q se enseñe en el navegador.La variable error vaa ser null.
});

app.post("/login",(req, res) =>{  //usuario y contraseña van a viajar como variable.
    const { usuario, password} = req.body;

    //simulamos comprobacion.
    if(usuario && password === "1234"){

        req.session.user = {nombre: usuario} //aqui estoy guardando dentro de req.session.user.nombre.
        
        return res.redirect("/perfil");   // .render le decimos : construye esta pagina , renderiza este arichivo.ejs y t enviop esta info. Pero .redirect es comunicacion interna, denteo del servidor.
    }

    res.status(401).render("login", {error: "Usuario o contraseña incorrectos."})  //401 es codigo generico para cuando no esta autorizado a entrar.

});
app.get("/perfil", requiereAuth,  (req,res) => {   //si queremos q un recurso este protegido por la sesion usamos funcion callback con la funcionrequiereAuth

    const user = req.session.user;
    res.render("perfil", {user});

});

app.post("/logout", (req,res) =>{
    req.session.destroy(() => {    //SALIMOS DE LA SESION.
        res.redirect("/login"); //VOLVEMOS A LOGIN.
    });

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

    let intereses = req.body.intereses || []; //la forma de capturarlo es igual. si intereses no tiene valor, no es null, es igual a vector sin elementos dentro.
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