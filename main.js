const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const app = express();
app.use(express.json());
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox"],
  },
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

const phoneNumber = "60108759947@c.us";

client.on("message", (message) => {
  client.sendMessage(phoneNumber, `Your number is ${message.from}`);
});

client.on("message", (message) => {
  if (message.body === "Hello") {
    message.reply("Replying, hi there");
  }
});

app.post("/send-message", (req, res) => {
  const { message } = req.body;
  if (message) {
    let promises = [];
    for (let i = 0; i < 50; i++) {
      promises.push(client.sendMessage(phoneNumber, message));
    }
    Promise.all(promises)
      .then((response) => {
        res.status(200).send({ success: true, responses: response });
      })
      .catch((error) => {
        res.status(500).send({ success: false, error });
      });
  } else {
    res.status(400).send({ success: false, message: "No message provided" });
  }
});

app.listen(3030, () => {
  console.log("Server running on port 3030");
});
client.initialize();
