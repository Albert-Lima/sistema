const express = require("express")
const PDFDocument = require('pdfkit')
const app = express()

//CONFIG
    //mongoose
        const mongoose = require("mongoose")
        mongoose.connect("mongodb+srv://albertsousalima:albertlima123@usuarios.hakilte.mongodb.net/").then(()=>{
            console.log("mongoDB conectado com sucesso")
        }).catch((err)=>{
            console.log("erro ao conectar com o mongoDB: "+err)
        })

    //static files
        app.use(express.static('public'))

    //Handlebars
        const handlebars = require("express-handlebars")
        app.engine('handlebars', handlebars.engine({defaultLayout: 'main'}))
        app.set("view engine", "handlebars")

    //bodyParser
        const bodyParser = require("body-parser")
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())

    //MIDLEWARES
        const session = require("express-session")
        const passport = require("passport")
        require("./config/auth")(passport)
        const flash = require("connect-flash")

        app.use(session({
            secret: "albertlimaKey",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
        app.use((req, res, next)=>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })




//Rotas
    //LoginMain essa será a rota de entrada na aplicação
        app.get("/", (req, res)=>{
            res.redirect("/login")
        })
    //rotas usuário padrão
        const usuariosPadrao = require("./routes/userStandart")
        app.use("/", usuariosPadrao)
    //rotas usuário admin
        const usuarioAdmin = require("./routes/admin")
        app.use("/", usuarioAdmin)
    //recebendo dados e enviando para a  página de renderização do pdf
        app.post('/generatepdf', (req, res) => {
            const dadosRecebidos = req.body;
            console.log('Dados recebidos do cliente:', dadosRecebidos);
            req.session.dadosRecebidos =  dadosRecebidos
            console.log('Dados armazenados na sessão:', req.session.dadosRecebidos);
            res.redirect('/generatepdf');
        });

        // Rota para renderizar a página com os dados recebidos
            app.get('/generatepdf', (req, res) => {
            
                const dados = req.session.dadosRecebidos
                const procedimentosDecisaoFalse = dados.procedimentos.filter(procedimento => procedimento.decisao === false)
                console.log("dados: "+ dados)
                console.log("dados false:"+ procedimentosDecisaoFalse)
                res.render('layouts/usuarioPadrão/generatepdf', {dados: dados, procedimentosDecisaoFalse: procedimentosDecisaoFalse}); 
            });
            
            app.post('/montarpdf', (req, res) => {
                const { content } = req.body;

                // Armazena o conteúdo HTML recebido
                htmlContent = content;

                // Responde com sucesso
                res.sendStatus(200);
            });
                app.get('/printpdf', (req, res) => {
                
                    const renderedPage = `
                    <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style>
                            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                            *{
                                margin: 0px;
                                padding: 0px;
                            }
                            :root{
                                --var-cor-bordas: #ACACAC;
                                --var-cor-buttonAuth: #0000a9;
                                --var-cor-blueSoft: #228BE6;
                                --var-cor-Success: #44bd5a;
                                --var-cor-Error: #FA5252;
                                --var-Font-Inter: "Inter", sans-serif;
                            }
                            .body{
                                width: 100vw;
                                height: 141vw;
                                overflow: scroll;
                            }
                            .pdf{
                                margin: auto;
                                position: relative;
                                width: 100vw;
                                height: 141vw;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: start;
                                padding-bottom: 150px;
                            }
                            .img_logo_pdf{
                                background-image: url('/imagens/WhatsApp Image 2024-05-02 at 13.59.25.jpeg');
                                background-size: cover;
                                background-position: center center;
                                width: 100%;
                                height: 80mm;
                            }
                            .infoPacient{
                                margin: auto;
                                margin-top: 20px;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: start;
                                height: 50px;
                                width: 90%;
                                font-family: var(--var-Font-Inter);
                                font-size: 17pt;
                                font-weight: 600;
                                color: black;
                            }
                            .caixa_procedimentos{
                                margin: auto;
                                margin-top: 20px;
                                width: 90%;
                            }
                            .caixa_colunas{
                                height: max-content;
                                width: 100%;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: space-between;
                            }
                            .caixa_proced{
                                height: 60px;
                                width: 60%;
                                border: 2px solid black;
                                font-family: var(--var-Font-Inter);
                                font-size: 12pt;
                                font-weight: 600;
                                color: rgb(29, 29, 29);
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: center;
                                margin-right: 1px;
                            }
                            .caixa_valor{
                                height: 60px;
                                width: 40%;
                                border: 2px solid black;
                                font-family: var(--var-Font-Inter);
                                font-size: 12pt;
                                font-weight: 600;
                                color: rgb(29, 29, 29);
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: center;
                                margin-left: 1px;
                            }
                            .section_data_orc{
                                width: 100%;
                                margin-top: 2px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: space-between;
                                gap: 2px;
                            }
                            .fatherprocedDiv{
                                height: max-content;
                                width: 100%;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: space-between;
                                gap: 2px;
                            }
                            .sonProcedimento{
                                height: 60px;
                                width: 60%;
                                border: 2px solid black;
                                font-family: var(--var-Font-Inter);
                                font-size: 11pt;
                                font-weight: 400;
                                color: rgb(71, 71, 71);
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: center;
                            }
                            .sonValor{
                                height: 60px;
                                width: 40%;
                                border: 2px solid black;
                                font-family: var(--var-Font-Inter);
                                font-size: 10pt;
                                font-weight: 400;
                                color: rgb(71, 71, 71);
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: center;
                                text-align: center;
                            }
                            .section_present{
                                margin-top: 30px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                font-family: var(--var-Font-Inter);
                                font-size: 11pt;
                                font-weight: 600;
                                color: rgb(40, 40, 40);
                            }
                            .section_total_some{
                                margin-top: 30px;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                justify-content: center;
                                font-family: var(--var-Font-Inter);
                                font-size: 11pt;
                                font-weight: 600;
                                color: rgb(40, 40, 40);
                            }
                            .section_total_dobout{
                                margin-top: 30px;
                                display: flex;
                                flex-direction: row;
                                align-items: center;
                                justify-content: center;
                                font-family: var(--var-Font-Inter);
                                font-size: 11pt;
                                font-weight: 600;
                                color: rgb(40, 40, 40);
                            }
                            .assinatura{
                                position: absolute;
                                bottom: 30px;
                                right: 0px;
                                background-image: url('/imagens/WhatsApp Image 2024-05-05 at 22.02.03.jpeg');
                                background-size: cover;
                                height: 150px;
                                width: 300px;
                            }
                            .data{
                                position: absolute;
                                bottom: 80px;
                                left: 50px;
                            }
                            </style>
                            <title>Print PDF</title>
                        </head>
                        <body>
                            ${htmlContent}
                            
                            <script>
                                // Função para imprimir a página assim que estiver totalmente carregada
                                window.onload = function() {
                                    window.print();
                                };
                            </script>
                        </body>
                        </html>
                    `;
                    res.send(renderedPage);
                });
        
app.listen(8081, ()=>{
    console.log("servidor rodando na porta 8081")
})