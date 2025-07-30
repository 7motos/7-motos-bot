const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🔑 API KEY do Gupshup
const GUPSHUP_API_KEY = "sk_1396921ddfc44fb4888005154a480d34";

// 📲 Número oficial do WhatsApp 7 Motos (DO GUPSHUP)
const WHATSAPP_NUMBER = "15558059677";

// 🌍 Endpoint Gupshup
const GUPSHUP_URL = "https://api.gupshup.io/sm/api/v1/msg";

// ✅ Webhook para receber mensagens
app.post("/webhook", async (req, res) => {
  console.log("📩 Mensagem recebida do Gupshup:", JSON.stringify(req.body, null, 2));

  if (req.body.type === "message") {
    const message = req.body.payload.payload.text;
    const sender = req.body.payload.sender.phone;

    console.log(`📞 Cliente: ${sender} | 💬 Mensagem: ${message}`);

    // 🔥 Enviar resposta automática
    await sendMessage(sender, `👋 Olá! Eu sou o Neo, assistente do *7 Motos*. 
🚀 Quer pedir uma corrida, fazer uma entrega ou falar com um atendente humano?`);
  }

  res.status(200).send("ok");
});

// ✅ Função para enviar mensagens via Gupshup
async function sendMessage(to, text) {
  try {
    const response = await axios.post(
      GUPSHUP_URL,
      new URLSearchParams({
        channel: "whatsapp",
        source: WHATSAPP_NUMBER,
        destination: to,
        message: JSON.stringify({ type: "text", text: text }),
        'src.name': "7motos"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "apikey": GUPSHUP_API_KEY,
        },
      }
    );
    console.log("✅ Mensagem enviada com sucesso:", response.data);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response ? error.response.data : error.message);
  }
}

// 🚀 Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
