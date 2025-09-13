# Use official multi-architecture Nginx image
FROM nginx:alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy your static site content to nginx html folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]

