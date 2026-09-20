// GET /api/status-pix?id=123  →  consulta se o Pix já caiu
module.exports = async function handler(req, res) {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return res.status(500).json({ erro: "Falta configurar MP_ACCESS_TOKEN." });

  const id = String((req.query && req.query.id) || "").replace(/[^0-9]/g, "");
  if (!id) return res.status(400).json({ erro: "Informe o id do pagamento." });

  try {
    const resposta = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });
    const dados = await resposta.json();
    if (!resposta.ok) return res.status(resposta.status).json({ erro: "Pagamento não encontrado." });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
      status: dados.status,
      detalhe: dados.status_detail || null,
      total: dados.transaction_amount
    });
  } catch (erro) {
    return res.status(502).json({ erro: "Não foi possível consultar o Mercado Pago." });
  }
};
