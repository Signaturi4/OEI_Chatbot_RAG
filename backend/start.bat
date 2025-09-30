@echo off
REM OEI Chatbot Backend Startup Script for Windows

echo Starting OEI Chatbot Backend...

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file with your API keys before running again.
    pause
    exit /b 1
)

REM Start the server
echo Starting FastAPI server...
python main.py

pause
