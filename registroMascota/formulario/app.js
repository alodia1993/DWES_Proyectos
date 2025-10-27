//este archivo es el q mueve los hilos.Este archivo esta en la raiz del proyecto siempre.
const express = require("express")  // esto smp, gracias a q lo hemos instalada antes
const app = express(); // una app  a instancia el objeto express q es utilizado como servidor
const path = require("path"); // para manejar las rutas

//para servir archivos estaticos q esta dentro de (public/)
app.use(express.static(path.join(__dirname, "public"))) //aqui componemnos ruta del fichero. dirname ruta absoluta. con esto le decimos q se sirva como archivo statico el index.

app.post("/form")