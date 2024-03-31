const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const client = new MongoClient(process.env.MONGO_URI);

async function start() {
  await client.connect();

  console.log("Connected to Database");
  module.exports = client;
  const app = require("./app");

  app.listen(process.env.PORT);
}
start();
