import React from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";
//import { LikeButton, Provider } from "@lyket/react";

function LikeAtt({ blogID, isAuthor }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const isLoggedIn = cookies.UserName ? true : false;
  const userName = isLoggedIn ? cookies.UserName : "starnger";


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

  const handleLike = async () => {
    //check if user has logged in
    if (!isLoggedIn) alert("you must log in in order to like this post;)");
    //check if the user is the author
    else if (isAuthor) alert("you can't like your own post;)");
    else {
      //like only if user have'nt liked before
      try {
        //the endpoint returns number of rows (aka times) a user liked a blog
        const response = await fetch(
          `http://localhost:8000/likes/${blogID}/${userName}`
        );
        const numberOfRows = await response.json();
        if (numberOfRows === 0) {
          postToLikes();
        } else {
          alert("you already liked this post!");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div>
      <button onClick={handleLike}>
        <svg
          style={{ color: "red" }}
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-heart-fill"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"
            fill="red"
          ></path>{" "}
        </svg>
      </button>
    </div>
  );
}

export default LikeAtt;
