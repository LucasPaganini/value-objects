FROM node:12.16.3 AS base
RUN npm install -g npm@6.14.5

FROM base AS all-dependencies
COPY scripts ./var/www/scripts/
COPY package.json package-lock.json ./var/www/
COPY website/package.json website/package-lock.json ./var/www/website/
WORKDIR /var/www
RUN npm ci
WORKDIR /var/www/website
RUN npm ci
WORKDIR /var/www

FROM base AS prod-dependencies
COPY --from=all-dependencies /var/www/website ./var/www/website/
WORKDIR /var/www/website
RUN npm prune --production
WORKDIR /var/www

FROM all-dependencies AS build
COPY . .
RUN scripts/build-website

FROM prod-dependencies AS release
COPY --from=build /var/www/website/main.js ./website/
COPY --from=build /var/www/website/dist ./website/dist/
COPY --from=build /var/www/website/api ./website/api/

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE $PORT
WORKDIR /var/www/website
CMD npm start
