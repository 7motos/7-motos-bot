const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Rota do webhook
app.post("/webhook", (req, res) => {
  console.log("📩 Mensagem recebida do Gupshup:", req.body);

  // Captura a mensagem enviada pelo cliente
  const message = req.body.payload?.payload?.text || "";
  const phone = req.body.payload?.sender?.phone;


  console.log(`📞 Cliente: ${phone} | 💬 Mensagem: ${message}`);

  // Resposta automática do Neo
  let reply = "🚀 Olá! Sou o Neo, assistente do 7 Motos. Como posso te ajudar hoje?";
  if (message.toLowerCase().includes("corrida")) {
    reply = "🏍️ Certo! Qual o endereço de retirada?";
  } else if (message.toLowerCase().includes("entrega")) {
    reply = "📦 Beleza! Qual o endereço de retirada?";
  }

  // Envia a resposta para o Gupshup (e de lá para o WhatsApp)
  // [Aqui vamos configurar o envio pela API do Gupshup]

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("✅ Neo Bot do 7 Motos está rodando!");
});

// Porta do Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
