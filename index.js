// index.js – Neo Bot para WhatsApp 7 Motos
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ chave da API do Gupshup
const GUPSHUP_API_KEY = "sk_e5b36b3ee92b4881a60d556a2ee58d18";

// ✅ número oficial do WhatsApp 7 Motos (importante ter no formato correto)
const WHATSAPP_NUMBER = "5558059677"; // <<— verifique se está correto

app.use(bodyParser.json());

// ✅ Rota raiz só para confirmar que está rodando
app.get("/", (req, res) => {
  res.send("🚀 Neo Bot do 7 Motos está rodando!");
});

// ✅ Webhook do Gupshup
app.post("/webhook", async (req, res) => {
  console.log("📩 Webhook recebido:", JSON.stringify(req.body, null, 2));

  // 📨 Extrai dados do payload
  const payload = req.body.payload || {};
  const messageType = payload.type;
  const messageText = payload.payload?.text;
  const sender = payload.sender?.phone;

  // ✅ Só responde mensagens de texto
  if (messageType === "text" && messageText) {
    console.log(`📞 Cliente: ${sender} | 💬 Mensagem: ${messageText}`);

    // ⚡ Neo responde automaticamente para teste
    await sendMessage(sender, "👋 Olá! Aqui é o *Neo*, assistente do 7 Motos 🚀. Como posso te ajudar hoje?");
  }

  res.sendStatus(200);
});

// ✅ Função para enviar mensagens pelo Gupshup
async function sendMessage(to, text) {
  try {
    const response = await axios.post(
      "https://api.gupshup.io/sm/api/v1/msg",
      new URLSearchParams({
        channel: "whatsapp",
        source: WHATSAPP_NUMBER,
        destination: to,
        message: JSON.stringify({ type: "text", text }),
        "src.name": "7motos"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          apikey: GUPSHUP_API_KEY
        }
      }
    );

    console.log("✅ Mensagem enviada:", response.data);
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem:", error.response?.data || error.message);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
