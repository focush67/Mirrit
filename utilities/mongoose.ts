import mongoose from "mongoose";

export default function connect() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  } else {
    const uri = process.env.NEXT_PUBLIC_MONGO_URI;
    if (!uri) {
      console.log("MONGO URL: ", uri);
      throw new Error("Connection string was not found: ");
    } else {
      console.log("DB ONLINE");
      return mongoose.connect(uri);
    }
  }
}
