const mongoose = require("mongoose")

const UsuariosSchema = new mongoose.Schema({
    nome:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    },
    eAdmin:{
        type: Boolean,
    }
})
module.exports = mongoose.model('Usuario', UsuariosSchema, "usuarios")