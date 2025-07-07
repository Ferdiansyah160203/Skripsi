// Test file untuk sistem file management
// Jalankan dengan: node testFileSystem.js

import { deleteUploadedFile, cleanupUnusedFiles } from "./utils/fileUtils.js";
import { Product } from "./models/associations.js";
import { Op } from "sequelize";

// Test 1: Delete single file
async function testDeleteFile() {
  console.log("=== Test Delete Single File ===");

  // Test dengan file yang tidak ada
  const result1 = await deleteUploadedFile("/uploads/non-existent-file.jpg");
  console.log("Delete non-existent file:", result1);

  // Test dengan path kosong
  const result2 = await deleteUploadedFile("");
  console.log("Delete empty path:", result2);

  // Test dengan null
  const result3 = await deleteUploadedFile(null);
  console.log("Delete null path:", result3);
}

// Test 2: Cleanup unused files
async function testCleanupFiles() {
  console.log("\\n=== Test Cleanup Unused Files ===");

  try {
    // Ambil semua file yang digunakan dari database
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
    console.log("Used files in database:", usedFiles);

    // Cleanup unused files
    const result = await cleanupUnusedFiles(usedFiles);
    console.log("Cleanup result:", result);
  } catch (error) {
    console.error("Error during cleanup test:", error);
  }
}

// Test 3: Test manual cleanup
async function testManualCleanup() {
  console.log("\\n=== Test Manual Cleanup ===");

  try {
    const { manualFileCleanup } = await import("./utils/fileScheduler.js");
    const result = await manualFileCleanup();
    console.log("Manual cleanup result:", result);
  } catch (error) {
    console.error("Error during manual cleanup test:", error);
  }
}

// Jalankan semua test
async function runAllTests() {
  await testDeleteFile();
  await testCleanupFiles();
  await testManualCleanup();
}

// Export untuk digunakan dari luar
export { testDeleteFile, testCleanupFiles, testManualCleanup, runAllTests };

// Jika file ini dijalankan langsung
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}
