//funcionalidades para montagem de orçamento ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
var bttSeeLista = document.querySelector("#seeList")
var listaItens = document.querySelector("#listaItens")
var seeListImg = document.querySelector(".seeListImg")

//abre a lista para selecionar os procedimentos
function ShowList(){
    listaItens.style.display = "block"
    seeListImg.style.transform = "rotate(0deg)"
    seeListImg.style.transition = "0.2s"

    bttSeeLista.removeEventListener("click", ShowList)
    bttSeeLista.addEventListener("click", CloseList)
    function CloseList(){
        bttSeeLista.removeEventListener("click", CloseList)
        bttSeeLista.addEventListener("click", ShowList)

        listaItens.style.display = "none"
        seeListImg.style.transform = "rotate(180deg)"
        seeListImg.style.transition = "0.2s"
    }
}
bttSeeLista.addEventListener("click", ShowList)

    //adiciona os dados dos procedimentos e os guarda em um array
    function capturarDados() {
    // Seleciona todos os formulários dentro da lista
    var forms = document.querySelectorAll('#listaItens form');
    
    // Array para armazenar os objetos
    var data = [];

    // Itera sobre cada formulário
    forms.forEach(function(form) {
        // Verifica se o checkbox está selecionado
        var checkbox = form.querySelector('input[type=checkbox]');
        if (checkbox.checked) {
            // Extrai os valores dos campos
            var procedimento = {
                id: checkbox.value,
                nome: form.querySelector('label').innerText,
                quantidade: parseInt(form.querySelector('input[name=quantidade]').value),
                aVista: parseFloat(form.querySelector('input[name=aVista]').value.replace(',', '.')).toFixed(2), // Converter para número, substituir vírgula por ponto e limitar a 2 casas decimais
                parcelado: parseFloat(form.querySelector('input[name=parcelado]').value.replace(',', '.')).toFixed(2), // Converter para número, substituir vírgula por ponto e limitar a 2 casas decimais
                decisao: form.querySelector('select[name=decisão]').value === 'true' // converte para booleano
            };

            // Adiciona o objeto ao array
            data.push(procedimento);
        }
    });

    // Calcular a soma dos valores aVista e parcelado
    var somaAVista = data.reduce(function(total, procedimento) {
        return total + parseFloat(procedimento.aVista * procedimento.quantidade);
    }, 0);

    var somaParcelado = data.reduce(function(total, procedimento) {
        return total + parseFloat(procedimento.parcelado * procedimento.quantidade);
    }, 0);

    // Exibir os dados na div newTotal
    var containerTotal = document.querySelector(".total_pre_see");
    var newTotal = document.createElement('div');

    // Limpar conteúdo anterior
    containerTotal.innerHTML = '';

    newTotal.textContent = "Investimento total: R$ " + somaParcelado.toFixed(2) + " em até 12x ou R$ " + somaAVista.toFixed(2) + " à vista.";
    containerTotal.appendChild(newTotal);

    // Exibir os dados na div newDobout, se necessário
    var containerDobout = document.querySelector(".dobout_pre_see");
    var newDobout = document.createElement("div");

    // Limpar conteúdo anterior
    containerDobout.innerHTML = '';

    if (data.some(function(procedimento) { return procedimento.decisao === false })) {
        var somaAVistaSemFalse = data.filter(function(procedimento) {
            return procedimento.decisao !== false;
        }).reduce(function(total, procedimento) {
            return total + parseFloat(procedimento.aVista * procedimento.quantidade);
        }, 0);

        var somaParceladoSemFalse = data.filter(function(procedimento) {
            return procedimento.decisao !== false;
        }).reduce(function(total, procedimento) {
            return total + parseFloat(procedimento.parcelado * procedimento.quantidade);
        }, 0);

        var nomesProcedimentosEmDuvida = data.filter(function(procedimento) {
            return procedimento.decisao === false;
        }).map(function(procedimento) {
            return procedimento.nome;
        }).join(', ');

        newDobout.textContent = "Investimento sem " + nomesProcedimentosEmDuvida + ": R$ " + somaParceladoSemFalse.toFixed(2) + " em até 12x ou R$ " + somaAVistaSemFalse.toFixed(2) + " à vista.";
        containerDobout.appendChild(newDobout);
    }

    // Exibe o array no console para verificação
    console.log(data);
    return data;
}

