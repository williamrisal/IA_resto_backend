# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application files
COPY . .

# Expose the port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
