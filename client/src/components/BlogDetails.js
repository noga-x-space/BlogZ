import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Unlike from "./Unlike";
import Like from "./Like";
import LikeAtt from "./exp/LikeAtt";
import UnlikeAtt from "./exp/UnlikeAtt";
import { useCookies } from "react-cookie";
import ReactQuill from "react-quill";
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
    [
      "link",
      // "image"
    ],
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
  // "paragraph",
  // "image"
];

function BlogDetails() {
  const { id } = useParams();
  const [isAuthor, setIsAuthor] = useState(false);
  const [blog, setBlog] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  //editing parts
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const quillRef = useRef(null);

  const [titleCharCount, setTitleCharCount] = useState(0);
  const [contentCharCount, setContentCharCount] = useState(0);

  const handleFetch = async () => {
    try {
      const response = await fetch(`http://localhost:8000/blogs/${id}`);
      const fetchedBlog = await response.json();
      setBlog(fetchedBlog);

      // Check the type of fetchedBlog.title
      if (typeof fetchedBlog.title === "object") {
        // If it's an object, convert it to a string
        setEditedTitle(JSON.stringify(fetchedBlog.title));
      } else {
        // Otherwise, set the value as is
        setEditedTitle(fetchedBlog.title);
      }

      setEditedContent(fetchedBlog.content);
      if (cookies.UserName === fetchedBlog.author) {
        setIsAuthor(true);
      }

      //set the character count for title and content
      setTitleCharCount(fetchedBlog.title.length);
      setContentCharCount(fetchedBlog.content.length);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (titleCharCount >= 5 && contentCharCount >= 20) {
      try {
        const response = await fetch(`http://localhost:8000/blogs/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editedTitle,
            content: editedContent,
          }),
        });
        const updatedBlog = await response.json();
        handleFetch();
        console.log(updatedBlog);
        setBlog(updatedBlog);
        setIsEditing(false);
      } catch (err) {
        console.error(err);
      }
    } else if (contentCharCount < 20) {
      alert("you must type in at least 20 characters to the content!");
    } else {
      alert("you must type in at least 5 characters!");
    }
  };

  // const handleTitleChange = (value) => {
  //   setEditedTitle(value);
  //   setTitleCharCount(value.length);
  // };

  const handleContentChange = (value) => {
    if (quillRef.current) {
      const content = quillRef.current.getEditor().getText();
      if (content.length < 2000) {
        setEditedContent(value);
        setContentCharCount(content.length);
      }
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="blog-details">
      {blog && (
        <>
          <div className="title">
            {isEditing ? (
              <>
                <input
                  id="title"
                  type="text"
                  required
                  value={editedTitle}
                  onChange={(e) => {
                    setEditedTitle(e.target.value);
                    setTitleCharCount(e.target.value.length);
                  }}
                  maxLength="70"
                />
                <div>{titleCharCount}/70</div>
              </>
            ) : (
              <>
                {isAuthor && (
                  <div>
                    <button id="edit-btn" onClick={handleEdit}>
                      {isEditing ? "Cancel" : "Time to edit"}
                    </button>
                    {isEditing && <button onClick={handleSave}>SAVE</button>}
                  </div>
                )}
                <h1>{blog.title}</h1>
                <div className="blog-details-author">By {blog.author}</div>
              </>
            )}
          </div>
          <div className="author-edit">
            {isAuthor && !isEditing && (
              <h2 style={{ color: "#bc4123" }}>Hello, Author</h2>
            )}

            {!isEditing && (
              <div className="likes">
                {
                  //only if user isn't author, click like or unlike either way only see the like option if author
                }
                <LikeAtt blogID={blog.id} isAuthor={isAuthor} />
                {!isAuthor && <UnlikeAtt blogID={blog.id} />}
                <div id="blog-details-like-count">{blog.likes}</div>
              </div>
            )}
          </div>
          <div className="content">
            {isEditing ? (
              <>
                <ReactQuill
                  className="react-quill-create-content"
                  ref={quillRef}
                  value={editedContent}
                  onChange={handleContentChange}
                  formats={formats}
                  modules={modules}
                  maxLength={2000}
                  readOnly={contentCharCount > 2001}
                />
                <div>{contentCharCount}/2000</div>
              </>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default BlogDetails;

// <input
// type="text"
// required
// value={editedTitle}
// onChange={handleTitleChange}
// placeholder="title"
// maxLength="70"
// />

// <ReactQuill
//   value={editedTitle}
//   onChange={handleTitleChange}
//   placeholder="title"
//   maxLength="70"
// />
