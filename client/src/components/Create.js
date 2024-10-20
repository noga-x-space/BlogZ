import React, { useState } from "react";
import { useCookies } from "react-cookie";
import ReactQuill from "react-quill";
import { useHistory } from "react-router-dom";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "paragraph",
];

function Create() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const author = cookies.UserName;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [titleCharCount, setTitleCharCount] = useState(0);
  const [contentCharCount, setContentCharCount] = useState(0);

  const history = useHistory();

  const data = {
    title,
    content,
    author,
    date: new Date(),
  };

  const postBlog = async (e) => {
    e.preventDefault();
    console.log(title, content);
    if (titleCharCount >= 5 && contentCharCount >= 20) {
      try {
        const response = await fetch("http://localhost:8000/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const json = await response.json();
        console.log(json);
        history.push("/");
      } catch (err) {
        console.log(err);
      }
    } else if (titleCharCount < 5) {
      alert("title must contain at least 5 characters!");
    } else if (contentCharCount < 20) {
      alert("content must contain at least 20 characters!");
    }
  };

  const handleContentChange = (value) => {
    if (value.length <= 2000) {
      setContent(value);
      setContentCharCount(value.length);
    }
  };
  const handleTitleChange = (e) => {
    const value = e.target.value;
    
    if (value.length <= 70) {
      setTitle(value);
      setTitleCharCount(value.length);
    }
  };
  return (
    <div className="create">
      {cookies.UserName && (
        <>
          {" "}
          <h1>CREATE A NEW BLOG</h1>
          <form onSubmit={postBlog}>
            <div id="title">
              <input
                type="text"
                name="title"
                required
                value={title}
                // onChange={(e) => {
                //   setTitle(e.target.value);
                //   setTitleCharCount(e.target.value.length);
                // }}
                onChange={handleTitleChange}
                placeholder="My Title Is Going To Be..."
                maxLength="70"
              />
              <p className="character-counter" id="title-char-count">{ titleCharCount + "/70"}</p>
            </div>
            <div id="content">
              <ReactQuill
              className="react-quill-create-content"
                required
                value={content}
                onChange={handleContentChange}
                formats={formats}
                modules={modules}
                maxLength={2000}
                readOnly={contentCharCount > 2001}
              />
             <p className="character-counter" id="content-char-count">{contentCharCount + "/2000"}</p> 
            </div>
            <button type="submit" id="submit-new-blog" >
              CREATE POST
            </button>
          </form>
        </>
      )}
      {!cookies.UserName && (
        <h3 className="unreachable-statement">
          You are not currently logged in. Please log in to create a new blog.
        </h3>
      )}
    </div>
  );
}

export default Create;

//  <input
// type="text"
// name="title"
// required
// onChange={handleTitleChange}
// placeholder="title"
// maxLength="70"
// />

// <ReactQuill
// type="text"
// name="title"
// required
// formats={formats}
// maxLength={70}
// onChange={handleTitleChange}
// />
