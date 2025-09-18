# Stage 1: Build the Angular application
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
# --- CHANGE 1: Use npm ci for a reliable install ---
RUN npm ci
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: Serve the application from Nginx
FROM nginx:alpine
# --- CHANGE 2: Correct the build output path ---
COPY --from=build /usr/src/app/dist/frontend/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80