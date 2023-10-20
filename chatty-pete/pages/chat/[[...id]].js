import { ChatSidebar } from "components/ChatSidebar";
import Head from "next/head";
import { useState } from "react";
import { streamReader } from "openai-edge-stream";

export default function ChatPage() {
  const [messageText, setMessageText] = useState("");
  const [incomingMessage, setIncomingMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("messageText");
    console.log(messageText);

    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: messageText,
      }),
    });

    const data = response.body;

    console.log("data");
    console.log(data);

    if (!data) {
      console.log("NO DATA!!!!");
      return;
    }

    const reader = data.getReader();
    console.log("reader!!!");
    console.log(reader);

    await streamReader(reader, (message) => {
      setIncomingMessage((s) => `${s}${message.content}`);
    });
  };
  return (
    <>
      <Head>
        <title>New Chat</title>
      </Head>
      <div className="grid h-screen grid-cols-[260px_1fr]">
        <ChatSidebar />
        <div className="flex flex-col bg-gray-700">
          <div className="flex-1 text-white">{incomingMessage}</div>
          <footer className="bg-gray-800 p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Send a message..."
                  className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500"
                />
                <button type="submit" className="btn">
                  Send
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </>
  );
}
//
