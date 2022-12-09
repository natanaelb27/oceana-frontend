# build
FROM node:16.17.1-alpine as build
WORKDIR /app
COPY . .

# production
# Use NgInx alpine image 
FROM nginx:stable-alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
# Copy dist folder fro build stage to nginx public folder
COPY --from=build /app/build /usr/share/nginx/html
# Copy nginx config file
COPY --from=build /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
# Start NgInx service
CMD ["nginx","-g","daemon off;"]