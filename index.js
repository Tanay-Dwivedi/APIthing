const express = require("express");
const path = require("path");
const users = require("./userData.json");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

// CORS handling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Serve HTML file for the root path
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Define API route
app.get("/api", (req, res) => {
  // Your existing API route logic
  // ...
  const chID = req.query.chID;
  const id = req.query.id;

  if (chID) {
    const chapterData = findChapterByChID(chID);

    if (chapterData) {
      if (id) {
        // Return user with specified ID inside the specified chapter
        const userData = chapterData.users.find(
          (user) => user.id === Number(id)
        );
        if (userData) {
          return res.json(userData);
        } else {
          return res.json({ error: "User not found in the specified chapter" });
        }
      } else {
        // Return all users in the specified chapter
        return res.json(chapterData);
      }
    } else {
      return res.json({ error: "Chapter not found" });
    }
  } else {
    // Return all users if 'chID' query parameter is not provided
    return res.json(users);
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
