const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv");
const swaggerSetup = require("./swagger");

dotenv.config();

const app = express();
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
swaggerSetup(app);
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

module.exports = app;
