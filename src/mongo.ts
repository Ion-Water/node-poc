import { MongoClient } from 'mongodb';
// Connection URI
const uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`;
// Create a new MongoClient
const client = new MongoClient(uri);

let started = false;

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db('admin').command({ ping: 1 });
    console.log('Connected successfully to server');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

export async function getMongoClient(): Promise<MongoClient | null> {
  if (started) {
    return client;
  }

  try {
    await run();
    started = true;
    return client;
  } catch (exception) {
    return null;
  }
}
