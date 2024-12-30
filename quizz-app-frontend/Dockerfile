FROM node:20 AS base

ARG PORT=3000
ENV PORT=$PORT
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

FROM base AS dependencies

COPY package.json ./

RUN npm install --force

RUN npm ci --only=production --force

FROM base AS build

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM base AS production

ENV NODE_ENV=production

COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/package.json /app/package.json

EXPOSE $PORT

CMD ["npm", "start"]