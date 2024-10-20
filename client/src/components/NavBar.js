import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";

function NavBar() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const isLoggedIn = cookies.UserName ? true : false;
  const name = isLoggedIn ? cookies.UserName : "starnger";

  const handleSignOut = () => {
    removeCookie("UserName");
    removeCookie("AuthToken");

    window.location.reload();
  };
  return (
    <div className="navbar">
      <h1>BLOGZ</h1>
      <div className="links">
        <NavLink to="/">blogs</NavLink>
        <NavLink to="/create">post</NavLink>
        {!cookies.UserName && <NavLink to="/signup">log in</NavLink>}
        {cookies.UserName && <button onClick={handleSignOut}>log out</button>}
      </div>
    </div>
  );
}

export default NavBar;

// <div className="navbar" style={{width: 1350, height: 87, left: 90, top: 20, position: 'absolute'}}>
// <div style={{width: 1233, height: 0, left: '40px', top: 40, position: 'absolute', border: '0.50px #BC9090 solid'}}></div>

// <div style={{width: 163, left: 70,  position: 'absolute', color: '#951E1E', fontSize: 21, fontFamily: 'Inter', fontStyle:'normal', fontWeight: '400', wordWrap: 'break-word'}}>BLOGZ</div>
//   <div className="links">
//   <NavLink  to="/" style={{left: 874, position: 'absolute', color: '#A56868', fontSize: 18, fontFamily: 'Inter',fontStyle:'normal', fontWeight: '400', wordWrap: 'break-word'}} >blogs</NavLink>
//   <NavLink  to="/create" style={{left: 1012, position: 'absolute', color: '#A56868', fontSize: 18, fontFamily: 'Inter', fontStyle:'normal',fontWeight: '400', wordWrap: 'break-word'}}>post</NavLink>
// {!cookies.UserName &&
//   <NavLink  to="/signup" style={{left: 1134,  position: 'absolute', color: '#A56868', fontSize: 18, fontFamily: 'Inter',fontStyle:'normal', fontWeight: '400', wordWrap: 'break-word'}} >log in</NavLink>
// }
// {cookies.UserName&& <button onClick={handleSignOut} style={{left: 1089,border: 'none',  position: 'absolute', color: '#A56868', fontStyle:'normal',fontSize: 18, fontFamily: 'Inter', fontWeight: '400', wordWrap: 'break-word'}}>log out</button>}
// </div>
// </div>
