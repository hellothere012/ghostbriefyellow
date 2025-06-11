#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}SECURITY WARNING:${NC}"
echo "Please do not share API keys in plain text or commit them to version control."
echo "If you have accidentally exposed an API key, please rotate it immediately."
echo "----------------------------------------"

echo -e "${GREEN}Ghost Brief Deployment Script${NC}"
echo "This script will help you deploy the application to Google Cloud Run"
echo "You will be prompted for credentials at specific points"
echo "----------------------------------------"

# Check for required tools
check_requirements() {
    echo -e "${YELLOW}Checking requirements...${NC}"
    
    # Check for Node.js
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Node.js is not installed. Please install Node.js 18 or later.${NC}"
        exit 1
    fi
    
    # Check for Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Docker is not installed. Please install Docker.${NC}"
        exit 1
    fi
    
    # Check for gcloud
    if ! command -v gcloud &> /dev/null; then
        echo -e "${RED}Google Cloud SDK is not installed. Please install it from:${NC}"
        echo "https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    echo -e "${GREEN}All requirements met!${NC}"
}

# Setup environment
setup_environment() {
    echo -e "${YELLOW}Setting up environment...${NC}"
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo -e "${YELLOW}Please enter your Claude API key (input will be hidden):${NC}"
        read -s claude_key
        echo "ANTHROPIC_API_KEY=$claude_key" > .env
        echo -e "${GREEN}Created .env file${NC}"
        # Clear the variable from memory
        unset claude_key
    fi
    
    # Install dependencies
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install
}

# Google Cloud Setup
setup_gcloud() {
    echo -e "${YELLOW}Setting up Google Cloud...${NC}"
    
    # Login to Google Cloud
    echo -e "${YELLOW}Please login to Google Cloud...${NC}"
    gcloud auth login
    
    # Get project ID
    echo -e "${YELLOW}Please enter your Google Cloud Project ID:${NC}"
    read project_id
    gcloud config set project $project_id
    
    # Configure Docker to use Google Cloud credentials
    gcloud auth configure-docker
    
    # Enable required APIs
    echo -e "${YELLOW}Enabling required APIs...${NC}"
    gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com containerregistry.googleapis.com
    
    # Store Claude API key in Secret Manager
    echo -e "${YELLOW}Storing Claude API key in Secret Manager...${NC}"
    echo -e "${YELLOW}Please enter your Claude API key again (input will be hidden):${NC}"
    read -s claude_key
    echo "$claude_key" | gcloud secrets create ghost-brief-claude-key --data-file=-
    # Clear the variable from memory
    unset claude_key
}

# Build and Deploy
deploy() {
    echo -e "${YELLOW}Building and deploying application...${NC}"
    
    # Set default region
    gcloud config set run/region us-central1
    
    # Build Docker image
    echo -e "${YELLOW}Building Docker image...${NC}"
    docker build -t gcr.io/$project_id/ghost-brief-api .
    
    # Push to Container Registry
    echo -e "${YELLOW}Pushing to Container Registry...${NC}"
    docker push gcr.io/$project_id/ghost-brief-api
    
    # Deploy to Cloud Run
    echo -e "${YELLOW}Deploying to Cloud Run...${NC}"
    gcloud run deploy ghost-brief-api \
        --image gcr.io/$project_id/ghost-brief-api \
        --platform managed \
        --allow-unauthenticated \
        --memory 512Mi \
        --cpu 1 \
        --min-instances 0 \
        --max-instances 10 \
        --concurrency 100 \
        --timeout 300 \
        --set-env-vars NODE_ENV=production \
        --set-secrets ANTHROPIC_API_KEY=ghost-brief-claude-key:latest
}

# Verify deployment
verify_deployment() {
    echo -e "${YELLOW}Verifying deployment...${NC}"
    
    # Get service URL
    service_url=$(gcloud run services describe ghost-brief-api --format='value(status.url)')
    
    # Test health endpoint
    echo -e "${YELLOW}Testing health endpoint...${NC}"
    curl -s $service_url/api/health
    
    echo -e "${GREEN}Deployment complete!${NC}"
    echo -e "Your service is available at: ${GREEN}$service_url${NC}"
}

# Main execution
main() {
    check_requirements
    setup_environment
    setup_gcloud
    deploy
    verify_deployment
}

# Run the script
main 