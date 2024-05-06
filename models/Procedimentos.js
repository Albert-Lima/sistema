const mongoose = require("mongoose")

const ProcedimentoSchema = new mongoose.Schema({
    nomeProcedimento:{
        type: String,
        required: true
    },
    aVista:{
        type: String,
        required: true,
        default: 0
    },
    parcelado:{
        type: String,
        required: true,
        default: 0
    }
})
module.exports = mongoose.model('Procedimento', ProcedimentoSchema, "procedimentos")