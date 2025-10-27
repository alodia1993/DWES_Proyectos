//importamos el framework express, esto nos permite crear un servidor web de forma sencilla
const express = require("express");

//creamos instancia en la app express, es decir en nustro servidor

const app = express();

//importamos el módulo path de Node.js para manejar rutas de archivos de forma segura.
const path = require("path");

//definimos  el puerto donde escuchará el servidor, en este caso 3000
const PORT = 3000;

// ahora vamos a indicar en la carpeta public que queremos servir archivos estativos,lo que nos permite acceder directamente a archivos como index.html css o imágenes.
app.use(express.static(path.join(__dirname, "public")));

//ahora le decimos que vamos a usar el motor de plantillas EJS para renderizar vistas dinamicas.
app.set("view engine", "ejs");

//ahora vamos a hacer que cuando alguien entre a http://localhost:3000/saludo salga su nombre

app.get("/bienvenida",(req,res) => { // aqui el cliente pide la url de bienvenida.
    res.render("bienvenida", {nombre:"Alodía"});
});

//esta parte para la edad perruna
app.get("/edadPerruna/:edadHumana", (req, res) => {
   const edadHumana = Number(req.params.edadHumana); // es como decirle el numero requerido del parametro edad humana ya viene dado en la url.
   if(isNaN(edadHumana) || edadHumana<=0) {
    return res.status(400).send('Por favor ingresa una edad humana válida.');
   }
    const edadPerruna = edadHumana*7;
   res.send((`Tu perro tendría ${edadPerruna} años humanos.`));
    });

//ahora vamos a generar un array con numeros impares que devuelva como JSON estos números.

app.get("/numerosImpares",(req, res)=>{      // defino la ruta y la llamada y respuesta req y res.
    const impares = [];
    for(let i=1;i<=15;i++){  //1%2=1, es true, entra, hace push. el 0 no entra, no hace push.
        if(i%2) {impares.push(i);

        } 
    }
    res.json(impares);
})  

//INICIAMOS EL SERVIDOR EN EL PUERTO QUE ELEJIMOS ANTES
app.listen(PORT, () =>{
    console.log(`Servidor en http://localhost:${PORT}`);
});

