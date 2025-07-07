import fs from "fs";
import path from "path";

/**
 * Menghapus file dari direktori uploads
 * @param {string} filePath - Path file yang akan dihapus (e.g., "/uploads/filename.jpg")
 * @returns {Promise<boolean>} - True jika berhasil, false jika gagal
 */
export const deleteUploadedFile = async (filePath) => {
  try {
    if (!filePath) {
      return false;
    }

    // Hapus prefix "/uploads/" dari path jika ada
    const filename = filePath.replace("/uploads/", "");

    // Buat path lengkap ke file
    const fullPath = path.join(process.cwd(), "public", "uploads", filename);

    // Cek apakah file exists
    if (fs.existsSync(fullPath)) {
      // Hapus file
      fs.unlinkSync(fullPath);
      console.log(`File deleted successfully: ${fullPath}`);
      return true;
    } else {
      console.log(`File not found: ${fullPath}`);
      return false;
    }
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
    return false;
  }
};

/**
 * Menghapus multiple files sekaligus
 * @param {string[]} filePaths - Array path file yang akan dihapus
 * @returns {Promise<object>} - Object dengan informasi hasil penghapusan
 */
export const deleteMultipleFiles = async (filePaths) => {
  const results = {
    success: [],
    failed: [],
    total: filePaths.length,
  };

  for (const filePath of filePaths) {
    const isDeleted = await deleteUploadedFile(filePath);
    if (isDeleted) {
      results.success.push(filePath);
    } else {
      results.failed.push(filePath);
    }
  }

  return results;
};

/**
 * Membersihkan file-file yang tidak digunakan di database
 * @param {string[]} usedFiles - Array path file yang masih digunakan
 * @returns {Promise<object>} - Object dengan informasi file yang dihapus
 */
export const cleanupUnusedFiles = async (usedFiles = []) => {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Cek apakah direktori uploads exists
    if (!fs.existsSync(uploadsDir)) {
      return {
        deleted: [],
        errors: [],
        message: "Uploads directory not found",
      };
    }

    // Baca semua file di direktori uploads
    const allFiles = fs.readdirSync(uploadsDir);

    // Normalisasi used files (hapus prefix /uploads/)
    const normalizedUsedFiles = usedFiles
      .map((file) => (file ? file.replace("/uploads/", "") : ""))
      .filter((file) => file !== "");

    // Cari file yang tidak digunakan
    const unusedFiles = allFiles.filter(
      (file) => !normalizedUsedFiles.includes(file)
    );

    const results = {
      deleted: [],
      errors: [],
      totalFiles: allFiles.length,
      usedFiles: normalizedUsedFiles.length,
      unusedFiles: unusedFiles.length,
    };

    // Hapus file yang tidak digunakan
    for (const file of unusedFiles) {
      try {
        const filePath = path.join(uploadsDir, file);
        fs.unlinkSync(filePath);
        results.deleted.push(file);
        console.log(`Unused file deleted: ${file}`);
      } catch (error) {
        results.errors.push({ file, error: error.message });
        console.error(`Error deleting unused file ${file}:`, error);
      }
    }

    return results;
  } catch (error) {
    console.error("Error cleaning up unused files:", error);
    return { deleted: [], errors: [{ error: error.message }] };
  }
};