var bttAtualizar = document.querySelector("#atualizarSeleção");
bttAtualizar.addEventListener("click", function() {
    // Limpar conteúdo anterior antes de chamar capturarDados
    document.querySelector(".total_pre_see").innerHTML = '';
    document.querySelector(".dobout_pre_see").innerHTML = '';
    capturarDados();
})

    //mostrar section para selecionar present
    document.addEventListener("DOMContentLoaded", function () {
        const yPresent = document.getElementById("yPresent");
        const nPresent = document.getElementById("nPresent")
        const sectionSelectPresent = document.querySelector(".section_select_present");

        // Função para verificar se o radio "sim" está selecionado
        function checkRadio() {
            if (yPresent.checked) {
                sectionSelectPresent.style.display = "flex";
            } else if(nPresent.checked) {
                sectionSelectPresent.style.display = "none";
            }
        }

        // Executar a função quando a página é carregada e quando um radio é clicado
        checkRadio();
        yPresent.addEventListener("click", checkRadio);
        nPresent.addEventListener("click", checkRadio)
    });
    //mostrar e recolher lista de presents
    var bttSeeListaPresent = document.querySelector("#seeListPresent")
    var listaPresent = document.querySelector("#listaItensPresent")
    var seeListPresentImg = document.querySelector(".seeListPresentImg")

    function ShowListPresent(){
        listaPresent.style.display = "block"
        seeListPresentImg.style.transform = "rotate(0deg)"
        seeListPresentImg.style.transition = "0.2s"

        bttSeeListaPresent.removeEventListener("click", ShowListPresent)
        bttSeeListaPresent.addEventListener("click", CloseListPresent)
        function CloseListPresent(){
            bttSeeListaPresent.removeEventListener("click", CloseListPresent)
            bttSeeListaPresent.addEventListener("click", ShowListPresent)

            listaPresent.style.display = "none"
            seeListPresentImg.style.transform = "rotate(180deg)"
            seeListPresentImg.style.transition = "0.2s"
        }
    }
    bttSeeListaPresent.addEventListener("click", ShowListPresent)
    
    //funcionalidade para a coleta de dados da lista de presentes
    function capturarDadosPresent() {
        // Seleciona todos os formulários dentro da lista
        var formsPresent = document.querySelectorAll('#listaItensPresent form');
        
        // Array para armazenar os objetos
        var dataPresent = [];
    
        // Itera sobre cada formulário
        formsPresent.forEach(function(form) {
            // Verifica se o checkbox está selecionado
            var checkbox = form.querySelector('input[type=checkbox]');
            if (checkbox.checked) {
                // Extrai os valores dos campos
                var procedimentoPresent = {
                    id: checkbox.value,
                    nome: form.querySelector('label').innerText,
                    aVista: parseFloat(form.querySelector('input[name=aVista]').value) // Converter para número
                };
                // Adiciona o objeto ao array
                dataPresent.push(procedimentoPresent);
            }
        });
    
        // Calcular a soma dos valores de aVista
        var somaAVista = dataPresent.reduce(function(total, procedimento) {
            return total + procedimento.aVista;
        }, 0);
    
        // Criar uma string com os nomes dos procedimentos
        var nomesProcedimentos = dataPresent.map(function(procedimento) {
            return procedimento.nome;
        }).join(', ');
    
        // Exibir os dados na div
        var containerPresentSee = document.querySelector(".present_pre_see");
        var newPresent = document.createElement('div');
    
        // Limpar conteúdo anterior
        containerPresentSee.innerHTML = '';
    
        newPresent.textContent = "Dr./Dra. está dando de presente R$ " + somaAVista.toFixed(2) + " em procedimentos (" + nomesProcedimentos + ")";
        containerPresentSee.appendChild(newPresent);
    
        // Exibe o array no console para verificação
        console.log(dataPresent);
        return dataPresent;
    }
    
    var bttAtualizarPresent = document.querySelector("#atualizarSeleçãoPresent");
    bttAtualizarPresent.addEventListener("click", capturarDadosPresent);

    //enviando para a rota
    document.addEventListener("DOMContentLoaded", function() {
        var bttConfirmar = document.querySelector(".bttSendPDF");
        bttConfirmar.addEventListener("click", function() {
            var nomePaciente = document.querySelector(".input_form_orc").value;
            var procedimentos = capturarDados();
            var procedimentosPresent = capturarDadosPresent()
    
            var dadosParaRota = {
                nomePaciente: nomePaciente,
                procedimentos: procedimentos,
                procedimentosPresent: procedimentosPresent 
            };
    
            fetch('/generatepdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosParaRota)
            })
            .then(response => {
                if (response.redirected) {
                    // Se a resposta redirecionou para outra página, redirecione o cliente
                    window.location.href = response.url;
                } else {
                    // Se não houve redirecionamento, trate a resposta como JSON
                    return response.json();
                }
            })
            .then(data => {
                // Se necessário, faça algo com os dados recebidos do servidor
                console.log('Resposta do servidor:', data);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
        });
    });