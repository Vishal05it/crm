import mongoose from "mongoose";
const DB_URL = process.env.DB_URL!;
if (!DB_URL) throw new Error("Database string is missing!");
export async function connectToDB() {
  if (mongoose.connection.readyState > 2) {
    throw new Error("Error connecting to DB");
  }
  await mongoose.connect(DB_URL);
}
