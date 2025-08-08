#!/bin/bash

echo "Starting API server..."

# Check if environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "ERROR: DATABASE_URL is not set"
    exit 1
fi

if [ -z "$CLERK_SECRET_KEY" ]; then
    echo "ERROR: CLERK_SECRET_KEY is not set"
    exit 1
fi

if [ -z "$GOOGLE_API_KEY" ]; then
    echo "ERROR: GOOGLE_API_KEY is not set"
    exit 1
fi

echo "Environment variables check passed"
echo "Starting server on port ${PORT:-8000}"

# Start the server
npm start 