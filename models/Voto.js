const mongoose = require("mongoose");

const votoSchema = new mongoose.Schema({
    nombre: String,            
    tipoPlato: String,
    canciones: String,
    fecha: Date
})

const Voto = mongoose.model("votos", votoSchema);

module.exports = Voto;