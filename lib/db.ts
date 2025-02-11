import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectionToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };


  cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => 
    mongoose.connection
  );
}
try{
  cached.conn = await cached.promise;
  return cached.conn;
} catch(e){
    cached.promise = null
  console.log(e)
}
}
