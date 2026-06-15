@echo off
REM Helper script to run the Vision Agent server using the local virtual environment
pushd %~dp0
echo Starting Vision Agent server...
if exist ".venv\Scripts\python.exe" (
    .venv\Scripts\python.exe main.py serve
) else (
    echo Error: Virtual environment not found at .venv\Scripts\python.exe
    echo Please ensure you have installed the dependencies.
    pause
)
popd
