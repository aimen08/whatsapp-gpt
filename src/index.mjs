import { openai } from "./config/index.mjs";

import wp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

// import server from "server";

// const { get, post } = server.router;
// const { json } = server.reply;

// // Launch server with options and a couple of routes
// server({ port: 8044 }, [
//   get("/", (ctx) =>
//     json({
//       name: "test",
//     })
//   ),
// ]);

const client = new wp.Client({ authStrategy: new wp.LocalAuth() });

client.on("qr", (qr) => {
  try {
    qrcode.generate(qr, { small: true });
  } catch (error) {
    console.error(error);
  }
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (message) => {
  const { body } = message;
  client.sendSeen(message.from);
  // client.getContacts().then((contacts) => {
  //   console.log(contacts);
  // });
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that only answers questions",
        },
        { role: "user", content: body },
      ],
      temperature: 0.5,
      max_tokens: 700,
    });

    await client.sendMessage(
      message.from,
      completion.data.choices[0].message.content
    );
  } catch (error) {
    console.error(error);
  }
});


client.initialize();



