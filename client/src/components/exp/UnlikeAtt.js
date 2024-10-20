import React from "react";
import { useCookies } from "react-cookie";

//user only accesses this page if isn't the author to begin with

function UnlikeAtt({blogID}) {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const isLoggedIn = cookies.UserName ? true : false;
  const userName = isLoggedIn ? cookies.UserName : "starnger";


  const handleUnLike = async () => {
    try {
      //the endpoint returns number of rows (aka times) a user liked a blog
      const response = await fetch(
        `http://localhost:8000/likes/${blogID}/${userName}`
      );
      const numberOfRows = await response.json();

      //only unlike if user has liked the post once
      if (numberOfRows === 1) {
        patchUnLike();
      }
      //
      else{
        alert("you didn't like this post to begin with...")
      }
    } catch (err) {
      console.log(err);
    }
  };

  const patchUnLike = async () => {
    try {
      const response = await fetch(`http://localhost:8000/unlike/${blogID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName }),
      });
      const json = await response.json();
      console.log(json);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div>
      {isLoggedIn && (
        <button onClick={handleUnLike}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 512 512"
          >
            <title>ionicons-v5-f</title>
            <path
              d="M448,256c0-106-86-192-192-192S64,150,64,256s86,192,192,192S448,362,448,256Z"
              style={{
                fill: "none",
                stroke: "#000",
                strokeMiterlimit: 10,
                strokeWidth: "32px",
              }}
            />
            <path d="M333.2,297.69c18.28-23.39,27.06-47.43,26.79-73.37-.31-31.06-25.22-56.33-55.53-56.33-20.4,0-35,10.64-44.11,20.42a5.93,5.93,0,0,1-8.7,0c-9.11-9.78-23.71-20.42-44.11-20.42L206,168a4,4,0,0,0-2.75,6.84l124,123.21A3.92,3.92,0,0,0,333.2,297.69Z" />
            <path d="M158.84,221a4,4,0,0,0-6.82,2.72c0,.21,0,.43,0,.64-.28,27.1,9.31,52.13,29.3,76.5,9.38,11.44,26.4,29.73,65.7,56.41a15.93,15.93,0,0,0,18,0c5.15-3.49,9.9-6.84,14.31-10a4,4,0,0,0,.46-6.07Z" />
            <path d="M336,368a15.92,15.92,0,0,1-11.31-4.69l-176-176a16,16,0,0,1,22.62-22.62l176,176A16,16,0,0,1,336,368Z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default UnlikeAtt;
