@echo off
setlocal

set PROJECT_NAME=college_choice_helper
set FOUND_DIR=
for %%D in (C D) do (
    for /f "delims=" %%F in ('dir "%%D:\%PROJECT_NAME%" /b /s /ad 2^>nul') do (
        set FOUND_DIR=%%F
        goto :FOUND
    )
)

:FOUND
if "%FOUND_DIR%"=="" (
    pause
    exit /b 1
)

cd /d "%FOUND_DIR%"
call npm install

if %errorlevel% neq 0 (
    pause
    exit /b %errorlevel%
)

start cmd /k "cd /d "%FOUND_DIR%" && npm start"

timeout /t 3 >nul
start "" http://localhost:3000/index.html

endlocal
exit /b 0
