const express = require("express");
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());
const port = 3000;

let dbConnect = require("./services/dbConnect");

const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");

app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", require("./routes/review"));
app.use("/api/likes", require("./routes/like"));
app.use("/api/movie-likes", require("./routes/movieLikes"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
