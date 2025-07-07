import cron from "node-cron";
import { Product } from "../models/associations.js";
import { cleanupUnusedFiles } from "../utils/fileUtils.js";
import { Op } from "sequelize";

/**
 * Scheduled cleanup yang berjalan setiap hari pada jam 2 pagi
 */
export const scheduleFileCleanup = () => {
  // Jadwal: setiap hari pada jam 02:00
  cron.schedule("0 2 * * *", async () => {
    console.log("Starting scheduled file cleanup...");

    try {
      // Ambil semua file yang masih digunakan dari database
      const products = await Product.findAll({
        attributes: ["image"],
        where: {
          image: {
            [Op.ne]: null,
          },
        },
      });

      // Ekstrak path file yang masih digunakan
      const usedFiles = products
        .map((product) => product.image)
        .filter((image) => image !== null);

      // Bersihkan file yang tidak digunakan
      const results = await cleanupUnusedFiles(usedFiles);

      console.log("Scheduled file cleanup completed:", results);
    } catch (error) {
      console.error("Error during scheduled file cleanup:", error);
    }
  });

  console.log("File cleanup scheduler started - runs daily at 2:00 AM");
};

/**
 * Cleanup manual yang bisa dipanggil kapan saja
 */
export const manualFileCleanup = async () => {
  console.log("Starting manual file cleanup...");

  try {
    // Ambil semua file yang masih digunakan dari database
    const products = await Product.findAll({
      attributes: ["image"],
      where: {
        image: {
          [Op.ne]: null,
        },
      },
    });

    // Ekstrak path file yang masih digunakan
    const usedFiles = products
      .map((product) => product.image)
      .filter((image) => image !== null);

    // Bersihkan file yang tidak digunakan
    const results = await cleanupUnusedFiles(usedFiles);

    console.log("Manual file cleanup completed:", results);
    return results;
  } catch (error) {
    console.error("Error during manual file cleanup:", error);
    throw error;
  }
};
