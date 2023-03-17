const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv").config();
const bodyParser = require("body-parser");
const product = require("./controller/product");

app.use(cors());

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `MongoDB Database "${con.connections[0].name}" connected on host: ${con.connection.host}`
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

// //Connect to DB command
connectDB();

//Middlewares
app.use(express.json());

//Route Middlewares
app.get("/", (res) => {
  res.send("Assignment-2 Backend connected.");
});
app.use("/api/inventory", product);

// Callback function to listen to changes unless manually exited.
app.listen(process.env.PORT, () => {
  console.log(`Backend connected at PORT: ${process.env.PORT}`);
});
