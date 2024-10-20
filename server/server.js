const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const pool = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer"); //this library works with uploads. I use it for the files for the post request.
const upload = multer({ dest: "uploads/" });
const fs = require("fs");

app.use(cors());
app.use(express.json());

// View Blogs //

// Get all blogs

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await pool.query("SELECT * FROM blogs");
    res.json(blogs.rows);
  } catch (err) {
    console.error(err);
  }
});

function isUUID(uuid) {
  const uuidRegex =
    /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return uuidRegex.test(uuid);
}

// get a specific blog
app.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let blog;

    blog = await pool.query(`SELECT * FROM blogs WHERE id = $1;`, [id]);
    res.json(blog.rows[0]);
  } catch (err) {
    console.error(err);
  }
});

//  Get blog details
// app.get("/blogs/:id", async (req, res) => {
//   const { id } = req.params;
//   try {
//     const blog = await pool.query(
//       `SELECT * FROM blogs WHERE id = ${id}::character varying;`
//     );
//     res.json(blog.rows[0]);
//   } catch (err) {
//     console.error(err);
//   }
// });

//  Update Blog

app.patch("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  console.log(title, " , ", content);
  try {
    console.log("this is the content: ", title, " , ", content);
    const updatedPost = await pool.query(
      "UPDATE blogs SET title=$1, content=$2 WHERE id =$3",
      [title, content, id]
    );
    res.json(updatedPost);
  } catch (err) {
    console.error(err);
  }
});

//  Create Blog
app.post("/post", async (req, res) => {
  // Get the number of rows in the table
  const result = await pool.query("SELECT COUNT(*) FROM blogs;");
  const count = parseInt(result.rows[0].count);

  // Set the id of the new record to the number of rows + 1
  const id = uuidv4();

  const { author, title, content, date } = req.body;

  console.log(author, title, content, date);

  try {
    const newBlog = await pool.query(
      "INSERT INTO blogs(id, title, content, author, date, likes) VALUES($1, $2, $3, $4, $5, $6);",
      [id, title, content, author, date, 0]
    );
    res.json(newBlog);
  } catch (err) {
    console.error(err);
  }
});

//delete a blog
app.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await pool.query("DELETE FROM blogs WHERE id=$1;", [
      id,
    ]);
    res.json(deletedBlog);
  } catch (err) {
    console.error(err);
  }
});

// Filter Blogs

//get all authors- go through all blogs and return their username
app.get("/authors", async (req, res) => {
  try {
    const authors = await pool.query("SELECT DISTINCT author FROM blogs;");
    res.json(authors.rows);
  } catch (err) {
    console.error(err);
  }
});

//get specific author's blogs
app.get("/authors/:author", async (req, res) => {
  const { author } = req.params;
  try {
    const blogs = await pool.query("SELECT * FROM blogs WHERE author=$1;", [
      author,
    ]);
    res.json(blogs.rows);
  } catch (err) {
    console.log(err);
  }
});

// likes //
//get likes from blog
app.get("/likes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const likes = await pool.query("SELECT * FROM likes WHERE blog_id = $1;", [
      id,
    ]);
    res.json(likes.rowCount);
  } catch (err) {
    console.error(err);
  }
});

//like a blog- post to likes
app.post("/likes/:id", async (req, res) => {
  //id is blog id
  const { id } = req.params;
  const { userName } = req.body;
  const userAlreadyLiked = await getLikeRecord(userName, id);
  if (!userAlreadyLiked) {
    try {
      //update the blogs table
      const likedBlog = await pool.query(
        " UPDATE blogs SET likes=likes + 1 WHERE id=$1 ",
        [id]
      );
      // Insert a new row into the likes table
      const likes = await pool.query(
        "INSERT INTO likes (blog_id, user_name) VALUES ($1, $2)",
        [id, userName]
      );
      res.json(likes.rows);
    } catch (err) {
      console.error(err);
    }
  }
});

//unlike a blog
app.patch("/unlike/:id", async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body;
  const userAlreadyLiked = getLikeRecord(userName, id);

  if (userAlreadyLiked) {
    try {
      // get the current likes count for the blog
      const blogData = await pool.query("SELECT * FROM blogs WHERE id = $1", [
        id,
      ]);
      const currentLikes = blogData.rows[0].likes;

      if (currentLikes > 0) {
        //update the blogs table
        const likedBlog = await pool.query(
          " UPDATE blogs SET likes=likes - 1 WHERE id=$1 ",
          [id]
        );

        // Delete the row from the likes table
        await pool.query(
          "DELETE FROM likes WHERE user_name = $1 AND blog_id = $2",
          [userName, id]
        );

        res.json(likes);
      } else {
        // in abnormal cases-if the likes count is already zero, just delete the like record from the likes table
        await pool.query(
          "DELETE FROM likes WHERE user_name = $1 AND blog_id = $2",
          [userName, id]
        );
      }
    } catch (err) {
      console.error(err);
    }
  }
});

// Function to check if a like record already exists for the user and blog combination
async function getLikeRecord(userName, blogId) {
  const likesRecord = await pool.query(
    "SELECT * FROM likes WHERE user_name = $1 AND blog_id = $2",
    [userName, blogId]
  );
  return likesRecord.rows[0];
}

// Function to return the number of rows of a like record that exists for the user and blog combination
app.get("/likes/:blogId/:userName", async (req, res) => {
  const { blogId, userName } = req.params;
  try {
    const likesRecord = await pool.query(
      "SELECT * FROM likes WHERE user_name = $1 AND blog_id = $2",
      [userName, blogId]
    );
    res.json(likesRecord.rowCount);
  } catch (err) {
    console.log(err);
  }
});

//sign up/in //

//signup
app.post("/signup", async (req, res) => {
  const { userName, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const signup = await pool.query(
      `INSERT INTO users (user_name, hashed_password) VALUES($1, $2)`,
      [userName, hashedPassword]
    );
    const token = jwt.sign({ userName }, "secret", { expiresIn: "1hr" });
    res.json({ userName, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

//login
app.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM users WHERE user_name = $1", [
      userName,
    ]);
    if (!users.rows.length) return res.json({ detail: "User does not exist!" });
    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign({ userName }, "secret", { expiresIn: "1hr" });
    if (success) {
      res.json({ userName: users.rows[0].user_name, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
  }
});

app.listen(PORT, console.log(`listening on port ${PORT}`));
