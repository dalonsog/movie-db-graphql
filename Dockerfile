FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

ADD patch /app/node_modules/

COPY . .

RUN npm run build

EXPOSE 4000

ENV NODE_ENV=production
CMD ["npm", "start"]