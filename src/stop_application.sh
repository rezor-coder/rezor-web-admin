\#!/bin/bash

# Navigate to the application directory
cd /home/ubuntu/myapp1 || { echo "Directory /home/ubuntu/myapp does not exist."; exit 1; }

# Source nvm to ensure npm is available
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Verify npm is available
if ! command -v npm &> /dev/null
then
    echo "npm not found. Please ensure Node.js is installed properly."
    exit 1
fi

# Install pm2 if not already installed
if ! command -v pm2 &> /dev/null
then
    echo "pm2 not found. Installing pm2..."
    npm install -g pm2
fi

pm2 stop myapp
pm2 delete myapp
