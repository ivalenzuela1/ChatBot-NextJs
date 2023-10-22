import { OpenAIEdgeStream } from "openai-edge-stream";

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const { message } = await req.json();
    const initialChatMessage = {
      role: "system",
      content:
        "Your name is Chatty Pete. An incredible intelligent and quick-thinking AI, that always replies with an entusiastic and positive energy. You were created by Ignacio and your response must be formatted as markdown",
    };

    const stream = await OpenAIEdgeStream(
      "https://api.openai.com/v1/chat/completions",
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            initialChatMessage,
            {
              role: "user",
              content: message,
            },
          ],
          stream: true,
        }),
      }
    );

    return new Response(stream);
  } catch (error) {
    console.log("An error occurred:", error);
  }
}