FROM node:24.15.0 AS node
WORKDIR /app
COPY package.json .
RUN npm install --verbose
COPY public public/
COPY src src/
COPY .env.production .
COPY index.html .
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .
RUN npm run build

FROM nginx:1.31.0
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist /usr/share/nginx/html
RUN unlink /var/log/nginx/access.log
RUN unlink /var/log/nginx/error.log
