# # Base image
# FROM node:16-alpine

# #  Create app directory
# WORKDIR /quangney/backend-nest

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# # Install app dependencies
# RUN npm install --legacy-peer-deps

# RUN npm i -g @nestjs/cli@10.0.3

# # Bundle app source
# COPY . .

# # Creates a "dist" folder with the produvtion build
# RUN npm run build 

# # Start the server using the production build 
# CMD [ "node", "dist/main.js" ]

# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /quangney/backend-nest

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Install NestJS CLI globally
RUN npm i -g @nestjs/cli@10.0.3

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8989

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
