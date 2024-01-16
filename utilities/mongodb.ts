import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGO_URI;

if (!uri) {
  throw new Error("No connection string in mongodb.ts");
}

const IS_DEV = process.env.NODE_ENV === "development";

const options: MongoClientOptions = {};

let client;
let clientPromise: Promise<MongoClient>;

if (IS_DEV) {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
