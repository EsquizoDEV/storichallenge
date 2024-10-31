FROM node:18

WORKDIR /usr/src/app

COPY package*.json .

RUN rm -rf node_modules package-lock.json

RUN npm install
RUN npm install -g typescript

COPY . .

EXPOSE 5173:5173

CMD ["npm", "run", "dev"]