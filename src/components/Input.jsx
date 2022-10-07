import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { firebaseSendMsg, updateLastMessage } from "../utils/firebase";
import { ChatContext } from "../context/ChatContext";
import { v4 as uuid } from "uuid";
import { AuthContext } from "../context/AuthContext";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  const sendHandler = async () => {
    await firebaseSendMsg(data.chatId, img, text, uuid(), currentUser);
    await updateLastMessage(currentUser, data.user, data.chatId, text);
    setText("");
    setImg(null);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img className="max-w-none" src={Img} />
        </label>
        <button onClick={sendHandler}>Send</button>
      </div>
    </div>
  );
};

export default Input;
