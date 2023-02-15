FROM node:16.19-alpine
WORKDIR /app
COPY ./package.json ./package.json
RUN npm install -g serve
RUN npm i
COPY . .
RUN npm run build
ENV NODE_ENV production
CMD ["serve", "-s", "build"]