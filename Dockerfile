FROM node:16.16.0

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -qq build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

COPY package.json ./package.json

COPY tsconfig.json ./tsconfig.json

RUN npm install && npm install typescript -g

COPY src ./src

RUN npm run build

COPY . .

CMD ["/bin/sh", "-c", "node dist/index.js"]