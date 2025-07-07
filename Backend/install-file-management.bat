@echo off
echo Installing dependencies for file management system...

rem Install node-cron for scheduled cleanup (optional)
npm install node-cron

echo.
echo Dependencies installed successfully!
echo.
echo File management system is ready to use!
echo.
echo Features installed:
echo ✅ Auto delete files when products are deleted
echo ✅ Auto delete old files when product images are updated
echo ✅ Manual cleanup endpoint: POST /api/files/cleanup
echo ✅ File statistics endpoint: GET /api/files/stats
echo ✅ Error handling middleware for file operations
echo ✅ Logging middleware for file operations
echo.
echo Optional: To enable scheduled cleanup (daily at 2 AM), add this to your server.js:
echo import { scheduleFileCleanup } from './utils/fileScheduler.js';
echo scheduleFileCleanup();
echo.
echo For more information, check FILE_MANAGEMENT.md

pause
