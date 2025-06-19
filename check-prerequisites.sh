#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking Ghost Brief deployment prerequisites...${NC}"
echo "----------------------------------------"

# Function to check version
check_version() {
    local tool=$1
    local min_version=$2
    local version_cmd=$3
    
    if command -v $tool &> /dev/null; then
        version=$($version_cmd)
        echo -e "${GREEN}✓ $tool is installed${NC}"
        echo "  Version: $version"
    else
        echo -e "${RED}✗ $tool is not installed${NC}"
        echo "  Please install $tool version $min_version or later"
    fi
}

# Check Node.js
echo -e "\n${YELLOW}Checking Node.js...${NC}"
check_version "node" "18" "node --version"

# Check npm
echo -e "\n${YELLOW}Checking npm...${NC}"
check_version "npm" "8" "npm --version"

# Check Docker
echo -e "\n${YELLOW}Checking Docker...${NC}"
if command -v docker &> /dev/null; then
    docker_version=$(docker --version)
    echo -e "${GREEN}✓ Docker is installed${NC}"
    echo "  Version: $docker_version"
    
    # Check if Docker daemon is running
    if docker info &> /dev/null; then
        echo -e "${GREEN}✓ Docker daemon is running${NC}"
    else
        echo -e "${RED}✗ Docker daemon is not running${NC}"
        echo "  Please start Docker Desktop or the Docker daemon"
    fi
else
    echo -e "${RED}✗ Docker is not installed${NC}"
    echo "  Please install Docker Desktop from: https://www.docker.com/products/docker-desktop"
fi

# Check Google Cloud SDK
echo -e "\n${YELLOW}Checking Google Cloud SDK...${NC}"
if command -v gcloud &> /dev/null; then
    gcloud_version=$(gcloud --version | head -n 1)
    echo -e "${GREEN}✓ Google Cloud SDK is installed${NC}"
    echo "  Version: $gcloud_version"
    
    # Check if user is logged in
    if gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
        echo -e "${GREEN}✓ Google Cloud is authenticated${NC}"
    else
        echo -e "${YELLOW}! Google Cloud is not authenticated${NC}"
        echo "  You will need to run 'gcloud auth login' during deployment"
    fi
else
    echo -e "${RED}✗ Google Cloud SDK is not installed${NC}"
    echo "  Please install from: https://cloud.google.com/sdk/docs/install"
fi

echo -e "\n${YELLOW}Prerequisites check complete!${NC}"
echo "----------------------------------------"
echo "If you see any ${RED}✗${NC} marks above, please install those components before running the deployment script."
echo "If you see any ${YELLOW}!${NC} marks, you'll need to complete those steps during deployment."
echo "If everything shows ${GREEN}✓${NC}, you're ready to run the deployment script!" 