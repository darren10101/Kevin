# Stage 1: Build the frontend
FROM node:20-bullseye AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built frontend with a lightweight image
FROM nginx:alpine

# Copy the build files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 to the host
EXPOSE 80

# Start nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
