import mongoose from "mongoose";

export function connect() {
  if (mongoose.connection.readyState >= 1) {
    return Promise.resolve(mongoose.connection);
  }

  return mongoose
    .connect(process.env.MONGO_URL!, {
      tls: true,
      ssl: true,
    })
    .then((connection) => {
      console.log("Database connected successfully");
      return connection;
    })
    .catch((err) => {
      console.log("The DB error is", err);
      throw err;
    });
}
