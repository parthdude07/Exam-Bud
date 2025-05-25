FROM node:18-alpine
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install


COPY . .
RUN npx prisma generate

EXPOSE 4000


ENTRYPOINT ["sh","-c","\
  echo '⏳ Waiting for Postgres…'; \
  until nc -z db 5432; do sleep 1; done; \
  echo '✅ Pushing schema…'; \
  npx prisma db push; \
  echo '✅ Seeding…'; \
  node prisma/seed.js; \
  echo '🚀 Starting server'; \
  exec node index.js"]
