FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine AS production-stage

WORKDIR /app

COPY --from=build-stage /app/dist/client-management-ui ./dist/client-management-ui

COPY --from=build-stage /app/server.ts ./
COPY --from=build-stage /app/package*.json ./

RUN npm install --only=production

EXPOSE 4000

CMD ["node", "dist/client-management-ui/server/server.mjs"]