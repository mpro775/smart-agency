# Usage: .\deploy.ps1 [build|start|stop|restart|logs|rebuild|status]

param(
    [Parameter(Position = 0)]
    [ValidateSet("build", "start", "stop", "restart", "logs", "rebuild", "status")]
    [string]$Action = "build"
)

$ComposeFile = "docker-compose.unified.prod.yml"
$EnvFile = if ($env:ENV_FILE) { $env:ENV_FILE } else { ".env.unified" }

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warn {
    param([string]$Message)
    Write-Host "[WARN] $Message" -ForegroundColor Yellow
}

function Write-Fail {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Fail "Docker is not installed or is not available in PATH."
    exit 1
}

docker compose version *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Docker Compose v2 is not available. Install Docker Compose or update Docker Desktop."
    exit 1
}

if (-not (Test-Path $ComposeFile)) {
    Write-Fail "Compose file not found: $ComposeFile"
    exit 1
}

$ComposeArgs = @("-f", $ComposeFile)
if (Test-Path $EnvFile) {
    $ComposeArgs = @("--env-file", $EnvFile, "-f", $ComposeFile)
} elseif (Test-Path ".env") {
    $ComposeArgs = @("--env-file", ".env", "-f", $ComposeFile)
} else {
    Write-Warn "No .env.unified or .env file found. Compose will use shell environment variables and defaults."
}

function Invoke-Compose {
    param([string[]]$ComposeCommandArgs)
    & docker compose @ComposeArgs @ComposeCommandArgs
    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

switch ($Action) {
    "build" {
        Write-Info "Building Docker images..."
        Invoke-Compose @("build")
        Write-Info "Images built successfully."
    }
    "start" {
        Write-Info "Starting containers with rebuild..."
        Invoke-Compose @("up", "-d", "--build")
        Write-Info "Containers started successfully."
        $FrontendHost = if ($env:FRONTEND_HOST) { $env:FRONTEND_HOST } else { "smartagency-ye.com" }
        $ApiHost = if ($env:API_HOST) { $env:API_HOST } else { "api.smartagency-ye.com" }
        Write-Info "Frontend: https://$FrontendHost"
        Write-Info "Backend API: https://$ApiHost/api"
    }
    "stop" {
        Write-Info "Stopping containers..."
        Invoke-Compose @("down")
        Write-Info "Containers stopped."
    }
    "restart" {
        Write-Info "Restarting containers..."
        Invoke-Compose @("restart")
        Write-Info "Containers restarted."
    }
    "logs" {
        Write-Info "Streaming logs. Press Ctrl+C to exit."
        Invoke-Compose @("logs", "-f")
    }
    "rebuild" {
        Write-Info "Rebuilding and starting containers..."
        Invoke-Compose @("up", "-d", "--build")
        Write-Info "Containers rebuilt and started."
    }
    "status" {
        Write-Info "Container status:"
        Invoke-Compose @("ps")
    }
}
