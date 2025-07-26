import app from "./index.js";
import db from "./config/Database.js";
import "./models/associations.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await db.authenticate();
    // await db.sync();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
