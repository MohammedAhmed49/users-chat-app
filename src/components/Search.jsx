import React from "react";

const Search = () => {
  return (
    <div className="search">
      <div className="searchForm">
        <input type="text" placeholder="Search for user" />
      </div>
      <div className="userChat">
        <img src="https://images.pexels.com/photos/12547195/pexels-photo-12547195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
        <div className="userChatInfo">
          <span>Momo</span>
        </div>
      </div>
    </div>
  );
};

export default Search;
