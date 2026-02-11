@echo off
echo Starting Gold Backend Server...
cd /d %~dp0
call venv\Scripts\activate
python main.py
pause
