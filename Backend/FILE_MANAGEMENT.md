# File Management System

Sistem ini secara otomatis mengelola file-file yang diupload ke aplikasi, terutama gambar produk. Ketika produk dihapus atau gambar diupdate, file lama akan otomatis dihapus dari server.

## Fitur

1. **Auto Delete saat Hapus Produk**: File gambar otomatis dihapus ketika produk dihapus
2. **Auto Delete saat Update Gambar**: File gambar lama otomatis dihapus ketika gambar produk diupdate
3. **Manual Cleanup**: Endpoint untuk membersihkan file yang tidak digunakan
4. **File Statistics**: Endpoint untuk melihat statistik file
5. **Scheduled Cleanup**: Cleanup otomatis yang berjalan setiap hari (optional)

## Endpoints

### 1. Get File Statistics

```
GET /api/files/stats
```

Menampilkan statistik file yang ada di folder uploads.

Response:

```json
{
  "totalFiles": 10,
  "usedFiles": 5,
  "unusedFiles": 5,
  "files": {
    "all": ["file1.jpg", "file2.jpg", ...],
    "used": ["file1.jpg", "file2.jpg", ...],
    "unused": ["file3.jpg", "file4.jpg", ...]
  }
}
```

### 2. Manual Cleanup

```
POST /api/files/cleanup
```

Membersihkan file-file yang tidak digunakan di database.

Response:

```json
{
  "message": "File cleanup completed",
  "results": {
    "deleted": ["unused1.jpg", "unused2.jpg"],
    "errors": [],
    "totalFiles": 10,
    "usedFiles": 5,
    "unusedFiles": 5
  }
}
```

## Automatic Features

### 1. Auto Delete saat Hapus Produk

File gambar otomatis dihapus ketika produk dihapus melalui:

- `DELETE /api/products/:id`

### 2. Auto Delete saat Update Gambar

File gambar lama otomatis dihapus ketika gambar produk diupdate melalui:

- `PUT /api/products/:id` (dengan upload gambar baru)

## Scheduled Cleanup (Optional)

Jika ingin mengaktifkan scheduled cleanup otomatis, tambahkan di `server.js`:

```javascript
import { scheduleFileCleanup } from "./utils/fileScheduler.js";

// Setelah server start
scheduleFileCleanup(); // Cleanup otomatis setiap hari jam 2 pagi
```

## Dependencies

Untuk menggunakan scheduled cleanup, install node-cron:

```bash
npm install node-cron
```

## File Structure

```
utils/
├── fileUtils.js          # Utility functions untuk file management
└── fileScheduler.js      # Scheduled cleanup functions

controller/
└── FileController.js     # Controller untuk file management endpoints

routes/
└── FileRoute.js          # Routes untuk file management
```

## Security

- Semua endpoint file management memerlukan authentication (verifyToken)
- File hanya dihapus dari direktori `public/uploads`
- Sistem tidak akan menghapus file yang masih digunakan di database

## Monitoring

- Semua operasi file dicatat di console log
- Error handling untuk operasi file yang gagal
- Statistik lengkap tentang file yang digunakan dan tidak digunakan
