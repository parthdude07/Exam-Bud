FROM node:18-alpine
WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 3001
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","3001"]
