const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const { writeFile, readFile } = require("fs/promises");
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/voto", async (req, res) => {
  try {
    let { nombre, tipoPlato } = req.body;
    const nuevoVoto = new Voto({
      nombre,
      tipoPlato,
      fecha: new Date(),
    });
    const result = await nuevoVoto.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
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
    res.status(200).json(cantsPorTipo);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});

module.exports = app;
