#!/bin/bash
# Update package index and install curl
yum update -y
yum install -y curl

# Install Node.js (you can replace this with the version you need)
# Download and install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash

# Load nvm into your current shell session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install Node.js version 20
nvm install 20

# Set Node.js version 20 as the default version
nvm use 20
nvm alias default 20

# Verify installation
node -v
npm -v
