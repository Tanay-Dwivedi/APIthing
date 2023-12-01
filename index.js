const express = require("express");
const users = require("./userData.json");

const app = express();
const PORT = 8000;

// Middleware to parse JSON in requests
app.use(express.json());

// CORS handling - Adjust origin as needed
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Routes

app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/api/users/:chapter", (req, res) => {
  const chapterId = req.params.chapter;
  const chapterData = users[chapterId];

  if (chapterData) {
    return res.json({ [chapterId]: chapterData });
  } else {
    return res.json({ error: "Chapter not found" });
  }
});

app.get("/api/users/:chapter/:id", (req, res) => {
  const chapterId = req.params.chapter;
  const userId = Number(req.params.id);

  const chapterData = users[chapterId];

  if (chapterData) {
    const userData = chapterData.find((user) => user.id === userId);
    if (userData) {
      return res.json({ [chapterId]: [userData] });
    } else {
      return res.json({ error: "User not found in the specified chapter" });
    }
  } else {
    return res.json({ error: "Chapter not found" });
  }
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
