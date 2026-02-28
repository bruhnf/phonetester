# Use official Node.js 20 LTS (Linux-based)
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy package files first → better layer caching (optimization)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your Express app uses
EXPOSE 3000

# Command to run the app (use node for production-like; nodemon optional for dev)
# CMD ["node", "app.js"]
CMD ["npm", "start"]