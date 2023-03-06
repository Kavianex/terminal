FROM node:16.19.0-alpine3.16
WORKDIR /app
RUN npm install -g serve
COPY ./package.json ./package.json
RUN npm i -f
COPY . .
RUN npm run build
ENV NODE_ENV production
CMD ["serve", "-s", "build"]