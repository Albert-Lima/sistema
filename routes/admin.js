const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//MODELS
require("../models/User")
const Usuarios = mongoose.model("Usuario")


//ROTAS
router.get("/cadastro", (req, res)=>{
    res.render("layouts/admin/cadastro")
})
router.post("/cadastro", (req, res)=>{
    var erros = [];
    if(!req.body.nome || typeof req.body.nome === undefined || req.body.nome === null){
        erros.push({texto: "Nome inválido"});
    }
    if(!req.body.senha || typeof req.body.senha === undefined || req.body.senha === null){
        erros.push({texto: "Senha inválida"});
    }
    if(!req.body.email || typeof req.body.email === undefined || req.body.email === null){
        erros.push({texto: "Email inválido"});
    }
    if(req.body.senha.length < 8){
        erros.push({texto: "Senha menor que 8 dígitos"});
    }
    if(req.body.senha !== req.body.senhaConfirm){
        erros.push({texto: "Senhas incompatíveis"});
    }

    if(erros.length > 0){
        res.render("layouts/admin/cadastro", {erros: erros});
        console.error("Erros no cadastro: "+ erros[0].texto);
    }else{
        // Verifica se o email já está cadastrado
        Usuarios.findOne({ email: req.body.email })
            .then(usuario => {
                if (usuario) {
                    erros.push({texto: "Email já cadastrado, tente outro"});
                    res.render("layouts/admin/cadastro", {erros: erros});
                    console.error("Email já cadastrado");
                } else {
                    const eAdminChecked = req.body.eAdmin === 'on';
                    const novoUsuario = new Usuarios({
                        nome: req.body.nome,
                        email: req.body.email,
                        senha: req.body.senha,
                        eAdmin: eAdminChecked
                    });

                    bcrypt.genSalt(10, (erro, salt)=>{
                        bcrypt.hash(novoUsuario.senha, salt, (erro, hash)=>{
                            if(erro){
                                req.flash("error_msg", "Houve um erro durante o salvamento");
                                res.redirect("/admin")
                            }else{
                                novoUsuario.senha = hash;
                                novoUsuario.save()
                                    .then(usuario =>{
                                        if(eAdminChecked){
                                            console.log("Usuário cadastrado como admin");
                                            req.flash("success_msg", "Usuário cadastrado");
                                            res.redirect('/admin');
                                        } else {
                                            console.log("Usuário cadastrado como padrão");
                                            req.flash("success_msg", "Usuário cadastrado");
                                            res.redirect('/admin');
                                        }
                                    })
                                    .catch((err)=>{
                                        console.error("Houve um erro ao cadastrar o usuário: " + err);
                                        req.flash("error_msg", "Erro interno ao cadastrar usuário");
                                        res.redirect("/admin");
                                    });
                            }
                        });
                    });
                }
            })
            .catch(err => {
                console.error("Houve um erro ao verificar o email cadastrado: " + err);
                req.flash("error_msg", "Erro interno ao verificar email cadastrado");
                res.redirect("/admin");
            });
    }
});

//painel admin
router.get("/admin", async (req, res) => {
    try {
        const procedimentos = await Procedimentos.find().sort({ data: "desc" }).lean();
        const usuarios = await Usuarios.find().lean();

        res.render("layouts/admin/index", { procedimentos: procedimentos, usuarios: usuarios });
    } catch (err) {
        req.flash("error_msg", "Houve um erro ao carregar os dados");
        res.redirect("/login")
    }
});

    //rota add procedimento
    require("../models/Procedimentos")
    const Procedimentos = mongoose.model("Procedimento")
    router.post("/novoprocedimento", (req, res)=>{
        const novoProcedimento = new Procedimentos({
            nomeProcedimento: req.body.nomeProcedimento,
            aVista: req.body.aVista,
            parcelado: req.body.parcelado
        });
        novoProcedimento.save().then(()=>{
            console.log("adicionou um novo procedimento")
            res.redirect("/admin")
        }).catch((err)=>{
            console.log("houve um erro ao adicionar um novo procedimento: "+err)
            res.redirect("/admin")
        })
    })
    //rota salvar edit procedimento
    router.post("/edit", (req, res)=>{
        Procedimentos.findByIdAndUpdate({_id: req.body.id}).then((procedimento)=>{
            procedimento.nomeProcedimento = req.body.nomeProcedimento
            procedimento.aVista = req.body.aVista
            procedimento.parcelado = req.body.parcelado

            procedimento.save().then(()=>{
                console.log("procedimento editado com sucesso")
                req.flash("success_msg", "procedimento editado com sucesso")
                res.redirect("/admin")
            }).catch((err)=>{
                req.flash("error_msg", "erro ao editar procedimento")
                res.redirect("/admin")
            })
        })
    })

    //rota deletar procedimento
    router.post("/deleteproced", (req, res)=>{
        Procedimentos.deleteOne({_id: req.body.id}).then(()=>{
            console.log("procedimento deletado")
            req.flash("success_msg", "procedimneto deletado")
            res.redirect("/admin")
        }).catch((err)=>{
            console.log("erro ao deletar procedimento")
            req.flash("error_msg", "erro ao deletar procedimento")
            res.redirect("/admin")
        })
    })

    //rota para tornar admin
    router.post("/turnuser", (req, res)=>{
        Usuarios.findByIdAndUpdate({_id: req.body.id}).then((usuario)=>{
            usuario.eAdmin = "true"

            usuario.save().then(()=>{
                console.log("o usuario agora é um admin")
                req.flash("success_msg", "o usuário agora é um admin")
                res.redirect("/admin")
            }).catch((err)=>{
                console.log("erro ao definir usuario como admin")
                req.flash("error_msg", "erro ao definir usuario como admin")
                res.redirect("/admin")
            })
        })
    })

    //rota para deletar usuário
    router.post("/deleteuser", (req, res)=>{
        Usuarios.findByIdAndDelete({_id: req.body.id}).then(()=>{
            console.log("usuário deletado: "+req.body.nome)
            req.flash("success_msg", "usuário deletado: "+req.body.nome)
            res.redirect("/admin")
        }).catch((err)=>{
            req.flash("error_msg", "erro ao deletar usuário")
            res.redirect("/admin")
        })
    })




module.exports = router