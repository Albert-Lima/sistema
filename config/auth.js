const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
require("../models/User")
const Usuarios = mongoose.model("Usuario")

module.exports = function(passport){
    passport.use(new localStrategy(
        {usernameField: 'email', passwordField: 'senha'},
        (email, senha, done)=>{
            Usuarios.findOne({email: email}).then((usuarios)=>{
                if(!usuarios){
                    return done(null,false, {message: "conta não cadastrada"})
                }
                bcrypt.compare(senha, usuarios.senha, (erro, batem)=>{
                    if(batem){
                        return done(null, usuarios)
                    }else{
                        return done(null, false, {message: "senha incorreta"})
                    }
                })
            })
        }
    ))
    passport.serializeUser((usuarios, done)=>{
        done(null, usuarios.id)
    })
    passport.deserializeUser((id, done)=>{
        Usuarios.findById(id).then((usuarios)=>{
            done(null, usuarios)
        }).catch(error =>{
            done(error, null)
        })
    })
}