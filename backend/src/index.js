const express = require("express");
require("dotenv").config();

const app = express();
const port = 3000;

let dbConnect = require("./services/dbConnect");

const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at 
http://localhost:${port}`);
});
