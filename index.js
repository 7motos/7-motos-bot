const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔑 Suas chaves de API
const GUPSHUP_API_KEY = "sk_1396921ddfc44fb4888005154a480d34"; // chave do Gupshup
const OPENAI_API_KEY = "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"; // chave do OpenAI
const APP_NAME = "7motos";

// 📦 Middlewares
app.use(bodyParser.json());

// ✅ Webhook para receber mensagens do Gupshup
app.post('/webhook', async (req, res) => {
    console.log("📩 Mensagem recebida do Gupshup:", JSON.stringify(req.body, null, 2));

    // 🔍 Verifica se é uma mensagem normal
    if (req.body.type === "message" && req.body.payload?.type === "text") {
        const userMessage = req.body.payload.payload.text;
        const userPhone = req.body.payload.sender.phone;

        console.log(`📞 Cliente: ${userPhone} | 💬 Mensagem: ${userMessage}`);

        try {
            // 📤 Envia a mensagem do cliente para o ChatGPT
            const gptResponse = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Você é Neo, um assistente educado e prestativo que ajuda os clientes do app 7 Motos a pedir corridas e entregas." },
                        { role: "user", content: userMessage }
                    ],
                    max_tokens: 200
                },
                {
                    headers: {
                        "Authorization": `Bearer ${OPENAI_API_KEY}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const neoReply = gptResponse.data.choices[0].message.content;
            console.log(`🤖 Neo respondeu: ${neoReply}`);

            // 📲 Envia a resposta de volta pelo WhatsApp via Gupshup
            await axios.post(
                "https://api.gupshup.io/wa/api/v1/msg",
                new URLSearchParams({
                    channel: "whatsapp",
                    source: "551998436013",  // número do WhatsApp 7 Motos
                    destination: userPhone,
                    message: JSON.stringify({ type: "text", text: neoReply }),
                    'src.name': APP_NAME
                }),
                {
                    headers: {
                        "apikey": GUPSHUP_API_KEY,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            console.log(`✅ Mensagem enviada para ${userPhone}: ${neoReply}`);
        } catch (error) {
            console.error("❌ Erro no fluxo:", error.response ? error.response.data : error.message);
        }
    }

    res.sendStatus(200);
});

// 🌐 Endpoint para testar se o bot está online
app.get('/', (req, res) => {
    res.send("🤖 Neo está online e pronto para atender os clientes do 7 Motos!");
});

// 🚀 Inicializa servidor
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
