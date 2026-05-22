#!/bin/bash

# Usage: ./deploy.sh [build|start|stop|restart|logs|rebuild|status]

set -euo pipefail

COMPOSE_FILE="docker-compose.unified.prod.yml"
ENV_FILE="${ENV_FILE:-.env.unified}"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

if ! command -v docker >/dev/null 2>&1; then
    print_error "Docker is not installed or is not available in PATH."
    exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
    print_error "Docker Compose v2 is not available. Install Docker Compose or update Docker Desktop."
    exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
    print_error "Compose file not found: $COMPOSE_FILE"
    exit 1
fi

compose_args=(-f "$COMPOSE_FILE")
if [ -f "$ENV_FILE" ]; then
    compose_args=(--env-file "$ENV_FILE" -f "$COMPOSE_FILE")
elif [ -f ".env" ]; then
    compose_args=(--env-file ".env" -f "$COMPOSE_FILE")
else
    print_warn "No .env.unified or .env file found. Compose will use shell environment variables and defaults."
fi

compose() {
    docker compose "${compose_args[@]}" "$@"
}

case "${1:-build}" in
    build)
        print_info "Building Docker images..."
        compose build
        print_info "Images built successfully."
        ;;
    start)
        print_info "Starting containers with rebuild..."
        compose up -d --build
        print_info "Containers started successfully."
        print_info "Frontend: https://${FRONTEND_HOST:-smartagency-ye.com}"
        print_info "Backend API: https://${API_HOST:-api.smartagency-ye.com}/api"
        ;;
    stop)
        print_info "Stopping containers..."
        compose down
        print_info "Containers stopped."
        ;;
    restart)
        print_info "Restarting containers..."
        compose restart
        print_info "Containers restarted."
        ;;
    logs)
        print_info "Streaming logs. Press Ctrl+C to exit."
        compose logs -f
        ;;
    rebuild)
        print_info "Rebuilding and starting containers..."
        compose up -d --build
        print_info "Containers rebuilt and started."
        ;;
    status)
        print_info "Container status:"
        compose ps
        ;;
    *)
        echo "Usage: ./deploy.sh [build|start|stop|restart|logs|rebuild|status]"
        exit 1
        ;;
esac
