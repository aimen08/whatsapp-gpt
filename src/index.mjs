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

const client = new wp.Client({ authStrategy: new wp.LocalAuth(),puppeteer: {
		args: ['--no-sandbox'],
	}});

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

client.on("message_create", async(message) => {

  try{
    await client.sendMessage(
      message.from,
      "مرحبا، أنا مساعدك الذكي! مطور من طرف راشد المنصوري  بإمكاني الإجابة على أسئلتك، تقديم المعلومات التي تحتاجها، و لا تتردد في سؤالي أي شيء تريده، وسأحاول الإجابة عليك بأسرع وقت ممكن."
    );
    await client.sendMessage(
      message.from,
        "https://www.instagram.com/r49/?igshid=YmMyMTA2M2Y%3D"
    );
  }catch(error){
    console.error(error);
  }
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



