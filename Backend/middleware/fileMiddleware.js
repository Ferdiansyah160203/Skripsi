import { deleteUploadedFile } from "../utils/fileUtils.js";

/**
 * Middleware untuk membersihkan file yang diupload jika terjadi error
 */
export const cleanupOnError = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  // Override res.send untuk menangkap error response
  res.send = function (data) {
    if (res.statusCode >= 400 && req.file) {
      // Jika ada error dan file sudah diupload, hapus file
      deleteUploadedFile(`/uploads/${req.file.filename}`);
    }
    originalSend.call(this, data);
  };

  // Override res.json untuk menangkap error response
  res.json = function (data) {
    if (res.statusCode >= 400 && req.file) {
      // Jika ada error dan file sudah diupload, hapus file
      deleteUploadedFile(`/uploads/${req.file.filename}`);
    }
    originalJson.call(this, data);
  };

  next();
};

/**
 * Middleware untuk logging file operations
 */
export const logFileOperations = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;

  // Override res.send untuk logging
  res.send = function (data) {
    if (req.file) {
      console.log(
        `File operation: ${req.method} ${req.path} - File: ${req.file.filename} - Status: ${res.statusCode}`
      );
    }
    originalSend.call(this, data);
  };

  // Override res.json untuk logging
  res.json = function (data) {
    if (req.file) {
      console.log(
        `File operation: ${req.method} ${req.path} - File: ${req.file.filename} - Status: ${res.statusCode}`
      );
    }
    originalJson.call(this, data);
  };

  next();
};
