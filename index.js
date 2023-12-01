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

// Helper function to find chapter by chID
function findChapterByChID(chID) {
  for (const chapter in users) {
    if (users[chapter].chID == chID) {
      return users[chapter];
    }
  }
  return null;
}

// Routes

app.get("/api/users/:chID", (req, res) => {
  const chapterId = req.params.chID;
  const chapterData = findChapterByChID(chapterId);

  if (chapterData) {
    return res.json(chapterData);
  } else {
    return res.json({ error: "Chapter not found" });
  }
});

app.get("/api/users/:chID/:id", (req, res) => {
  const chapterId = req.params.chID;
  const userId = Number(req.params.id);

  const chapterData = findChapterByChID(chapterId);

  if (chapterData) {
    const userData = chapterData.users.find((user) => user.id === userId);
    if (userData) {
      return res.json(userData);
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
