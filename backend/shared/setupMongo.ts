import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(Bun.env.MONGO_URI!, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Deployment pinged, successfully connected to MongoDB.");
  } finally {
    await client.close();
  }
}

export default run;
