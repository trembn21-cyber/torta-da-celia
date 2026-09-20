# Site da Torta da Celia

Cardápio com carrinho, pedido pelo WhatsApp e Pix automático pelo Mercado Pago.

## O que você edita: só o `config.js`

Abra o `config.js` e mude:

- `whatsapp` — número da Celia: 55 + DDD + número, só dígitos.
- `itens` — nome, preço e unidade de cada item do cardápio.
- `pixManual` — chave, nome e cidade, usados só quando o site roda sem servidor.

O site e o servidor leem esse mesmo arquivo, então o preço mostrado e o preço
cobrado nunca ficam diferentes. Os textos de descrição e as fotos ficam no
`index.html`; para incluir um item novo no cardápio, me chame que eu monto o card.

## Arquivos

- `index.html` — o site inteiro (fotos e estilos embutidos).
- `config.js` — número, preços e dados do Pix.
- `api/criar-pix.js` — cria a cobrança Pix no Mercado Pago.
- `api/status-pix.js` — consulta se o pagamento caiu.
- `api/_produtos.js` — confere o pedido e calcula o valor no servidor.

## Publicar na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel, clique em **Add New → Project** e escolha esse repositório.
3. Em **Settings → Environment Variables**, crie:
   - `MP_ACCESS_TOKEN` — Access Token de **produção** da conta do Mercado Pago
     (painel do Mercado Pago → Suas integrações → sua aplicação → Credenciais de
     produção). Começa com `APP_USR-`. Esse token nunca vai para o `index.html`.
   - `EMAIL_PADRAO` (opcional) — e-mail usado no cadastro da cobrança.
4. Clique em **Deploy**.

Para testar antes de cobrar de verdade, use as credenciais de teste do Mercado
Pago, cujo token começa com `TEST-`.

## Como funciona o Pix

1. O cliente monta o pedido e escolhe Pix.
2. Em **Gerar QR Code do Pix**, o site chama `api/criar-pix`, que confere os preços
   no servidor e cria a cobrança com o valor exato.
3. O QR Code oficial aparece e o site consulta o status a cada 4 segundos.
4. Aprovado o pagamento, o botão de enviar libera e a mensagem do WhatsApp sai com
   o código do pagamento. Antes disso, o envio fica travado.
5. Mexeu no carrinho, a cobrança é descartada e o cliente gera outra.

Abrindo o `index.html` sem servidor, o Pix automático não funciona: o site cai no
modo manual (QR gerado na própria página, com confirmação do cliente) se houver
chave em `pixManual`, ou pede para combinar pelo WhatsApp.
