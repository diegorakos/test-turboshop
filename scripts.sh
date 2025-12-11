#!/bin/bash

# Marketplace de Repuestos - Development Helper Scripts

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}→${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Marketplace de Repuestos - CLI Helper  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo

# Check Node.js installation
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

print_success "Node.js version: $(node --version)"

# Parse command
COMMAND="${1:-help}"

case "$COMMAND" in
    install)
        print_status "Installing dependencies..."
        
        print_status "Installing backend dependencies..."
        cd "$SCRIPT_DIR/backend/test-turboshop"
        npm install
        
        print_status "Installing frontend dependencies..."
        cd "$SCRIPT_DIR/frontend/test-turboshop"
        npm install
        
        print_success "Dependencies installed!"
        ;;
        
    dev)
        print_status "Starting development environment..."
        print_warning "Make sure both backend and frontend have node_modules installed"
        print_warning "Run './scripts.sh install' first if needed"
        echo
        
        print_status "Backend will run on: http://localhost:3000"
        print_status "Frontend will run on: http://localhost:3001"
        echo
        
        print_warning "Opening two terminal windows..."
        print_warning "Backend starting in 3 seconds..."
        sleep 3
        
        cd "$SCRIPT_DIR/backend/test-turboshop"
        npm run start:dev &
        BACKEND_PID=$!
        
        sleep 2
        
        print_warning "Frontend starting..."
        cd "$SCRIPT_DIR/frontend/test-turboshop"
        npm run dev &
        FRONTEND_PID=$!
        
        print_success "Development environment started!"
        print_status "Backend PID: $BACKEND_PID"
        print_status "Frontend PID: $FRONTEND_PID"
        
        # Keep the script running
        wait
        ;;
        
    build)
        print_status "Building project..."
        
        print_status "Building backend..."
        cd "$SCRIPT_DIR/backend/test-turboshop"
        npm run build
        print_success "Backend built"
        
        print_status "Building frontend..."
        cd "$SCRIPT_DIR/frontend/test-turboshop"
        npm run build
        print_success "Frontend built"
        
        print_success "Project built successfully!"
        ;;
        
    test:backend)
        print_status "Running backend tests..."
        cd "$SCRIPT_DIR/backend/test-turboshop"
        npm test
        ;;
        
    test:e2e)
        print_status "Running E2E tests..."
        cd "$SCRIPT_DIR/backend/test-turboshop"
        npm run test:e2e
        ;;
        
    lint)
        print_status "Linting code..."
        
        print_status "Linting backend..."
        cd "$SCRIPT_DIR/backend/test-turboshop"
        npm run lint
        
        print_status "Linting frontend..."
        cd "$SCRIPT_DIR/frontend/test-turboshop"
        npm run lint
        
        print_success "Linting complete!"
        ;;
        
    format)
        print_status "Formatting code..."
        
        print_status "Formatting backend..."
        cd "$SCRIPT_DIR/backend/test-turboshop"
        npm run format
        
        print_success "Code formatted!"
        ;;
        
    clean)
        print_status "Cleaning up..."
        
        print_status "Removing backend build..."
        rm -rf "$SCRIPT_DIR/backend/test-turboshop/dist"
        
        print_status "Removing frontend build..."
        rm -rf "$SCRIPT_DIR/frontend/test-turboshop/.next"
        
        print_success "Cleanup complete!"
        ;;
        
    docker:build)
        print_status "Building Docker images..."
        docker-compose -f "$SCRIPT_DIR/docker-compose.yml" build
        print_success "Docker images built!"
        ;;
        
    docker:up)
        print_status "Starting Docker containers..."
        docker-compose -f "$SCRIPT_DIR/docker-compose.yml" up
        ;;
        
    docker:down)
        print_status "Stopping Docker containers..."
        docker-compose -f "$SCRIPT_DIR/docker-compose.yml" down
        print_success "Containers stopped!"
        ;;
        
    docker:logs)
        print_status "Showing Docker logs..."
        docker-compose -f "$SCRIPT_DIR/docker-compose.yml" logs -f
        ;;
        
    info)
        echo
        echo -e "${BLUE}═══════════════════════════════════════${NC}"
        echo -e "${BLUE}    Marketplace de Repuestos - Info${NC}"
        echo -e "${BLUE}═══════════════════════════════════════${NC}"
        echo
        echo -e "${GREEN}📁 Project Structure:${NC}"
        echo "  - backend/test-turboshop/     Backend (NestJS)"
        echo "  - frontend/test-turboshop/    Frontend (Next.js)"
        echo "  - README.md                   Main documentation"
        echo "  - ARCHITECTURE.md             Technical design"
        echo "  - DEPLOYMENT.md               Deploy to Railway"
        echo "  - API.md                      API documentation"
        echo "  - QUICK_START.md              Quick setup guide"
        echo
        echo -e "${GREEN}🚀 Development URLs:${NC}"
        echo "  - Frontend:     http://localhost:3001"
        echo "  - Backend:      http://localhost:3000"
        echo "  - API:          http://localhost:3000/api"
        echo
        echo -e "${GREEN}📦 Production URLs:${NC}"
        echo "  - Frontend:     https://<frontend>.up.railway.app"
        echo "  - Backend:      https://<backend>.up.railway.app/api"
        echo
        echo -e "${GREEN}🔧 Quick Commands:${NC}"
        echo "  install        Install all dependencies"
        echo "  dev            Start development environment"
        echo "  build          Build both backend and frontend"
        echo "  lint           Lint all code"
        echo "  format         Format code"
        echo "  clean          Clean build artifacts"
        echo "  docker:build   Build Docker images"
        echo "  docker:up      Start Docker containers"
        echo "  docker:down    Stop Docker containers"
        echo "  docker:logs    Show Docker logs"
        echo "  test:backend   Run backend tests"
        echo "  test:e2e       Run E2E tests"
        echo
        ;;
        
    help)
        echo
        echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
        echo -e "${BLUE}║        Available Commands              ║${NC}"
        echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
        echo
        echo -e "${GREEN}Development:${NC}"
        echo "  install           Install dependencies"
        echo "  dev               Start dev environment (backend + frontend)"
        echo "  build             Build production bundles"
        echo
        echo -e "${GREEN}Code Quality:${NC}"
        echo "  lint              Lint all code"
        echo "  format            Format code with Prettier"
        echo "  clean             Remove build artifacts"
        echo
        echo -e "${GREEN}Testing:${NC}"
        echo "  test:backend      Run backend unit tests"
        echo "  test:e2e          Run E2E tests"
        echo
        echo -e "${GREEN}Docker:${NC}"
        echo "  docker:build      Build Docker images"
        echo "  docker:up         Start containers"
        echo "  docker:down       Stop containers"
        echo "  docker:logs       View logs"
        echo
        echo -e "${GREEN}Info:${NC}"
        echo "  info              Show project information"
        echo "  help              Show this help message"
        echo
        echo -e "${BLUE}Examples:${NC}"
        echo "  ./scripts.sh install"
        echo "  ./scripts.sh dev"
        echo "  ./scripts.sh build"
        echo "  ./scripts.sh docker:up"
        echo
        ;;
        
    *)
        print_error "Unknown command: $COMMAND"
        print_status "Run './scripts.sh help' for available commands"
        exit 1
        ;;
esac
