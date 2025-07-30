import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// 🔑 CHAVES
const GUPSHUP_API_KEY = "SUA_CHAVE_GUPSHUP_AQUI"; // substitua pela chave do Gupshup
const OPENAI_API_KEY = "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"; 

// 🔗 ENDPOINT DO OPENAI (Assistants v2)
const OPENAI_URL = "https://api.openai.com/v1/responses";

app.post("/webhook", async (req, res) => {
  try {
    console.log("📩 Mensagem recebida do Gupshup:", JSON.stringify(req.body, null, 2));

    const payload = req.body.payload;
    if (!payload || !payload.payload || !payload.payload.text) {
      return res.status(200).send("✅ Webhook OK, mas sem texto");
    }

    const userMessage = payload.payload.text;
    const userPhone = payload.sender.phone;

    console.log(`📞 Cliente: ${userPhone} | 💬 Mensagem: ${userMessage}`);

    // 📡 ENVIA MENSAGEM PARA OPENAI (GPT)
    const gptResponse = await axios.post(
      OPENAI_URL,
      {
        model: "gpt-4o-mini", // mais rápido e barato
        input: [
          {
            role: "system",
            content: "Você é o Neo, um atendente da 7 Motos. Responda de forma educada, útil e clara."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "OpenAI-Beta": "assistants=v2"
        }
      }
    );

    // 📜 PEGA A RESPOSTA DO GPT
    const neoReply = gptResponse.data.output_text || "Desculpe, não consegui processar sua mensagem.";

    console.log("🤖 Resposta do Neo:", neoReply);

    // 📤 ENVIA RESPOSTA PARA O CLIENTE VIA GUPSHUP
    await axios.post(
      "https://api.gupshup.io/wa/api/v1/msg",
      new URLSearchParams({
        channel: "whatsapp",
        source: "SEU_NUMERO_WHATSAPP",
        destination: userPhone,
        message: JSON.stringify({ type: "text", text: neoReply }),
        "src.name": "7motos"
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          apikey: GUPSHUP_API_KEY
        }
      }
    );

    console.log("✅ Mensagem enviada para o cliente!");
    res.status(200).send("✅ Webhook processado com sucesso");
  } catch (error) {
    console.error("❌ Erro no fluxo:", error.response?.data || error.message);
    res.status(500).send("Erro no Webhook");
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Servidor do Neo está rodando!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor rodando na porta ${PORT}`));
