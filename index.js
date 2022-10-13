
const path = require('path')
const express = require("express");
const bodyParser = require("body-parser");
const { writeFile, readFile } = require("fs/promises");

process.env.PORT = process.env.PORT || 3000;
process.env.DATA_PATH = path.resolve(__dirname, '/data/data.json');

const app = express();

const vots = [];
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

async function leer(filePath) {
  try {
    return await (await readFile(filePath)).toString();
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

app.post("/api/voto", async (req, res) => {
  try {
    let { nombre, tipoPlato } = req.body;
    const nuevoVoto = {
      nombre,
      tipoPlato,
      fecha: new Date()
    };
    const data = JSON.parse(await leer(process.env.DATA_PATH));
    data.push(nuevoVoto);
    await writeFile(process.env.DATA_PATH, JSON.stringify(data));
    res.status(200).json(data);
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
});

app.get("/api/results", async (req, res) => {
  const data =  JSON.parse(await leer(process.env.DATA_PATH));
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
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});

module.exports = app;
