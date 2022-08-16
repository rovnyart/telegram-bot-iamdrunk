FROM node:alpine as build

WORKDIR /app/

COPY . .

RUN npm ci

RUN npm run build

FROM node:alpine

WORKDIR /app/

COPY --from=build /app/package*.json .
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

CMD ["node", "dist/app.js"]
