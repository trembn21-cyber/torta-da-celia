// Lê os preços do config.js. O valor da cobrança é sempre recalculado aqui,
// nunca aceito do navegador.
const CONFIG = require("../config.js");

const PRODUTOS = {};
for (const item of CONFIG.itens || []) PRODUTOS[item.id] = item;

function calcularPedido(itens) {
  if (!Array.isArray(itens) || itens.length === 0 || itens.length > 20) {
    return { valido: false, erro: "Pedido vazio ou grande demais." };
  }
  let total = 0;
  const descricoes = [];
  for (const item of itens) {
    const produto = PRODUTOS[item && item.id];
    if (!produto) return { valido: false, erro: "Item desconhecido no pedido." };
    const qtd = Number(item.qtd);
    const passo = produto.unidade === "kg" ? 0.5 : 1;
    if (!isFinite(qtd) || qtd < passo || qtd > 50) return { valido: false, erro: "Quantidade inválida." };
    if (Math.abs(qtd / passo - Math.round(qtd / passo)) > 0.001) {
      return { valido: false, erro: "Quantidade inválida." };
    }
    total += produto.preco * qtd;
    descricoes.push(produto.unidade === "kg" ? `${qtd} kg de ${produto.nome}` : `${qtd}x ${produto.nome}`);
  }
  total = Math.round(total * 100) / 100;
  if (total < 0.5 || total > 5000) return { valido: false, erro: "Valor fora do limite." };
  return { valido: true, total, descricao: descricoes.join(", ").slice(0, 200) };
}

module.exports = { PRODUTOS, calcularPedido };
