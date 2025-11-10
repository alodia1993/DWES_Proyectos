const express = require("express")
const app = express();
const path = require("path");
const PORT = 3000;

app.set("view engine", "ejs"); //configuramos los ejs

app.use(express.static(path.join(__dirname, "public")))

app.use(express.urlencoded({ extended : true }));

app.use(express.json()); 


app.get ("/evento", (req, res)=> {

    res.render("evento", {
        nombre:"",
        fecha:"",
        ciudad:"",
        tipo: 'presencial', //este es un valor por defecto
        intereses: [] ,
        registrar:"",
        errores: []
    });
});

app.post("/evento", (req, res) => {
    const nombre = req.body.nombre;
    const fecha = req.body.fecha;
    const fechaEvento = new Date(fecha);
    const hoy = new Date ();
    hoy.setHours(0, 0, 0, 0);
    const ciudad = req.body.ciudad;
    const tipo = req.body.tipo; // PREGUNTO.
    
    let intereses = req.body.intereses || [];
    if(!Array.isArray(intereses)){
        intereses = [intereses]};
    
    let errores = [];
    if(!nombre || nombre.trim().length < 3){
        errores.push("El nombre del evento no puede ser tan corto");
    }

    if(!fecha){
        errores.push("Es obligtoria la fecha del evento");
    } else if( fechaEvento < hoy ){
        errores.push("La fecha no puede ser anterior al día de hoy.");       
    }

    if(!ciudad || ciudad === ''){
        errores.push("La ciudad es obligatoria");
    }
    
    if(!tipo){
        errores.push("Debes selecciona el tipo de evento: presencial/online.");
    }

    if(errores.length){
        return res
        .status(400)
        .render("evento", {nombre,fecha,ciudad,tipo,intereses, errores});
    }
    res.render("evento-ok", {
        nombre,
        fecha,
        ciudad,
        tipo,
        intereses
    });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en: ${PORT}`);
});
