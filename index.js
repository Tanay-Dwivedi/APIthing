// Import the Express framework and user data from a JSON file
const express = require("express");
const users = require("./userData.json");

// Create an Express application and set the port
const app = express();
const PORT = 8000;

// Middleware to parse JSON in requests
app.use(express.json());

// CORS handling - Allow all origins, headers, and methods
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// In-memory cache for optimized data retrieval
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

// Define API routes

// Route to get user data based on 'chID' and 'id' query parameters
app.get("/", (req, res) => {
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

// Start the server and log the port
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
