import { ChatSidebar } from "components/ChatSidebar";
import Head from "next/head";
import { useEffect, useState } from "react";
import { streamReader } from "openai-edge-stream";
import { v4 as uuid } from "uuid";
import { Message } from "components/Message";
import { useRouter } from "next/router";
import { getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import clientPromise from "lib/mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";
import { Navbar } from "components/Navbar";

export default function ChatPage({ chatId, title, messages = [] }) {
  const [messageText, setMessageText] = useState("");
  const [incomingMessage, setIncomingMessage] = useState("");
  const [newChatMessages, setNewChatMessages] = useState([]);
  const [generatingResponse, setGeneratingResponse] = useState(false);
  const [newChatId, setNewChatId] = useState(null);
  const [fullMessage, setFullMessage] = useState("");
  const [originalChatId, setOriginalChatId] = useState(chatId);
  const [isOpen, setOpen] = useState(false);

  const router = useRouter();
  const routeHasChanged = chatId !== originalChatId;

  // toggleSidebar
  const toggleSidebar = () => setOpen(!isOpen);

  // reset newChatMessages and newChatId when chatId changes (when our route changes)
  useEffect(() => {
    setNewChatMessages([]);
    setNewChatId(null);
  }, [chatId]);

  // save newly streamed message to new chat messages
  useEffect(() => {
    if (!routeHasChanged && !generatingResponse && fullMessage) {
      setNewChatMessages((prev) => [
        ...prev,
        {
          _id: uuid(),
          role: "assistant",
          content: fullMessage,
        },
      ]);
      setFullMessage("");
    }
  }, [generatingResponse, fullMessage, routeHasChanged]);

  // When we create a new chat
  useEffect(() => {
    if (!generatingResponse && newChatId) {
      setNewChatId(null);
      router.push(`/chat/${newChatId}`);
    }
  }, [generatingResponse, newChatId, router]);

  const onEnterPress = async (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      setGeneratingResponse(true);
      setOriginalChatId(chatId);

      setNewChatMessages((prev) => {
        const newChatMessages = [
          ...prev,
          {
            _id: uuid(),
            role: "user",
            content: messageText,
          },
        ];
        return newChatMessages;
      });

      setMessageText("");

      const response = await fetch(`/api/chat/sendMessage`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          chatId,
        }),
      });

      const data = response.body;

      if (!data) {
        return;
      }

      const reader = data.getReader();
      let content = "";
      await streamReader(reader, (message) => {
        if (message.event === "newChatId") {
          setNewChatId(message.content);
        } else {
          setIncomingMessage((s) => `${s}${message.content}`);
          content = content + message.content;
        }
      });

      // Set incoming message to null
      setIncomingMessage("");
      setGeneratingResponse(false);
      setFullMessage(content);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratingResponse(true);
    setOriginalChatId(chatId);

    setNewChatMessages((prev) => {
      const newChatMessages = [
        ...prev,
        {
          _id: uuid(),
          role: "user",
          content: messageText,
        },
      ];
      return newChatMessages;
    });

    setMessageText("");

    const response = await fetch(`/api/chat/sendMessage`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: messageText,
        chatId,
      }),
    });

    const data = response.body;

    if (!data) {
      return;
    }

    const reader = data.getReader();
    let content = "";
    await streamReader(reader, (message) => {
      if (message.event === "newChatId") {
        setNewChatId(message.content);
      } else {
        setIncomingMessage((s) => `${s}${message.content}`);
        content = content + message.content;
      }
    });

    // Set incoming message to null
    setIncomingMessage("");
    setGeneratingResponse(false);
    setFullMessage(content);
  };

  const allChatMessages = [...messages, ...newChatMessages];
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Head>
        <title>New Chat</title>
      </Head>
      <div
        className={`${
          isOpen
            ? "grid h-screen grid-cols-[350px_1fr]"
            : "grid h-screen w-screen"
        }`}
      >
        {isOpen ? (
          <ChatSidebar chatId={chatId} setOpen={setOpen} />
        ) : (
          <div className="hidden"></div>
        )}
        <div className="flex flex-col overflow-hidden bg-gray-700">
          <Navbar
            toggleSidebar={toggleSidebar}
            title={title}
            setOpen={setOpen}
          />
          <div className="flex flex-1 flex-col-reverse overflow-scroll text-white">
            {!allChatMessages.length && !incomingMessage && (
              <div className="m-auto flex items-center justify-center text-center">
                <div>
                  <FontAwesomeIcon
                    icon={faRobot}
                    className="mb-2 text-8xl text-emerald-200"
                  />
                  <h1 className="mt-2 text-4xl font-bold text-white/50">
                    Ask me a question!
                  </h1>
                </div>
              </div>
            )}
            {!!allChatMessages.length && (
              <div className="mb-auto">
                {allChatMessages.map((message) => (
                  <Message
                    key={message._id}
                    role={message.role}
                    content={message.content}
                  />
                ))}
                {!!incomingMessage && !routeHasChanged && (
                  <Message role="assistant" content={incomingMessage} />
                )}
                {!!incomingMessage && !!routeHasChanged && (
                  <Message
                    role="notice"
                    content="Only one message at a time. Please allow responses to complete before sending another message"
                  />
                )}
              </div>
            )}
          </div>
          <footer className="bg-gray-800 p-10">
            <form onSubmit={handleSubmit}>
              <fieldset className="flex gap-2" disabled={generatingResponse}>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={generatingResponse ? "" : "Send a message..."}
                  className="w-full resize-none rounded-md bg-gray-700 p-2 text-white focus:border-emerald-500 focus:bg-gray-600 focus:outline focus:outline-emerald-500"
                  onKeyDown={onEnterPress}
                />
                <button type="submit" className="btn">
                  Send
                </button>
              </fieldset>
            </form>
          </footer>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const chatId = ctx.params?.id?.[0] || null;
  if (chatId) {
    let objectId;
    try {
      objectId = new ObjectId(chatId);
    } catch (e) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }
    const { user } = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);

    const chat = await db.collection("chats").findOne({
      userId: user.sub,
      _id: objectId,
    });

    if (!chat) {
      return {
        redirect: {
          destination: "/chat",
        },
      };
    }
    return {
      props: {
        chatId,
        title: chat.title,
        messages: chat.messages.map((message) => ({ ...message, _id: uuid() })),
      },
    };
  }
  return { props: {} };
};

/*
<div
    className={`${
      isOpen
        ? "grid flex-1 grid-cols-[350px_1fr]"
        : "grid flex-1 w-full"
    }`}
  >
  */
