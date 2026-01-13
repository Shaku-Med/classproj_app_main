import { MongoClient } from 'mongodb';
import type { Db, MongoClient as MongoClientType } from 'mongodb';
import { EnvValidator } from '../EnvValidator';

const mongoUri: string = EnvValidator(`MONGODB_URI`) || '';
const dbName: string = EnvValidator(`MONGODB_DB_NAME`) || '';

let client: MongoClientType | null = null;
let db: Db | null = null;

try {
  if (!mongoUri || !dbName) {
    console.warn('MongoDB credentials are missing. Using fallback client.');
  } else {
    client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    db = client.db(dbName);
  }
} catch (error) {
  console.warn('MongoDB client initialization failed. Using fallback client.', error);
}

const createMongoDBFallback = () => {
  const errorResponse = { data: null, error: new Error('MongoDB client not initialized') };
  const errorPromise = Promise.resolve(errorResponse);

  const createCollectionFallback = (): any => {
    const collection: any = {
      find: () => ({
        toArray: () => errorPromise,
        limit: () => ({
          toArray: () => errorPromise,
        }),
        sort: () => ({
          toArray: () => errorPromise,
        }),
        skip: () => ({
          toArray: () => errorPromise,
        }),
      }),
      findOne: () => errorPromise,
      insertOne: () => errorPromise,
      insertMany: () => errorPromise,
      updateOne: () => errorPromise,
      updateMany: () => errorPromise,
      deleteOne: () => errorPromise,
      deleteMany: () => errorPromise,
      countDocuments: () => errorPromise,
      aggregate: () => ({
        toArray: () => errorPromise,
      }),
      createIndex: () => errorPromise,
      dropIndex: () => errorPromise,
    };

    collection.then = errorPromise.then.bind(errorPromise);
    collection.catch = errorPromise.catch.bind(errorPromise);
    collection.finally = errorPromise.finally?.bind(errorPromise);

    return collection;
  };

  return {
    collection: (name: string) => createCollectionFallback(),
    admin: () => ({
      listDatabases: () => errorPromise,
    }),
    dropDatabase: () => errorPromise,
    createCollection: () => errorPromise,
    listCollections: () => ({
      toArray: () => errorPromise,
    }),
  };
};

const mongoClient = {
  client: client || null,
  db: db || createMongoDBFallback(),
  connect: async () => {
    if (client) {
      try {
        await client.connect();
        return true;
      } catch (error) {
        console.error('MongoDB connection failed:', error);
        return false;
      }
    }
    return false;
  },
  disconnect: async () => {
    if (client) {
      try {
        await client.close();
        return true;
      } catch (error) {
        console.error('MongoDB disconnection failed:', error);
        return false;
      }
    }
    return true;
  },
};

export default mongoClient;
