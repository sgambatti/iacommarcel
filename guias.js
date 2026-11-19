const guias = {
  reuniao: {
    titulo: "Organizar uma reunião",
    introducao: "Transforme as anotações em uma lista de tarefas com responsáveis, prazos e pendências.",
    entrada: "Lia manda o orçamento na quinta. A data de entrega ficou em aberto. Caio revisa o texto, sem prazo definido.",
    instrucao: "Leia as notas abaixo. Extraia as tarefas em uma tabela com tarefa, responsável e prazo. Preserve os prazos como foram escritos. Para informações ausentes, escreva “a confirmar”. Liste decisões pendentes separadamente. Use apenas os fatos das notas.",
    criterio: "Compare cada prazo com a anotação original. No exemplo, quinta vale só para o orçamento de Lia. O prazo de Caio e a data de entrega continuam em aberto.",
    exemplo: "Enviar o orçamento · Lia · quinta\nRevisar o texto · Caio · a confirmar\nPendência · confirmar a data de entrega."
  },
  cliente: {
    titulo: "Responder a um cliente",
    introducao: "Use o que a loja já sabe para escrever uma resposta curta e deixar claro o próximo passo.",
    entrada: "Mensagem do cliente: “Consigo receber até sexta?”\nContexto da loja: a cidade de destino ainda é desconhecida. A equipe consulta o prazo de entrega pelo CEP.",
    instrucao: "Escreva uma resposta de WhatsApp em português, com até três frases. Responda à pergunta usando os fatos fornecidos. Quando faltar uma informação, peça só o necessário para avançar. Preserve as condições da loja e evite prometer um prazo que ela ainda precisa consultar.",
    criterio: "Confira cada compromisso assumido na resposta. No exemplo, a loja precisa pedir o CEP para poder consultar a entrega até sexta.",
    exemplo: "Oi! Você pode me passar o CEP de entrega? Com ele, consigo consultar o prazo e te dizer se o pedido pode chegar até sexta."
  },
  estudo: {
    titulo: "Estudar com um quiz",
    introducao: "Transforme um parágrafo em perguntas e responda de memória antes de conferir o gabarito.",
    entrada: "A evaporação transforma água líquida em vapor. A condensação transforma vapor em gotículas. Quando as gotas ficam grandes o suficiente, podem cair como chuva.",
    instrucao: "Use exclusivamente o trecho abaixo. Prepare três perguntas curtas de revisão, uma para cada ideia do texto. Faça a primeira pergunta agora e aguarde minha resposta. A cada resposta, corrija com uma frase apoiada no trecho e só então faça a próxima pergunta. Mostre o gabarito completo depois da terceira resposta.",
    criterio: "Na primeira mensagem deve aparecer uma pergunta, sem gabarito. Depois de responder, confirme se a explicação da IA corresponde ao trecho.",
    exemplo: "Primeira pergunta possível · Como se chama a transformação da água líquida em vapor?\nApós você responder “evaporação”, a IA pode confirmar a resposta e perguntar o que ocorre na condensação."
  }
};
const titulo = document.querySelector("#titulo-guia");
const entrada = document.querySelector("#entrada");
const texto = document.querySelector("#texto-prompt");
const copiar = document.querySelector("#copiar");
const statusCopia = document.querySelector("#status");
const links = [...document.querySelectorAll("[data-guide]")];
const rascunhos = new Map();
let atual = "reuniao";

function atualizarPrompt() {
  const material = entrada.value.trim();
  texto.textContent = guias[atual].instrucao + "\n\nMaterial de partida\n" + material;
  copiar.disabled = !material;
  statusCopia.textContent = material ? "" : "Insira um trecho para copiar o prompt.";
}

function abrirGuia(id, rolar) {
  atual = id;
  const guia = guias[id];
  titulo.textContent = guia.titulo;
  document.querySelector("#introducao").textContent = guia.introducao;
  document.querySelector("#criterio").textContent = guia.criterio;
  document.querySelector("#exemplo").textContent = guia.exemplo;
  document.querySelector("details").open = false;
  entrada.value = rascunhos.get(id) ?? guia.entrada;
  links.forEach(link => {
    if (link.dataset.guide === id) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  atualizarPrompt();
  if (rolar) document.querySelector("#oficina").scrollIntoView({block: "start"});
}

function lerEndereco() {
  const id = location.hash.slice(1);
  if (Object.hasOwn(guias, id)) abrirGuia(id, true);
}
links.forEach(link => link.addEventListener("click", () => {
  if (location.hash === link.hash) abrirGuia(link.dataset.guide, true);
}));
window.addEventListener("hashchange", lerEndereco);
entrada.addEventListener("input", () => {
  rascunhos.set(atual, entrada.value);
  atualizarPrompt();
});
document.querySelector("#restaurar").addEventListener("click", () => {
  rascunhos.delete(atual);
  entrada.value = guias[atual].entrada;
  atualizarPrompt();
  statusCopia.textContent = "Exemplo restaurado.";
});
copiar.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(texto.textContent);
    statusCopia.textContent = "Prompt copiado. Cole no seu chat de IA.";
  } catch {
    const selecao = window.getSelection();
    const faixa = document.createRange();
    faixa.selectNodeContents(texto);
    selecao.removeAllRanges();
    selecao.addRange(faixa);
    statusCopia.textContent = "Prompt selecionado. Use a opção Copiar do navegador.";
  }
});
abrirGuia("reuniao", false);
lerEndereco();
