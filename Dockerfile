FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production-stage

WORKDIR /app

COPY --from=build-stage /app/dist/client-managemente-ui ./dist/client-managemente-ui

COPY --from=build-stage /app/server.ts ./
COPY --from=build-stage /app/package*.json ./

RUN npm install --only=production

EXPOSE 4000

CMD ["node", "dist/client-managemente-ui/server/server.mjs"]
