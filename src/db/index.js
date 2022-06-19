const { MongoClient, ServerApiVersion } = require('mongodb');
const uri =
  'mongodb+srv://' +
  process.env.DBUSER +
  ':' +
  process.env.DBPASSWORD +
  '@cluster0.7x88n.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client
  .connect()
  .then(() => console.log('connected to mongodb..'))
  .catch((err) => console.error('could not connect to mongodb', err));

module.exports = {
  client,
};
