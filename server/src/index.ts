import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (_req, res) => {
  res.json({ message: "SmartPickr server up" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
