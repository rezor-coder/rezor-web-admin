#!/bin/bash

# Navigate to the application directory
cd /home/ubuntu/myapp1 || { echo "Directory /home/ubuntu/myapp does not exist."; exit 1; }

# Source nvm (assuming it was installed in the previous script)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if npm is available
if ! command -v npm &> /dev/null
then
    echo "npm not found. Please ensure Node.js is installed properly."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building the application..."
npm run build
