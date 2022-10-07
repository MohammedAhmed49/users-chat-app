import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { firebaseGetUserChats, firebaseSearchUser } from "../utils/firebase";

const Search = () => {
  const [userInput, setUserInput] = useState("");
  const [user, setUser] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const userSearch = async () => {
    const result = await firebaseSearchUser(userInput);
    setUser(result);
  };

  const handleKey = (e) => {
    e.key === "Enter" && userSearch();
  };

  const selectUserHandler = async () => {
    const combinedId =
      user.uid > currentUser.uid
        ? user.uid + currentUser.uid
        : currentUser.uid + user.uid;

    await firebaseGetUserChats(currentUser, user, combinedId);

    setUser(null);
    setUserInput("");
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search for user"
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKey}
          value={userInput}
        />
      </div>
      {user ? (
        <div className="userChat" onClick={selectUserHandler}>
          <img src={user.photoURL} />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
