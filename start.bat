@echo off
TITLE Gold Project Runner
echo ==========================================
echo    Gold Project: Backend ^& Frontend
echo ==========================================
echo.

echo [0/2] Cleaning up previous sessions...
for /f "tokens=5" %%a in ('netstat -aon ^^| findstr :8000 ^^| findstr LISTENING') do taskkill /f /pid %%a 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^^| findstr :3000 ^^| findstr LISTENING') do taskkill /f /pid %%a 2>nul
echo Done cleanup.
echo.

echo [1/2] Starting Backend Server...
start "Gold Backend" cmd /k "cd Back-End && venv\Scripts\activate && python main.py"

echo [2/2] Starting Frontend App...
start "Gold Frontend" cmd /k "cd front-end && npm run dev"

echo.
echo ==========================================
echo Project is running! 
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo ==========================================
echo.
pause
