import React from "react";
import { useEffect, useState } from "react";
import Blogs from "./Blogs";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";

import BlogsPreview from "../images/blogs-preview.png";
import MyBlogs from "../images/myblogs.png";
import Post from "../images/post.png";

function LandingPage() {
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
    <div className="landing-page" style={{ color: "black" }}>
      <div id="welcome-message">Hello, {name}!</div>
      <div id="title">choose your next move</div>

      <div className="pages-container-titles">
        <div id="see-my-blogs">see my blogs</div>
        <div id="see-all-blogs">see all blogs</div>
        <div id="create-new">create new</div>

        <div className="pages-container-imgs">
          <Link to="/create">
            {" "}
            <img style={{ left: 905 }} src={Post} alt="Blog Preview" />
          </Link>
          <Link to="/blogs">
            {" "}
            <img
              style={{
                left: 105,
              }}
              src={BlogsPreview}
            />
          </Link>
          <Link to="/">
            {" "}
            <img
              style={{
                left: 505,
              }}
              src={MyBlogs}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
