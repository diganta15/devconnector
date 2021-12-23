const express = require("express");
const morgan = require("morgan");
const { connectDB } = require("./config/db");

const app = express();



//Connect to database
connectDB();

//Init middleware
app.use(morgan("dev"));
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
    res.send("API Running");
});

//Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

module.exports = app;