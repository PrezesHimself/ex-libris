const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.CONNECTIONSTRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client
  .connect()
  .then(() => console.log("connected to mongodb.."))
  .catch(err => console.error("could not connect to mongodb", err));

module.exports = {
  client,
};
