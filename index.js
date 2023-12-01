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

// In-memory cache
const cache = {};

// Helper function to find chapter by chID
function findChapterByChID(chID) {
  if (cache[chID]) {
    // Return cached data if available
    return cache[chID];
  }

  for (const chapter in users) {
    if (users[chapter].chID == chID) {
      // Cache the fetched data
      cache[chID] = users[chapter];
      return cache[chID];
    }
  }

  return null;
}

// Helper function to find user by ID across all chapters
function findUserByID(userID) {
  for (const chapter in users) {
    const userData = users[chapter].users.find((user) => user.id === userID);
    if (userData) {
      return userData;
    }
  }
  return null;
}

// Routes

app.get("/api/users", (req, res) => {
  // Check if 'id' query parameter is provided
  const id = req.query.id;

  if (id) {
    // Search for the user with the specified ID across all chapters
    const userData = findUserByID(Number(id));

    if (userData) {
      return res.json(userData);
    } else {
      return res.json({ error: "User not found" });
    }
  } else {
    // Return all users if 'id' query parameter is not provided
    return res.json(users);
  }
});

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
