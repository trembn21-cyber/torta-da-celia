/* =====================================================================
   Configuração da Torta da Celia — este é o único arquivo que você edita.
   Vale para o site e para o servidor: mudou aqui, muda nos dois.
   ===================================================================== */

var CONFIG_TORTA = {

  // WhatsApp da Celia: 55 + DDD + número, só dígitos. Ex.: "5528999998888"
  whatsapp: "5528999484375",

  // Preços do cardápio. Os ids precisam continuar iguais aos do site.
  // unidade: "un" para os potes, "kg" para a torta vendida por peso.
  itens: [
    { id: "festa", nome: "Torta de Festa", preco: 40, unidade: "kg" },
    { id: "pote-p", nome: "Pote Pequeno", preco: 10, unidade: "un" },
    { id: "pote-m", nome: "Pote Médio", preco: 14, unidade: "un" },
    { id: "pote-g", nome: "Pote Grande", preco: 17, unidade: "un" }
  ],

  /* Pix sem servidor (reserva). Só é usado quando o site roda sem as funções
     da pasta api, por exemplo abrindo o index.html direto no computador.
     Publicado na Vercel com o MP_ACCESS_TOKEN, o Pix é automático e isto
     não é usado. nome: até 25 letras | cidade: até 15 letras, sem acento. */
  pixManual: { chave: "", nome: "TORTA DA CELIA", cidade: "CACHOEIRO" }

};

// Deixa o mesmo arquivo servir para o servidor (Node) e para o navegador.
if (typeof module !== "undefined" && module.exports) module.exports = CONFIG_TORTA;
