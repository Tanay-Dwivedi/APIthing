const express = require("express");
const users = require("./userData.json");

const app = express();
const PORT = 8000;

// Routes

app.get("/users", (req, res) => {
  const html = `
    <ul>
    ${Object.values(users)
      .flat()
      .map((user) => `<li>${user.author_name}</li>`)
      .join("")}
    </ul>
    `;
  res.send(html);
});

app.get("/api/users", (req, res) => {
  const allUsers = Object.values(users).flat();
  return res.json(allUsers);
});

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    let foundChapter = null;

    Object.keys(users).forEach(chapterKey => {
        const chapter = users[chapterKey];
        const user = chapter.find(user => user.id === id);
        if (user) foundChapter = chapter;
    });

    return res.json(foundChapter || { error: "Chapter not found" });
});


app.listen(PORT, () => console.log("Server running at: ${PORT}"));
