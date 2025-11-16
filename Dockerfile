# Use Node.js LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port (default 5173, but can be overridden)
EXPOSE ${PORT:-5173}

# Start the dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
