import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../utils/firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const fetchChats = () => {
      const unsubscribe = onSnapshot(
        doc(db, "usersChat", currentUser.uid),
        (doc) => {
          setChats(doc.data());
        }
      );

      return () => {
        unsubscribe();
      };
    };

    currentUser.uid && fetchChats();
  }, [currentUser]);

  const userClickHandler = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  let content = <p>Loading ...</p>;

  if (chats) {
    content = (
      <>
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            return (
              <div
                className="userChat"
                key={chat[0]}
                onClick={() => userClickHandler(chat[1].userInfo)}
              >
                <img src={chat[1].userInfo.photoURL} />
                <div className="userChatInfo">
                  <span>{chat[1].userInfo.displayName}</span>
                  <p>{chat[1].lastMessage?.text}</p>
                </div>
              </div>
            );
          })}
      </>
    );
  }

  return <div className="chats">{content}</div>;
};

export default Chats;
