#!/bin/bash
# Exit on error
set -e

echo "Starting build process..."

# Navigate to Angular project
cd angular

# Install dependencies
echo "Installing Angular dependencies..."
npm install

# Build the Angular app
echo "Building Angular application..."
npm run build

# Return to root
cd ..

# Create dist directory if it doesn't exist
echo "Creating dist directory..."
mkdir -p dist

# Copy all files from Angular build to root dist
echo "Copying Angular build output to dist directory..."
cp -r angular/dist/angular/* dist/

echo "Build completed successfully!" 