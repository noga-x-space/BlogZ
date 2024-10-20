import { Link } from "react-router-dom";
import Like from "./Like";
import { useState } from "react";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import "../Homepage.css";
import Heart from "../images/heart.png";
import BlogsPreview from "../images/blogs-preview.png";
import heart from "../images/heart.png";

const Blogs = ({ blogs, title }) => {
  const [filteredBlogs, setFilteredBlogs] = useState(blogs);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  //these are for the dropdown
  const [options, setOptions] = useState(null);
  const [selectedOption, setSelectedOption] = useState("All authors");

  //this function gets the author names for the dropdown
  const getAuthors = async () => {
    try {
      const response = await fetch(`http://localhost:8000/authors`);
      const json = await response.json();
      setOptions(json);
    } catch (err) {
      console.log(err);
    }
  };

  const getLikes = async (blogID) => {
    try {
      const response = await fetch(`http://localhost:8000/likes/${blogID}`);
      const json = await response.json();
      const likesCount = json;
    } catch (err) {
      console.error(err);
    }
  };

  const getAuthorBlogs = async () => {
    if (selectedOption !== "All authors") {
      try {
        const response = await fetch(
          `http://localhost:8000/authors/${selectedOption}`
        );
        const json = await response.json();
        setFilteredBlogs(json);
      } catch (err) {
        console.log(err);
      }
    } else {
      setFilteredBlogs(blogs); // If "All authors" is selected, show all blogs
    }
  };

  useEffect(() => {
    getAuthors();
    //getLikes();
  }, []);
  useEffect(() => {
    getAuthorBlogs();
  }, [selectedOption]);

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8000/blogs/${id}`, {
        method: "DELETE",
      });
      alert(`Blog deleted successfully`);
      console.log(`Blog with id ${id} deleted successfully`);

      // fetch the updated list of blogs and update the state
      const response = await fetch(`http://localhost:8000/blogs`);
      const json = await response.json();
      setFilteredBlogs(json);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="blogs-page">
      <div id="blogs-page-title">
        <div>{title}</div>
      </div>

      <div className="blogs-container">
        <div className="select-wrapper">
          <select
            id="options"
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value);
            }}
          >
            <option value="All authors">All authors</option>
            {options &&
              options.map((possible_option) => {
                return (
                  <option
                    key={possible_option.author}
                    value={possible_option.author}
                  >
                    {possible_option.author}
                  </option>
                );
              })}
          </select>
        </div>
        <div className="blogs">
          {filteredBlogs.map((blog) => {
            return (
              <div key={blog.id} className="blog-preview">
                <Link to={`/blogs/${blog.id}`}>
                  <div className="blog-title">{blog.title}</div>

                  <div id="blog-preview-like-count">{blog.likes}</div>
                  <div id="blog-preview-like-icon">
                    <Like blogID={blog.id} clickable={false} />
                  </div>

                  <div id="blog-preview-author">
                    <p>written by {blog.author}</p>
                  </div>
                </Link>
                <div id="blog-preview-line"></div>

                {cookies.UserName === blog.author && (
                  <button
                    className="blog-delete-btn"
                    onClick={() => handleDelete(blog.id)}
                  >
                    DELETE BLOG
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Blogs;

//original blogs without figma interferance:

// <div className="blogs">
//         {filteredBlogs.map((blog) => {
//           return (
//             <div key={blog.id} className="blog-preview">
//               <Link to={`/blogs/${blog.id}`}>
//                 <div className="blog-title">
//                   <h2 dangerouslySetInnerHTML={{ __html: blog.title }} />
//                   <div className="likes-container">
//                     {blog.likes}
//                     <Like blogID={blog.id} clickable={false} />
//                   </div>
//                 </div>

//                 <p>written by {blog.author}</p>
//               </Link>
//               {cookies.UserName === blog.author && (
//                 <div className="blog-delete-button-container">
//                   <button
//                     className="blog-delete-button"
//                     onClick={() => handleDelete(blog.id)}
//                   >
//                     DELETE BLOG
//                   </button>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
