import Link from "next/link";
import { useEffect } from "react";

export const ChatSidebar = () => {
  useEffect(() => {
    const loadChatList = async () => {
      const response = await fetch(`/api/chat/getChatList`, {
        method: "POST",
      });
      const json = await response.json;

      console.log("json");
      console.log(json);
    };

    loadChatList();
  }, []);
  return (
    <div className="bg-gray-900 text-white">
      <Link href="/api/auth/logout">Log out</Link>
    </div>
  );
};