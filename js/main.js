const form = document.getElementById("novoItem")
const lista = document.getElementById("lista")

// pega os itens se não tem nada dá uma array vazia
// tem que dar o parse se não é uma string, não um array
const itens = JSON.parse(localStorage.getItem("itens")) || []

itens.forEach( (elemento) => {
    criaElemento(elemento)
} )

form.addEventListener("submit", (evento) => {
    evento.preventDefault() // prevenir o comportamento padrão de nem entrar no js

    const nome = evento.target.elements['nome'] 
    // pra não ficar pegando um objeto fixo
    // usar o target.elements
    const quantidade = evento.target.elements['quantidade']

    const existe = itens.find( elemento => elemento.nome === nome.value )

    // para evitar sobrescrever itens no localStorage
    const itemAtual = {
        "nome": nome.value,
        "quantidade": quantidade.value
    }

    // checa se o item existe e atualiza ele
    if (existe) {
        itemAtual.id = existe.id
        
        atualizaElemento(itemAtual)

        itens[itens.findIndex(elemento => elemento.id === existe.id)] = itemAtual
    } else { // se não adiciona ele
        // adicionando um id no item pra ser chave forte
        // usando dataAttributes do HTML
        itemAtual.id = itens[itens.length -1] ? (itens[itens.length-1]).id + 1 : 0;

        criaElemento(itemAtual)

        itens.push(itemAtual)
    }

    // armazenar os dados no cache do navegador (localStorage)
    // localStorage só lê strings/texto!
    // obs. dados no localStorage NÃO PODEM SER SENSÍVEIS
    // de acordo com a LGPD, dados sensíveis devem ficar em cookies
    localStorage.setItem("itens", JSON.stringify(itens))

    nome.value = ""
    quantidade.value = ""
})

function criaElemento(item) {
    const novoItem = document.createElement("li")
    novoItem.classList.add("item")

    const numeroItem = document.createElement("strong")
    numeroItem.innerHTML = item.quantidade
    numeroItem.dataset.id = item.id
    // inserir elementos criados dentro do outro (appendChild)
    novoItem.appendChild(numeroItem)
    
    novoItem.innerHTML += item.nome

    novoItem.appendChild(botaoDeleta(item.id))

    lista.appendChild(novoItem)
}

function atualizaElemento(item) {
    document.querySelector("[data-id='"+item.id+"']").innerHTML = item.quantidade
}

function botaoDeleta(id) {
    // cria um botão de deletar 
    const elementoBotao = document.createElement("button")
    elementoBotao.innerText = "X"

    // roda função de deletar quando vc clica no botão
    elementoBotao.addEventListener("click", function() {
        deletaElemento(this.parentNode, id)
    })

    return elementoBotao
}

function deletaElemento(tag, id) {
    tag.remove()

    // splice funciona no indice da array, e a posição é o id 
    itens.splice(itens.findIndex(elemento => elemento.id === id), 1)

    localStorage.setItem("itens", JSON.stringify(itens))
}