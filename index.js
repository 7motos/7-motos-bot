const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const GUPSHUP_API_URL = "https://api.gupshup.io/sm/api/v1/msg";
const GUPSHUP_APP_NAME = "7motos"; // nome do app no Gupshup
const GUPSHUP_API_KEY = "sk_e5b36b3ee92b4881a60d556a2ee58d18"; // 🔒 substitua pelo seu token real

// Endpoint de teste
app.get("/", (req, res) => {
  res.send("✅ Bot do 7 Motos rodando!");
});

// Webhook do Gupshup
app.post("/webhook", async (req, res) => {
  try {
    const data = req.body;

    console.log("📩 Mensagem recebida do Gupshup:", JSON.stringify(data, null, 2));

    const message = data.payload?.payload?.text || "";
    const phone = data.payload?.sender?.phone;

    console.log(`📞 Cliente: ${phone} | 💬 Mensagem: ${message}`);

    if (!phone || !message) return res.sendStatus(200);

    // Resposta automática
    let reply = "🚀 Olá! Sou o Neo, assistente do 7 Motos. Como posso te ajudar hoje?";
    if (message.toLowerCase().includes("corrida")) {
      reply = "🏍️ Certo! Qual o endereço de retirada?";
    } else if (message.toLowerCase().includes("entrega")) {
      reply = "📦 Beleza! Qual o endereço de retirada?";
    }

    await sendMessage(phone, reply);
    res.sendStatus(200);

  } catch (err) {
    console.error("❌ Erro no webhook:", err.message);
    res.sendStatus(500);
  }
});

// Função que envia resposta via Gupshup
async function sendMessage(to, text) {
  try {
    const res = await axios.post(
      GUPSHUP_API_URL,
      new URLSearchParams({
        channel: "whatsapp",
        source: "", // deixe vazio
        destination: to,
        message: JSON.stringify({ type: "text", text }),
        src.name: GUPSHUP_APP_NAME
      }),
      {
        headers: {
          apikey: GUPSHUP_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    console.log(`✅ Mensagem enviada para ${to}: "${text}"`);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
