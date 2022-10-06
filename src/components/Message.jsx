import React from "react";

const Message = () => {
  return (
    <div className="message owner">
      <div className="messageInfo">
        <img src="https://images.pexels.com/photos/12547195/pexels-photo-12547195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>hello</p>
      </div>
    </div>
  );
};

export default Message;
