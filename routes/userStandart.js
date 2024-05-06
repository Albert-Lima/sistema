const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../config/auth")
const passport = require("passport")

require("../models/User")
const Usuarios = mongoose.model("Usuario")

require("../models/Procedimentos")
const Procedimentos = mongoose.model("Procedimento")

router.get("/login", (req, res)=>{
    res.render("login")
})
router.post("/login", (req, res, next)=>{
    passport.authenticate("local", (err, user, info)=>{
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log("Usuário não encontrado")
            // Se a autenticação falhar, redireciona para a página de login com uma mensagem de erro
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }
            // Verifica o campo eAdmin do usuário para determinar o redirecionamento
            if (user.eAdmin === true) {
                return res.redirect("/admin")
            } else {
                return res.redirect("/user")
            }
        })
    })(req, res, next)
})

router.get("/user", async (req, res) => {
    try {
        const procedimentos = await Procedimentos.find().sort({ data: "desc" }).lean();
        const usuarios = await Usuarios.find().lean();

        res.render("layouts/usuarioPadrão/index", { procedimentos: procedimentos, usuarios: usuarios });
    } catch (err) {
        req.flash("error_msg", "Houve um erro ao carregar os dados");
        res.redirect("/login")
    }
});

module.exports = router