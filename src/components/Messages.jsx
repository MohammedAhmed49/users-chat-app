import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../utils/firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);
  useEffect(() => {
    console.log(data.chatId);
    const fetchMessages = () => {
      const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      });

      return () => {
        unsubscribe();
      };
    };

    data.chatId && fetchMessages();
  }, [data.chatId]);
  console.log(messages);
  return (
    <div className="messages">
      {messages?.map((message) => {
        return <Message message={message} key={message.id} />;
      })}
    </div>
  );
};

export default Messages;
