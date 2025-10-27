const express = require("express") //simula servidor
const app = express(); //para instanciar el objeto express
const path = require("path"); // para las rutas
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public"))); // componemos la rutam del html, dirname nos lleva a la ruta absoluta y el index sera nuestro archhivo estatico.

app.set("view engine", "ejs"); // le digo que use el ejs como motor.
app.use(express.urlencoded({extended : true})); // nos permite recibir variables en la url y q s puedan codificar

app.use(express.json());

app.get("/form" , (req, res)=> {  // esta ruta solo se encarga de mostrar el formulario

    res.render("form",{
        nombre:"",
        edad:"",
        tipo:"",
        tamanio:"" ,
        actividades:[],
        errores: [],
    })
});

app.post("/form", (req,res)=>{ // esta otra ruta se encarga de recibir los datos,  validarlos y decidir si el proceso ha sidp existoso.
    const nombre = req.body.nombre;  // validamos en los errores que minimo son dos caracteres
    const edad = req.body.edad; // validamos edad >=0
    const tipo = req.body.tipo;
    const tamanio = req.body.tamanio;
    const actividades = req.body.actividades || [];

    let errores = [];
    if(!nombre || nombre.trim().length < 2){
        errores.push("El nombre debe de tener mínimo 2 caracteres")
    }
    if(!edad)  {
        errores.push("La edad de la mascota es obligatoria.")
    }  else if (edad < 0 ){
        errores.push("La edad no peude ser un numero menor de 0.");
    }
    if(!tamanio) {
        errores.push("Debes seleccionar el tamaño de la mascota" );
    }
    if(!tipo){
        errores.push("Debes seleccionar el tipo de mascota que quieres registar.")
    }

    if(errores.length > 0){ 
        res.render("form",{   //ya que res.render es la funcion de express q muestra la plantilla ejs, aqui lo ponemos porque queremos que si hay errores vuelva a mostrarse pero con esos mensajes de errores y los valores que el usuario habia puesto antes.
            errores,
            nombre,
            edad,
            tipo,
            tamanio,
            actividades,
    });
     } else {
       
        const mascota = {
            nombre,
            edad,
            tipo,
            tamanio,
            actividades
        };
        res.render("Resultado", {mascota: mascota});
     };

});

 app.listen(PORT, () => {
        console.log(`Servidor escuchando en: ${PORT}`);
     });