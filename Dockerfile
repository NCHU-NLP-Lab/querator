FROM node:12-alpine AS build

WORKDIR /app

# Install modules
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy and build app
COPY . .
RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
