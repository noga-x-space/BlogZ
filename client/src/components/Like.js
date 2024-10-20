import React from "react";
import { useCookies } from "react-cookie";
import Heart from '../images/heart.png'

function Like({ blogID, clickable}) {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const isLoggedIn = cookies.UserName ? true : false;
  const userName = isLoggedIn ? cookies.UserName : "starnger";

  const handleLike = async (e) => {
    if (!blogID) {
      console.error("blogID is not defined");
      return;
    }
    console.log(blogID);
    try {
      if (!userName) {
        console.error("userName is not defined");
        return;
      }
      e.preventDefault();
      const response = await fetch(`http://localhost:8000/likes/${blogID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName }),
      });
      const json = await response.json();
      
      console.log("patch response: ", json);
      const likes = await postToLikes();
      console.log("json object from post request: ", likes);
    } catch (err) {
      console.error(err);
    }
  };

  const postToLikes = async () => {
    try {
      const response = await fetch(`http://localhost:8000/likes/${blogID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName }),
      });
  
      console.log("Response from server:", response);
  
      const json = await response.json();
      console.log("JSON response from server:", json);
  
      return json;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {clickable && isLoggedIn && (
        <button onClick={handleLike} >
          {Heart}
        </button>
      )}
      
      {(!clickable || !isLoggedIn) && (
        <div className="hover-me">
        <svg
          style={{ color: "red" }}
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-heart-fill hover-me"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
            fill="red"
          ></path>{" "}
        </svg></div>
      )}
    </div>
  );
}

export default Like;
