# Use an official Node.js runtime as a base image
FROM node:20.9.0-alpine3.18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that your app will run on
EXPOSE 3000

# Set the command to run your Next.js application
CMD ["npm", "start"]
