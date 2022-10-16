const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const Voto = require("./models/Voto");


process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || "dev";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/boda";
mongoose.connect(process.env.MONGODB_URI, {}, (err) => {
  if (err) {
    console.error("Ocurrio un error " + err);
  } else {
    console.log("Conexion exitosa");
  }
});

console.log("ENV>", process.env.NODE_ENV);
console.log("MONGO>", process.env.MONGODB_URI);
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res) => {
  res.redirect('index.html')
})

app.post("/api/voto", async (req, res) => {
  try {
    let { nombre, tipoPlato, canciones } = req.body;
    const nuevoVoto = new Voto({
      nombre,
      tipoPlato: tipoPlato || "Sin especificar",
      canciones: canciones || "Sin especificar",
      fecha: new Date(),
    });
    const result = await nuevoVoto.save();
    res.redirect('/gracias.html')
  } catch (error) {
    console.log(error);
    res.redirect('/error.html')
  }
});

app.get("/api/results", async (req, res) => {
  try {
    const data = await Voto.find({});
    const tipos = ["CON_CARNE", "VEGANO", "APTO_CELIACO"];
    const cantsPorTipo = tipos.map((t) => {
      const filtrados = data.filter((v) => v.tipoPlato === t);
      return {
        tipoPlato: t,
        cant: filtrados.length,
        votantes: filtrados.map((v) => v.nombre),
      };
    });
    const lasCanciones = data.filter(d => d.canciones).map(d => {return {
      nombre: d.nombre,
      canciones: d.canciones
    }});
    res.status(200).json({cantsPorTipo, lasCanciones});
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});

module.exports = app;
