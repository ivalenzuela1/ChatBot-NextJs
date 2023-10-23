import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    console.log("addMessageToChat!!!");
    console.log(user);

    const { chatId, role, content } = req.body;

    console.log("chatId!!!");
    console.log(chatId);
    console.log("role!!!");
    console.log(role);
    console.log("content!!!");
    console.log(content);
    console.log("user.sub!!!");
    console.log(user.sub);

    // TODO: chat returning NULL
    const chat = await db.collection("chats").findOneAndUpdate(
      {
        id_: new ObjectId(chatId),
        userId: user.sub,
      },
      {
        $push: {
          messages: {
            role,
            content,
          },
        },
      },
      {
        returnDocument: "after",
      }
    );

    console.log("chat!!!");
    console.log(chat);
    console.log("value!!!");
    console.log(chat.value);

    res.status(200).json({
      chat: {
        ...chat.value,
        _id: chat.value._id.toString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "an error occured when adding message to chat",
    });
    console.log("AN ERROR OCCURED DURING ADD CHAT", error);
  }
}
