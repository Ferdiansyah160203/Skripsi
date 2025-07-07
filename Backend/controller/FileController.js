import { Product } from "../models/associations.js";
import { cleanupUnusedFiles } from "../utils/fileUtils.js";
import { Op } from "sequelize";
import fs from "fs";
import path from "path";

/**
 * Membersihkan file-file yang tidak digunakan
 */
export const cleanupFiles = async (req, res) => {
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

    res.status(200).json({
      message: "File cleanup completed",
      results,
    });
  } catch (error) {
    console.error("Error during file cleanup:", error);
    res.status(500).json({
      message: "Error during file cleanup",
      error: error.message,
    });
  }
};

/**
 * Mendapatkan statistik file uploads
 */
export const getFileStats = async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadsDir)) {
      return res.status(404).json({ message: "Uploads directory not found" });
    }

    const allFiles = fs.readdirSync(uploadsDir);

    // Ambil file yang digunakan di database
    const products = await Product.findAll({
      attributes: ["image"],
      where: {
        image: {
          [Op.ne]: null,
        },
      },
    });

    const usedFiles = products
      .map((product) => product.image)
      .filter((image) => image !== null);
    const normalizedUsedFiles = usedFiles
      .map((file) => (file ? file.replace("/uploads/", "") : ""))
      .filter((file) => file !== "");

    const unusedFiles = allFiles.filter(
      (file) => !normalizedUsedFiles.includes(file)
    );

    res.status(200).json({
      totalFiles: allFiles.length,
      usedFiles: normalizedUsedFiles.length,
      unusedFiles: unusedFiles.length,
      files: {
        all: allFiles,
        used: normalizedUsedFiles,
        unused: unusedFiles,
      },
    });
  } catch (error) {
    console.error("Error getting file stats:", error);
    res.status(500).json({
      message: "Error getting file stats",
      error: error.message,
    });
  }
};
