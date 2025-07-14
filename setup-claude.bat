@echo off
echo 🔧 Claude Desktop Configuration Helper
echo.

REM Get the current project path
set "PROJECT_PATH=%cd%"
echo Your project path: %PROJECT_PATH%
echo.

REM Check if Claude folder exists
set "CLAUDE_PATH=%APPDATA%\Claude"
echo Checking Claude folder: %CLAUDE_PATH%

if exist "%CLAUDE_PATH%" (
    echo ✅ Claude folder found!
) else (
    echo ❌ Claude folder not found. Creating it...
    mkdir "%CLAUDE_PATH%"
    echo ✅ Claude folder created!
)
echo.

REM Create the config file
set "CONFIG_FILE=%CLAUDE_PATH%\claude_desktop_config.json"
echo Creating configuration file: %CONFIG_FILE%

(
echo {
echo   "mcpServers": {
echo     "mcp-learning-server": {
echo       "command": "node",
echo       "args": ["%PROJECT_PATH:\=\\%\\build\\index.js"]
echo     }
echo   }
echo }
) > "%CONFIG_FILE%"

echo ✅ Configuration file created!
echo.
echo 📋 What to do next:
echo 1. Run 'npm run build' to create build/index.js
echo 2. Restart Claude Desktop completely
echo 3. Look for the 🔧 tools icon
echo.
echo 📁 Config file location: %CONFIG_FILE%
echo 📁 Your project path: %PROJECT_PATH%
echo.
pause
