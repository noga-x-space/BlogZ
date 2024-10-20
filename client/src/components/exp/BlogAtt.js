import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Cookies, useCookies } from "react-cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LikeAtt from "./LikeAtt";
import UnlikeAtt from "./UnlikeAtt";

function BlogAtt() {
  //given information about blog and user
  const { id } = useParams();
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userName = cookies.UserName;

  //blog parameters from fetch function
  const [blog, setBlog] = useState(null);
  const [blogTitle, setBlogTitle] = useState(null);
  const [blogContent, setBlogContent] = useState(null);
  // const [blogAuthor, setBlogAuthor]=useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const handleFetch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/blogs/${id}`);
      const fetchedBlog = await response.json();
      setBlog(fetchedBlog);

      setIsAuthor(fetchedBlog.author === userName);

      setBlogTitle(fetchedBlog.title);
      setBlogContent(fetchedBlog.content);
    } catch {}
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleEdit = async ()=>{
    
  }
  return (
    <div>
      {blog && (
        <>
          {isAuthor && <><h2 style={{ color: "#bc4123" }}>Hello, Author </h2>
          <button onclick={handleEdit}>edit</button>
          </>
          
        }

          <div className="Blog-Title">
            <h1>{blog.title}</h1>
          </div>
          <div className="Blog-Author"><h3>{blog.author}</h3></div>
          <div className="likes">
            {blog.likes}
            <LikeAtt />
          </div>
          <div className="Blog-Content">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>
        </>
      )}
    </div>
  );
}

export default BlogAtt;
