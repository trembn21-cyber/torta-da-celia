// POST /api/criar-pix  →  cria a cobrança Pix no Mercado Pago
const { randomUUID } = require("crypto");
const { calcularPedido } = require("./_produtos.js");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ erro: "Método não permitido." });

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return res.status(500).json({ erro: "Falta configurar MP_ACCESS_TOKEN." });

  let corpo = req.body || {};
  if (typeof corpo === "string") { try { corpo = JSON.parse(corpo); } catch { corpo = {}; } }

  const conta = calcularPedido(corpo.itens);
  if (!conta.valido) return res.status(400).json({ erro: conta.erro });

  try {
    const resposta = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Idempotency-Key": randomUUID()
      },
      body: JSON.stringify({
        transaction_amount: conta.total,
        description: `Torta da Celia — ${conta.descricao}`,
        payment_method_id: "pix",
        payer: {
          email: process.env.EMAIL_PADRAO || "cliente@tortadacelia.com.br",
          first_name: (corpo.nome || "Cliente").slice(0, 40)
        }
      })
    });

    const dados = await resposta.json();
    if (!resposta.ok) {
      return res.status(resposta.status).json({ erro: (dados && (dados.message || dados.error)) || "Erro no Mercado Pago." });
    }

    const tx = (dados.point_of_interaction && dados.point_of_interaction.transaction_data) || {};
    return res.status(200).json({
      id: dados.id,
      status: dados.status,
      total: conta.total,
      copiaECola: tx.qr_code || null,
      qrBase64: tx.qr_code_base64 || null,
      expiraEm: dados.date_of_expiration || null
    });
  } catch (erro) {
    return res.status(502).json({ erro: "Não foi possível falar com o Mercado Pago." });
  }
};
