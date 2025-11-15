import mongoose from "mongoose";

export default async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("DB Connected Successfully");
    });

    connection.on("error", (err) => {
      console.log("Cannot connect to database", +err);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong" + error);
  }
}
