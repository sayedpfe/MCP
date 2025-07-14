# Claude Desktop Configuration Helper
Write-Host "🔧 Claude Desktop Configuration Helper" -ForegroundColor Green
Write-Host ""

# Get the current project path
$projectPath = Get-Location
Write-Host "Your project path: $projectPath" -ForegroundColor Yellow
Write-Host ""

# Check if Claude folder exists
$claudePath = "$env:APPDATA\Claude"
Write-Host "Checking Claude folder: $claudePath" -ForegroundColor Cyan

if (Test-Path $claudePath) {
    Write-Host "✅ Claude folder found!" -ForegroundColor Green
} else {
    Write-Host "❌ Claude folder not found. Creating it..." -ForegroundColor Red
    New-Item -ItemType Directory -Path $claudePath -Force | Out-Null
    Write-Host "✅ Claude folder created!" -ForegroundColor Green
}
Write-Host ""

# Create the config file
$configFile = "$claudePath\claude_desktop_config.json"
Write-Host "Creating configuration file: $configFile" -ForegroundColor Cyan

# Convert path for JSON (escape backslashes)
$jsonPath = $projectPath.ToString().Replace('\', '\\')

$configContent = @{
    mcpServers = @{
        "mcp-learning-server" = @{
            command = "node"
            args = @("$jsonPath\\build\\index.js")
        }
    }
} | ConvertTo-Json -Depth 3

$configContent | Out-File -FilePath $configFile -Encoding UTF8

Write-Host "✅ Configuration file created!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 What to do next:" -ForegroundColor Yellow
Write-Host "1. Run 'npm run build' to create build/index.js"
Write-Host "2. Restart Claude Desktop completely"
Write-Host "3. Look for the 🔧 tools icon"
Write-Host ""
Write-Host "📁 Config file location: $configFile" -ForegroundColor Cyan
Write-Host "📁 Your project path: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Show the config content
Write-Host "📄 Configuration content:" -ForegroundColor Magenta
Get-Content $configFile
Write-Host ""

Read-Host "Press Enter to continue"
