import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "lib/mongodb";

export default async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    // Get chats by id, ommit userId and Messages (only get title), sort by ts
    // IDs in MongoDB are based on Timestamp
    // Find query returns a cursor (pointer)
    // Convert to Array.
    const chats = await db
      .collection("chats")
      .find(
        {
          userId: user.sub,
        },
        {
          projections: {
            userId: 0,
            messages: 0,
          },
        }
      )
      .sort({
        _id: -1,
      })
      .toArray();

    res.status(200).json({ chats });
  } catch (error) {
    res.status(500).json({
      message: "an error occured when getting chat list",
    });
    console.log("AN ERROR OCCURED DURING CREATE NEW CHAT", error);
  }
}
