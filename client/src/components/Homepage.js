import React from "react";
import { useEffect, useState } from "react";
import Blogs from "./Blogs";
import { useCookies } from "react-cookie";

function Homepage() {
  const [blogs, setBlogs] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const isLoggedIn = cookies.UserName ? true : false;
  const name = isLoggedIn ? cookies.UserName : "starnger";

  const getBlogs = async () => {
    try {
      const response = await fetch(`http://localhost:8000/blogs`);
      const resBlogs = await response.json();
      setBlogs(resBlogs);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getBlogs();
  }, []);

  return (
    <div>
      {blogs && <Blogs blogs={blogs} title={"VIEW A   LL THAT’S NEW"} />}
    </div>
  );
}

export default Homepage;
