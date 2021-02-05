const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
const app = express();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database is running well");
  })
  .catch((err) => {
    console.log(err);
  });

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//route middlewares
app.use("/api/user", authRoutes);

const port = 3000 || process.env.PORT;
app.listen(3000, () => {
  console.log(`app is running on port ${port}`);
});
