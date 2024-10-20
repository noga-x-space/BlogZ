// export default CreateExpierement;
import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCookies } from "react-cookie";

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

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");

  const [cookies, setCookie, removeCookie] = useCookies(null);
  const author = cookies.UserName;
  

  const data = {
    title,
    content,
    author: author,
    date: new Date(),
  };

  async function createPost(e) {
    e.preventDefault();

    try {
      console.log(data.title, data.content, data.author, data.date);
      const response = await fetch("http://localhost:8000/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      console.log(response.status);
      console.log(await response.text());
      if (response.status === 200) {
        console.log("Worked");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      {author && (
        <div className="create">
          <h1>CREATE A NEW BLOG</h1>
          <form onSubmit={createPost}>
            <input
              type="title"
              placeholder={"Title"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input type="file" onChange={(e) => setFiles(e.target.files)} />

            <ReactQuill
              value={content}
              modules={modules}
              formats={formats}
              onChange={(newValue) => setContent(newValue)}
            />

            <button style={{ marginTop: "5px" }}>CREATE POST</button>
          </form>
          {data.author}
        </div>
      )}
      {!author && (
        <>
          <h1>We're Sorry</h1>
          <h2>But in order to post you must log in.</h2>
        </>
      )}
    </>
  );
}

export default CreateBlog;
