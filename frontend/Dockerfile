# Step 1: Build the React app with Vite
FROM node:18 AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./ 
RUN npm install

# Copy the .env file
COPY .env ./

# Copy the source code
COPY . ./ 

# Build the React app for production (Vite creates the dist directory)
RUN npm run build 

# Step 2: Set up the NGINX server
FROM nginx:alpine

# Copy the dist folder from the build stage into NGINX's serving directory
COPY --from=build /app/dist /usr/share/nginx/html 
COPY --from=build /app/nginx /etc/nginx/conf.d
RUN rm /etc/nginx/conf.d/default.conf 

# Expose port 80 to serve the app
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
