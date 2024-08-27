import express from "express";

const app = express();

app.get("/api", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Server is up",
  });
});

app.listen(3000, () => console.log("Server is working"));
