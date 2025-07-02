# Use official Node.js image
FROM node:current-alpine3.20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY app/package*.json ./
RUN npm ci

# Copy application code
COPY app .

# Start the application
CMD ["npm", "start"]