import React from "react";

const Navbar = () => {
  return (
    <div className="navbar">
      <span className="logo">Users chat</span>
      <div className="user">
        <img src="https://images.pexels.com/photos/12547195/pexels-photo-12547195.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" />
        <span>John</span>
        <button>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
