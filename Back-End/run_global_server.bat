@echo off
echo ==========================================
echo Starting Gold Backend ^& Cloudflare Tunnel
echo ==========================================

cd /d %~dp0

:: Start the Python Backend in a new window
echo Launching Backend on port 8000...
start "Gold Backend" cmd /c "call venv\Scripts\activate && python main.py"

:: Wait a few seconds for backend to warm up
timeout /t 5

:: Start the Cloudflare Tunnel using npx (No manual install needed)
echo Launching Cloudflare Tunnel...
echo ----------------------------------------------------------
echo LOOK FOR THE LINK ENDING IN .trycloudflare.com BELOW
echo ----------------------------------------------------------
npx cloudflared tunnel --url http://localhost:8000

pause
