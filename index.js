const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// 🔑 SUA API KEY DA GUPSHUP
const GUPSHUP_API_KEY = "sk_e5b36b3ee92b4881a60d556a2ee58d18";

// 📱 Número do WhatsApp registrado no Gupshup (source)
const SOURCE_NUMBER = "5558059677"; // SEM +55 antes!

// 🚀 Função para enviar mensagem de texto
async function sendMessage(to, message) {
  try {
    const response = await axios.post(
      'https://api.gupshup.io/sm/api/v1/msg',
      new URLSearchParams({
        channel: 'whatsapp',
        source: SOURCE_NUMBER,
        destination: to,
        message: JSON.stringify({ type: 'text', text: message }),
        'src.name': '7motos'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': GUPSHUP_API_KEY
        }
      }
    );
    console.log('✅ Mensagem enviada:', response.data);
  } catch (error) {
    console.error('❌ Erro ao enviar mensagem:', error.response ? error.response.data : error.message);
  }
}

// 📥 Webhook para receber mensagens do Gupshup
app.post('/', async (req, res) => {
  console.log('📩 Webhook recebido:', JSON.stringify(req.body, null, 2));

  if (req.body.type === 'message' && req.body.payload) {
    const payload = req.body.payload;
    const phone = payload.sender.phone; // Número do cliente
    const text = payload.payload.text; // Texto da mensagem recebida

    console.log(`📞 Cliente: ${phone} | 💬 Mensagem: ${text}`);

    // 🤖 Resposta do Neo
    const respostaNeo = `Olá! Sou o Neo, assistente virtual do 7 Motos 🚀.
Posso te ajudar a pedir uma corrida ou fazer uma entrega.
O que você gostaria de fazer agora?`;

    await sendMessage(phone, respostaNeo);
  } else {
    console.log("⚠️ Webhook recebido não era uma mensagem de cliente.");
  }

  res.sendStatus(200);
});

// 🌍 Servidor online
app.listen(PORT, () => {
  console.log(`🚀 Servidor do Neo rodando na porta ${PORT}`);
});
