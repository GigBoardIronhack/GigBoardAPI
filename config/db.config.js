const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/GigBoard";

mongoose
  .connect(MONGO_URI)
  .then((x)=>{
    console.log(`Connected to Mongo! Database Name: "${x.connections[0].name}"`)
  })
  .catch((error)=>{
    console.error("error connecting to mongo: ", error)
  })