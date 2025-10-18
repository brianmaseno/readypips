import { MongoClient, Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
console.log('[MongoDB] URI from env:', uri.substring(0, 50) + '...');
console.log('[MongoDB] Connecting to:', uri.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,  // Increased from 5000
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,  // Added
  retryWrites: true,
  retryReads: true,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
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

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB_NAME || "ready-pips";
    console.log('[MongoDB] Successfully connected to database:', dbName);
    return client.db(dbName);
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    throw error;
  }
}
