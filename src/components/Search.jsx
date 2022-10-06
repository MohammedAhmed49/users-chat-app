import React, { useRef, useState } from "react";
import { firebaseSearchUser } from "../utils/firebase";

const Search = () => {
  const [userInput, setUserInput] = useState(null);
  const [user, setUser] = useState(null);

  const userSearch = async () => {
    const result = await firebaseSearchUser(userInput);
    setUser(result);
  };

  const handleKey = (e) => {
    e.key === "Enter" && userSearch();
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search for user"
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      {user ? (
        <div className="userChat">
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
