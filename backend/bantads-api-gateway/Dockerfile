FROM node:16
WORKDIR /usr/src/app

#Install dependencies
COPY package*.json ./
RUN npm install

#Copy code
COPY . .

CMD [ "node", "index.js" ]